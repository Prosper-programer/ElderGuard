#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_MLX90614.h>
#include <RTClib.h>
#include "MAX30105.h"
#include "heartRate.h"
#include "spo2_algorithm.h"

// =====================================================================
// WIRING NOTE
// ---------------------------------------------------------------------
// Confirmed: the MLX90614 (temp) and DS3231 (RTC) are physically wired
// on the OLED's I2C bus (pins 6/7), same as the original sketch. An
// earlier revision of this file guessed otherwise based on pin naming
// and broke temp/RTC detection — reverted here. The OLED bus clock is
// kept at 100kHz (not 400kHz) because the MLX90614 doesn't reliably
// support Fast Mode.
// =====================================================================

#define OLED_SDA 6
#define OLED_SCL 7

#define SENSOR_SDA 23
#define SENSOR_SCL 22

#define OLED_ADDR 0x3C

#define LED_RED 15
#define LED_YELLOW 16
#define LED_GREEN 17
#define LED_BLUE 18
#define BUZZER 19

// ---- Optional battery monitoring ----
// If you have a voltage divider from the battery into an ADC-capable pin,
// uncomment these three lines and set the values to match your divider.
// Without this, `battery` stays at the placeholder value below.
// #define BATTERY_ENABLED
// #define BATTERY_ADC_PIN 34
// #define BATTERY_R1 10000.0
// #define BATTERY_R2 10000.0

TwoWire I2C_SENSOR = TwoWire(0);
TwoWire I2C_OLED = TwoWire(1);

Adafruit_SSD1306 display(128, 64, &I2C_OLED, -1);
Adafruit_MLX90614 mlx;
MAX30105 max30102;
RTC_DS3231 rtc;

bool oledOK = false;
bool mlxOK = false;
bool maxOK = false;
bool rtcOK = false;

float bpm = 0;
float avgBpm = 0;
float temperature = 0;

int spo2 = 0;
bool spo2Valid = false;

float perfusionIndex = 0;
bool piValid = false;

int battery = 80;

byte rates[4];
byte rateIndex = 0;
byte beatCount = 0;

long lastBeat = 0;

// ---- Beat pulse (real-time visual feedback on the heart icon) ----
bool beatPulseActive = false;
unsigned long beatPulseStart = 0;
const unsigned long BEAT_PULSE_MS = 120;

// ---- HRV (RMSSD over recent RR intervals) ----
#define HRV_SAMPLES 8
unsigned long rrIntervals[HRV_SAMPLES];
byte rrCount = 0;
float hrv = -1;  // -1 = not enough data yet

// ---- Display refresh timing (decoupled from sensor sampling) ----
unsigned long lastDisplayUpdate = 0;
const unsigned long DISPLAY_INTERVAL_MS = 100;  // ~10 fps

#define BUFFER_SIZE 100

uint32_t irBuffer[BUFFER_SIZE];
uint32_t redBuffer[BUFFER_SIZE];

int bufferIndex = 0;

int32_t spo2Value;
int8_t validSpO2;
int32_t heartRateValue;
int8_t validHeartRate;

bool found(TwoWire &bus, byte address) {
  bus.beginTransmission(address);
  return bus.endTransmission() == 0;
}

void beep() {
  tone(BUZZER, 2000);
  delay(80);
  noTone(BUZZER);
}

void leds(bool r, bool y, bool g, bool b) {
  digitalWrite(LED_RED, r);
  digitalWrite(LED_YELLOW, y);
  digitalWrite(LED_GREEN, g);
  digitalWrite(LED_BLUE, b);
}

// ---------------------------------------------------------------------
// Derived vitals helpers
// ---------------------------------------------------------------------

void pushRRInterval(unsigned long deltaMs) {
  if (rrCount < HRV_SAMPLES) {
    rrIntervals[rrCount++] = deltaMs;
  } else {
    // shift left, drop oldest
    for (byte i = 1; i < HRV_SAMPLES; i++) {
      rrIntervals[i - 1] = rrIntervals[i];
    }
    rrIntervals[HRV_SAMPLES - 1] = deltaMs;
  }

  if (rrCount >= 3) {
    // RMSSD: root mean square of successive differences between RR intervals
    double sumSq = 0;
    byte pairs = 0;

    for (byte i = 1; i < rrCount; i++) {
      double diff = (double)rrIntervals[i] - (double)rrIntervals[i - 1];
      sumSq += diff * diff;
      pairs++;
    }

    if (pairs > 0) {
      hrv = sqrt(sumSq / pairs);
    }
  }
}

void resetDerivedVitals() {
  avgBpm = 0;
  beatCount = 0;
  spo2Valid = false;
  piValid = false;
  perfusionIndex = 0;
  hrv = -1;
  rrCount = 0;
  bufferIndex = 0;
  beatPulseActive = false;
}

#ifdef BATTERY_ENABLED
void readBattery() {
  int raw = analogRead(BATTERY_ADC_PIN);
  float vAdc = (raw / 4095.0) * 3.3;  // ESP32 ADC reference, adjust if using attenuation
  float vBatt = vAdc * (BATTERY_R1 + BATTERY_R2) / BATTERY_R2;

  // Rough LiPo linear map, 3.3V (empty) - 4.2V (full). Not accurate under load,
  // but good enough for a coarse percentage indicator.
  int pct = (int)((vBatt - 3.3) / (4.2 - 3.3) * 100.0);

  battery = constrain(pct, 0, 100);
}
#endif

// ---------------------------------------------------------------------
// Sensor reading
// ---------------------------------------------------------------------

void handleSample(long ir, long red) {
  if (ir < 30000) {
    resetDerivedVitals();
    return;
  }

  // ---- Heart rate: real-time, per-beat update ----
  if (checkForBeat(ir)) {
    long now = millis();
    long delta = now - lastBeat;
    lastBeat = now;

    if (delta > 0) {
      float value = 60.0 / (delta / 1000.0);

      if (value >= 40 && value <= 220) {
        rates[rateIndex++] = (byte)value;
        if (rateIndex >= 4) rateIndex = 0;
        if (beatCount < 4) beatCount++;

        float total = 0;
        for (byte i = 0; i < beatCount; i++)
          total += rates[i];

        avgBpm = total / beatCount;

        pushRRInterval((unsigned long)delta);

        beatPulseActive = true;
        beatPulseStart = now;
      }
    }
  }

  // ---- SpO2 buffering ----
  irBuffer[bufferIndex] = (uint32_t)ir;
  redBuffer[bufferIndex] = (uint32_t)red;
  bufferIndex++;

  if (bufferIndex < BUFFER_SIZE) return;

  bufferIndex = 0;

  maxim_heart_rate_and_oxygen_saturation(
    irBuffer,
    BUFFER_SIZE,
    redBuffer,
    &spo2Value,
    &validSpO2,
    &heartRateValue,
    &validHeartRate);

  if (validSpO2 && spo2Value >= 70 && spo2Value <= 100) {
    spo2 = spo2Value;
    spo2Valid = true;
  }

  // Perfusion Index: AC/DC ratio of the IR signal over this window.
  uint32_t irMin = irBuffer[0];
  uint32_t irMax = irBuffer[0];
  uint64_t irSum = 0;

  for (int i = 0; i < BUFFER_SIZE; i++) {
    if (irBuffer[i] < irMin) irMin = irBuffer[i];
    if (irBuffer[i] > irMax) irMax = irBuffer[i];
    irSum += irBuffer[i];
  }

  float irDC = (float)irSum / BUFFER_SIZE;

  if (irDC > 0) {
    float irAC = (float)(irMax - irMin);
    perfusionIndex = (irAC / irDC) * 100.0;
    piValid = true;
  }
}

void sampleAndProcess() {
  if (!maxOK) return;

  max30102.check();

  // Drain every fresh sample sitting in the sensor's FIFO, exactly once
  // each, and feed each one to both the beat detector and the SpO2
  // buffer. This is the standard SparkFun MAX3010x consumption pattern —
  // having two separate functions each independently peek/consume the
  // same FIFO (as before) causes them to race over the same samples.
  while (max30102.available()) {
    long ir = max30102.getIR();
    long red = max30102.getRed();
    max30102.nextSample();

    handleSample(ir, red);
  }
}

void readTemperature() {
  if (!mlxOK)
    return;

  float value = mlx.readObjectTempC();

  if (!isnan(value))
    temperature = value;
}

void updateLEDs() {
  if (!maxOK || avgBpm == 0) {
    leds(false, false, false, true);
    return;
  }

  if (avgBpm > 120 || avgBpm < 45) {
    leds(true, false, false, false);
    return;
  }

  if (avgBpm >= 60 && avgBpm <= 100) {
    leds(false, false, true, false);
    return;
  }

  leds(false, true, false, false);
}

// ---------------------------------------------------------------------
// Icon drawing (small primitives, sized for a 128x64 mono OLED)
// ---------------------------------------------------------------------

void drawHeartIcon(int x, int y, bool filled) {
  if (filled) {
    display.fillCircle(x + 3, y + 3, 3, SSD1306_WHITE);
    display.fillCircle(x + 8, y + 3, 3, SSD1306_WHITE);
    display.fillTriangle(x, y + 4, x + 11, y + 4, x + 5, y + 11, SSD1306_WHITE);
  } else {
    display.drawCircle(x + 3, y + 3, 3, SSD1306_WHITE);
    display.drawCircle(x + 8, y + 3, 3, SSD1306_WHITE);
    display.drawLine(x, y + 4, x + 5, y + 11, SSD1306_WHITE);
    display.drawLine(x + 11, y + 4, x + 5, y + 11, SSD1306_WHITE);
  }
}

void drawDropIcon(int x, int y) {
  display.fillTriangle(x + 4, y, x, y + 7, x + 8, y + 7, SSD1306_WHITE);
  display.fillCircle(x + 4, y + 7, 4, SSD1306_WHITE);
}

void drawThermoIcon(int x, int y) {
  display.drawRoundRect(x, y, 5, 10, 2, SSD1306_WHITE);
  display.drawLine(x + 2, y + 2, x + 2, y + 9, SSD1306_WHITE);
  display.fillCircle(x + 2, y + 12, 3, SSD1306_WHITE);
}

void drawBatteryIcon(int x, int y, int pct) {
  display.drawRect(x, y, 18, 8, SSD1306_WHITE);
  display.fillRect(x + 18, y + 2, 2, 4, SSD1306_WHITE);

  int fillWidth = map(constrain(pct, 0, 100), 0, 100, 0, 16);
  if (fillWidth > 0) {
    display.fillRect(x + 1, y + 1, fillWidth, 6, SSD1306_WHITE);
  }
}

// ---------------------------------------------------------------------
// Display
// ---------------------------------------------------------------------

void displayData() {
  if (!oledOK)
    return;

  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);

  // ---- Top bar: time + battery ----
  display.setTextSize(1);
  display.setCursor(0, 1);

  if (rtcOK) {
    DateTime now = rtc.now();
    char timeText[6];
    sprintf(timeText, "%02d:%02d", now.hour(), now.minute());
    display.print(timeText);
  } else {
    display.print("--:--");
  }

  char battText[5];
  sprintf(battText, "%3d%%", battery);
  display.setCursor(76, 1);
  display.print(battText);
  drawBatteryIcon(106, 0, battery);

  display.drawLine(0, 11, 127, 11, SSD1306_WHITE);

  // ---- Heart rate row, with live beat pulse on the icon ----
  bool showFilledHeart = beatPulseActive && (millis() - beatPulseStart < BEAT_PULSE_MS);
  if (beatPulseActive && (millis() - beatPulseStart >= BEAT_PULSE_MS)) {
    beatPulseActive = false;
  }

  drawHeartIcon(2, 15, showFilledHeart);

  display.setTextSize(2);
  display.setCursor(18, 14);
  if (avgBpm > 0) {
    display.print((int)avgBpm);
  } else {
    display.print("--");
  }

  display.setTextSize(1);
  display.setCursor(90, 20);
  display.print("bpm");

  // ---- SpO2 row ----
  drawDropIcon(2, 35);

  display.setTextSize(2);
  display.setCursor(18, 34);
  if (spo2Valid) {
    display.print(spo2);
  } else {
    display.print("--");
  }

  display.setTextSize(1);
  display.setCursor(90, 40);
  display.print("%SpO2");

  display.drawLine(0, 52, 127, 52, SSD1306_WHITE);

  // ---- Bottom row: temp / HRV / perfusion index ----
  display.setTextSize(1);

  drawThermoIcon(2, 54);
  display.setCursor(12, 56);
  if (mlxOK) {
    display.print(temperature, 1);
  } else {
    display.print("--");
  }

  display.setCursor(48, 56);
  display.print("HRV");

  display.setCursor(70, 56);
  if (hrv >= 0) {
    display.print((int)hrv);
    display.print("ms");
  } else {
    display.print("--");
  }

  display.setCursor(100, 56);
  if (piValid) {
    display.print(perfusionIndex, 1);
  } else {
    display.print("--");
  }

  display.display();
}

// ---------------------------------------------------------------------
// Setup / loop
// ---------------------------------------------------------------------

void setup() {
  Serial.begin(115200);

  pinMode(LED_RED, OUTPUT);
  pinMode(LED_YELLOW, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_BLUE, OUTPUT);

  pinMode(BUZZER, OUTPUT);

  leds(false, false, false, true);

  I2C_SENSOR.begin(SENSOR_SDA, SENSOR_SCL);
  I2C_SENSOR.setClock(100000);  // kept at 100kHz: MLX90614 (SMBus) is spec'd for 100kHz

  I2C_OLED.begin(OLED_SDA, OLED_SCL);
  I2C_OLED.setClock(100000);  // kept at 100kHz: MLX90614 shares this bus and needs Standard Mode

  if (display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR)) {
    oledOK = true;

    display.clearDisplay();
    display.setTextColor(SSD1306_WHITE);
    display.setTextSize(2);
    display.setCursor(20, 25);
    display.print("GUYANNE");
    display.display();
  }

  if (found(I2C_SENSOR, 0x57) && max30102.begin(I2C_SENSOR, I2C_SPEED_STANDARD)) {
    maxOK = true;

    max30102.setup(
      0x1F,  // LED brightness
      1,     // sample averaging (lowered from 4: less internal smoothing,
             // but ~4x more new samples per second -> much faster response
             // and a full 100-sample SpO2 window fills in ~1s instead of ~4s+)
      2,     // Red + IR
      100,   // 100 Hz
      411,   // pulse width
      4096   // ADC range
    );

    max30102.setPulseAmplitudeRed(0x24);
    max30102.setPulseAmplitudeIR(0x24);
    max30102.setPulseAmplitudeGreen(0);
  }

  if (found(I2C_OLED, 0x5A) && mlx.begin(0x5A, &I2C_OLED)) {
    mlxOK = true;
  }

  if (found(I2C_OLED, 0x68) && rtc.begin(&I2C_OLED)) {
    rtcOK = true;

    if (rtc.lostPower())
      rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
  }

  // ---- Diagnostics: check via Serial Monitor (115200 baud) if a sensor
  // still doesn't come up. This tells you definitively which bus/address
  // failed instead of having to guess from the screen.
  Serial.println("---- Sensor init status ----");
  Serial.print("OLED  (I2C_OLED  0x3C): ");
  Serial.println(oledOK ? "OK" : "FAILED");
  Serial.print("MAX30102 (I2C_SENSOR 0x57): ");
  Serial.println(maxOK ? "OK" : "FAILED");
  Serial.print("MLX90614 (I2C_OLED  0x5A): ");
  Serial.println(mlxOK ? "OK" : "FAILED");
  Serial.print("RTC DS3231 (I2C_OLED 0x68): ");
  Serial.println(rtcOK ? "OK" : "FAILED");
  Serial.println("-----------------------------");

  beep();

  delay(1000);
}

void loop() {
  // Sample as fast as the sensor's FIFO allows, every iteration.
  sampleAndProcess();
  readTemperature();

#ifdef BATTERY_ENABLED
  readBattery();
#endif

  updateLEDs();

  // Only touch the (slow) display bus at a fixed, modest rate so it
  // never blocks sensor sampling.
  unsigned long nowMs = millis();
  if (nowMs - lastDisplayUpdate >= DISPLAY_INTERVAL_MS) {
    lastDisplayUpdate = nowMs;
    displayData();
  }
}
