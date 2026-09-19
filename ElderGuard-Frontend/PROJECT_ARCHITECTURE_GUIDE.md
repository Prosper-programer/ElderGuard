# ElderGuard — Comprehensive Architecture & Data Flow Guide

> **ElderGuard**: Intelligent Elderly Monitoring, Fall Detection & Care Ecosystem  
> **Framework**: React Native with Expo SDK 54 (New Architecture), TypeScript, Expo Router  
> **Date**: September 2026

---

## Table of Contents
1. [System Architecture Overview](#1-system-architecture-overview)
2. [End-to-End Data Lifecycle (How Data is Sent & Processed)](#2-end-to-end-data-lifecycle)
3. [Backend Ingestion, Processing & State Mutation Engine](#3-backend-ingestion-processing--state-mutation-engine)
4. [Frontend Application Architecture](#4-frontend-application-architecture)
5. [Complete File-by-File Directory Guide](#5-complete-file-by-file-directory-guide)
6. [API & Telemetry Contract Specifications](#6-api--telemetry-contract-specifications)
7. [Production Hardware Transition Strategy](#7-production-hardware-transition-strategy)

---

## 1. System Architecture Overview

ElderGuard operates as a **three-tier ecosystem**:

```
┌─────────────────────────────────────────────────────────┐
│                     HARDWARE TIER                       │
│  ElderGuard Smart Band / IoT Biosensors (EG-IOT-4892)   │
│  • PPG Optical Sensor (Heart Rate & SpO₂)               │
│  • 6-Axis IMU (Accelerometer & Gyroscope: Fall G-Force) │
│  • Skin Thermistor (Body Temperature)                   │
│  • Step Cadence Counter (Mobility tracking)             │
└───────────────────────────┬─────────────────────────────┘
                            │
                            │ MQTT over TLS / Cellular NB-IoT / BLE 5.2
                            ▼
┌─────────────────────────────────────────────────────────┐
│                      BACKEND TIER                       │
│  Cloud Telemetry Gateway & Incident Processing Engine   │
│  • MQTT Ingestion Broker (EMQX / AWS IoT Core)          │
│  • Stream Processing & Rule Engine (Kafka / Redis)      │
│  • Anomaly & Fall Detection ML Filter                   │
│  • Relational DB (PostgreSQL) + TimeSeries DB (Timescale)│
│  • Real-Time WebSockets Server & Push Dispatcher (APNs/FCM)│
└───────────────────────────┬─────────────────────────────┘
                            │
                            │ Secure WebSockets (WSS) & REST API (HTTPS)
                            ▼
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND TIER                       │
│  ElderGuard Mobile Client (Expo SDK 54)                 │
│  • Parent Console: Monitoring, Profile, Reports, Config │
│  • Caregiver Console: Vitals, Daypart Meds, Incidents   │
│  • Real-Time Reactive Context State Store               │
│  *(Admin Console is implemented on the Web Browser)*   │
└─────────────────────────────────────────────────────────┘
```

---

## 2. End-to-End Data Lifecycle

### A. How Data is Sent from Hardware to Backend

1. **Sensor Sampling on the Wearable**:
   - The **PPG sensor** samples optical blood reflection continuously (sampled at 25 Hz).
   - The **6-axis IMU** (accelerometer + gyroscope) samples kinetic motion at 50 Hz.
2. **On-Device Micro-Processing**:
   - The embedded firmware (ARM Cortex-M4/M33 microcontroller) calculates moving averages for Heart Rate (bpm) and SpO₂ (%).
   - The firmware runs a threshold trigger: If the vector magnitude of acceleration $|\vec{a}| = \sqrt{a_x^2 + a_y^2 + a_z^2} > 3.0g$ followed by sudden lack of motion, it sets the `fall_trigger: true` flag in the telemetry packet.
3. **Payload Transmission**:
   - Every **5 seconds** (or **instantly** upon fall interrupt), the wearable transmits a lightweight JSON / Protobuf packet to the backend over **LTE-M / NB-IoT** or through an **in-home Wi-Fi base station**:

```json
{
  "device_id": "EG-IOT-4892",
  "elderly_id": "eld-01",
  "timestamp": "2026-09-03T17:45:00.120Z",
  "battery_pct": 84,
  "telemetry": {
    "heart_rate": 72,
    "spo2": 98,
    "temperature_c": 36.7,
    "steps": 3840,
    "g_force": 1.02,
    "fall_detected": false
  },
  "location": {
    "latitude": 40.7306,
    "longitude": -74.2638,
    "geofence_zone": "Living Room"
  }
}
```

---

## 3. Backend Ingestion, Processing & State Mutation Engine

When the backend receives the telemetry packet, it executes the following automated pipeline:

```
[Incoming Packet] ──> [Schema Validator]
                             │
                             ▼
                   [Anomaly Engine / Rules]
                   ├── 1. Fall Detection Check (gForce >= 3.0G)
                   ├── 2. Tachycardia Check (HR > 115 bpm)
                   ├── 3. Hypoxemia Check (SpO2 < 92%)
                   └── 4. Geofence Boundary Verification
                             │
             ┌───────────────┴───────────────┐
             ▼                               ▼
       [NORMAL PATH]                 [CRITICAL ALERT PATH]
             │                               │
             ▼                               ▼
  1. Append to TimeSeries DB       1. Insert into Alerts Table (status: 'active')
  2. Broadcast via WebSocket       2. Push APNs / FCM Critical Notification to Phones
     to Parent & Caregiver apps    3. Trigger Twilio SMS / Automated Voice Call
                                   4. Broadcast High-Priority Alert Event via WebSocket
```

### How Data is Modified by Users via the Mobile App

When a Parent or Caregiver interacts with the app, data is modified in the backend via REST endpoints:

1. **Marking Medication Doses (`POST /api/v1/care/doses/:id/status`)**:
   - **Frontend Action**: Caregiver taps **"Mark Administered"** on *Lisinopril 10mg*.
   - **Backend Mutation**:
     - Finds the dose record by `id`.
     - Updates `status = 'taken'`.
     - Sets `administered_at = NOW()` and `administered_by = 'David Miller (Caregiver)'`.
     - Recalculates today's overall adherence score: `(taken_count / total_count) * 100`.
     - Pushes a WebSocket event `care:dose_updated` so the Parent's phone updates in real time.

2. **Acknowledging an Incident (`PATCH /api/v1/alerts/:id/status`)**:
   - **Frontend Action**: Parent taps **"Acknowledge Alert"**.
   - **Backend Mutation**:
     - Changes alert `status` from `'active'` to `'acknowledged'`.
     - Attaches `acknowledged_by = 'Eleanor Vance (Parent)'` and `acknowledged_at = NOW()`.
     - Emits WebSocket event `alert:acknowledged` to silence the alarm ring on other caregivers' phones.

3. **Resolving an Incident (`POST /api/v1/alerts/:id/resolve`)**:
   - **Frontend Action**: Caregiver enters resolution notes *"Checked on Margaret in kitchen, assisted to chair, vitals stable"* and taps **"Resolve Incident"**.
   - **Backend Mutation**:
     - Sets `status = 'resolved'`.
     - Stores clinical resolution notes in the audit log.
     - Resets the active alert counter to `0`.

---

## 4. Frontend Application Architecture

The mobile app is built with **Expo SDK 54** using the **Clean Context / Provider Pattern**:

```
app/_layout.tsx (Root Provider Stack)
  ├── AuthProvider (User session: Parent / Caregiver)
  ├── ElderlyProvider (Senior profile: Margaret Johnson, contacts, hardware)
  ├── VitalsProvider (Real-time telemetry, sparklines, simulation engine)
  ├── AlertProvider (Active incidents, fall detection lifecycle)
  └── CareProvider (Prescriptions, daypart timelines, wellness counters)
        │
        └── Screens (Consumes hooks: useAuth, useElderly, useVitals, useAlerts, useCare)
```

---

## 5. Complete File-by-File Directory Guide

### Root & Configuration Files
* **[`app.json`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/app.json)**: Expo project configuration (app name, bundle ID, orientation, status bar, plugins).
* **[`package.json`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/package.json)**: Dependencies list (`expo`, `react-native`, `lucide-react-native`, `react-native-svg`, `expo-router`).
* **[`tsconfig.json`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/tsconfig.json)**: TypeScript strict configuration with `@/*` path aliases.
* **[`AGENTS.md`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/AGENTS.md)**: Project rule requiring Expo SDK 54 versioned documentation.

---

### Global Context Providers (`context/`)
* **[`context/AuthContext.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/context/AuthContext.tsx)**:
  - Manages authentication state, current user profile (`User`), active role (`parent` | `caregiver`), login, registration, and logout operations.
* **[`context/ElderlyContext.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/context/ElderlyContext.tsx)**:
  - Manages senior profiles (Margaret Johnson, age 78), emergency contacts, paired IoT hardware band (`EG-IOT-4892`), and clinical care notes.
* **[`context/VitalsContext.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/context/VitalsContext.tsx)**:
  - Stores real-time vital telemetry (Heart Rate, SpO₂, Temperature, Steps, Fall impact).
  - Generates 24-hour historical waveform data points for sparkline rendering.
  - Controls the simulation engine (`simulateAnomaly('fall')`, `simulateAnomaly('tachycardia')`, `resetToNormal()`).
* **[`context/AlertContext.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/context/AlertContext.tsx)**:
  - Implements the entire incident lifecycle: *Detect $\rightarrow$ Alert $\rightarrow$ Acknowledge $\rightarrow$ Resolve $\rightarrow$ Record*.
  - Exposes `activeAlerts`, `alertsHistory`, and dispatch operations.
* **[`context/CareContext.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/context/CareContext.tsx)**:
  - Manages scheduled prescriptions (Lisinopril, Calcium+D3, Metformin) and daily wellness goals (Hydration, Mobility walks).
  - Handles dose marking (`taken`, `missed`, `pending`) and adherence calculations.

---

### Type Definitions (`types/`)
* **[`types/auth.ts`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/types/auth.ts)**: Interfaces for `User`, `UserRole`, login credentials, and session tokens.
* **[`types/elderly.ts`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/types/elderly.ts)**: Interfaces for `ElderlyProfile`, `EmergencyContact`, `HardwareDevice`, and medical history.
* **[`types/vitals.ts`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/types/vitals.ts)**: Interfaces for `VitalSignReadings`, `VitalMetricType`, `VitalHistoryPoint`, and thresholds.
* **[`types/alerts.ts`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/types/alerts.ts)**: Interfaces for `AlertIncident`, `AlertSeverity`, `AlertStatus`, and resolution audit logs.
* **[`types/care.ts`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/types/care.ts)**: Interfaces for `Medication`, `MedicationDose`, `CareActivity`, and daypart schedules.

---

### UI Design System Components (`components/ui/`)
* **[`components/ui/ScreenContainer.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/components/ui/ScreenContainer.tsx)**:
  - Master container applying **device-notch safe area insets** (`paddingTop: insets.top`), keyboard avoidance, and pinned bottom bar docking.
* **[`components/ui/BottomTabBar.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/components/ui/BottomTabBar.tsx)**:
  - Apple-native 4-tab navigation dock (**Vitals**, **Care & Meds**, **Alerts [with live red badge]**, **Profile**) with soft active pill focus and role-adaptive colors.
* **[`components/ui/HeroStatusRing.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/components/ui/HeroStatusRing.tsx)**:
  - Apple Health-style wellness status orb featuring a circular SVG progress arc around Margaret's avatar, reassuring headline, and 3 quick-glance metric pills.
* **[`components/ui/VitalSparklineCard.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/components/ui/VitalSparklineCard.tsx)**:
  - Medical telemetry card with embedded 24-hour SVG wavy sparkline curve, live value, status pill, and normal clinical reference range.
* **[`components/ui/Button.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/components/ui/Button.tsx)**: Accessible tactile button supporting `primary`, `secondary`, `danger`, and `ghost` variants with loading states.
* **[`components/ui/Card.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/components/ui/Card.tsx)**: Elevated white card container with soft ambient shadows and rounded corners.
* **[`components/ui/StatusBadge.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/components/ui/StatusBadge.tsx)**: Micro status pill rendering `critical` (red), `warning` (amber), `safe` (green), and `neutral` (grey).
* **[`components/ui/Avatar.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/components/ui/Avatar.tsx)**: User and senior avatar component with status indicators.
* **[`components/ui/TextInput.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/components/ui/TextInput.tsx)**: Input field with floating label, left/right icons, and error handling.
* **[`components/ui/Divider.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/components/ui/Divider.tsx)**: Subtle horizontal rule divider.
* **[`components/ui/EmptyState.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/components/ui/EmptyState.tsx)**: Placeholder for empty lists or zero active alerts.
* **[`components/ui/LoadingSpinner.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/components/ui/LoadingSpinner.tsx)**: Centered activity indicator.
* **[`components/ui/IconButton.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/components/ui/IconButton.tsx)**: Circular icon action button.
* **[`components/ui/index.ts`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/components/ui/index.ts)**: Barrel export file for the design system.

---

### Design Tokens & Theme (`constants/`)
* **[`constants/colors.ts`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/constants/colors.ts)**: Semantic palette defining Parent Blue (`#3C6FDB`), Caregiver Green (`#22C55E`), Admin Amber (`#F59E0B`), and Critical Red (`#EF4444`).
* **[`constants/typography.ts`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/constants/typography.ts)**: Inter typographic scale (`h1`, `h2`, `h3`, `bodyLarge`, `bodyMedium`, `caption`).
* **[`constants/spacing.ts`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/constants/spacing.ts)**: Spacing tokens (4px to 64px) and border radius scales.
* **[`constants/theme.ts`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/constants/theme.ts)**: Unified theme aggregation file.

---

### Screens & Routing (`app/`)

#### Navigation & Auth Flow
* **[`app/_layout.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/app/_layout.tsx)**: Root application wrapper providing all 5 React Context stores and font loaders.
* **[`app/index.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/app/index.tsx)**: App entry gatekeeper; routes users to Splash or their assigned dashboard.
* **[`app/(auth)/_layout.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/app/(auth)/_layout.tsx)**: Stack navigator for onboarding and authentication screens.
* **[`app/(auth)/splash.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/app/(auth)/splash.tsx)**: Rich Royal Sapphire (`#1E3A8A`) launch screen with glowing biometric shield mark.
* **[`app/(auth)/onboarding.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/app/(auth)/onboarding.tsx)**: 4-slide interactive onboarding tour illustrating safety, vitals, alerts, and care routines.
* **[`app/(auth)/welcome.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/app/(auth)/welcome.tsx)**: Welcome landing page with hero illustration, feature overview cards, and Sign In / Sign Up triggers.
* **[`app/(auth)/login.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/app/(auth)/login.tsx)**: Modern credentials sign-in with 2 role selector boxes (Parent, Caregiver).
* **[`app/(auth)/signup.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/app/(auth)/signup.tsx)**: Account registration screen with role selection and input validation.

#### Parent Console (`app/(parent)/`)
* **[`app/(parent)/_layout.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/app/(parent)/_layout.tsx)**: Stack layout for Parent screens.
* **[`app/(parent)/index.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/app/(parent)/index.tsx)**: Primary Parent Dashboard featuring HeroStatusRing, Sparkline cards, and Quick Hub links.
* **[`app/(parent)/care/index.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/app/(parent)/care/index.tsx)**: Daypart medication schedule (Morning, Afternoon, Evening) and daily activity tracker.
* **[`app/(parent)/care/new-medication.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/app/(parent)/care/new-medication.tsx)**: Form to prescribe new medications (dosage, frequency, instructions, times).
* **[`app/(parent)/alerts/index.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/app/(parent)/alerts/index.tsx)**: Incident list (active & historical) with testing simulation strip.
* **[`app/(parent)/alerts/[id].tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/app/(parent)/alerts/[id].tsx)**: Calm-in-Crisis fall response screen with mini-map GPS pin and emergency dialer dock.
* **[`app/(parent)/profile/index.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/app/(parent)/profile/index.tsx)**: Senior profile management (Margaret's medical history, emergency contacts, paired band).
* **[`app/(parent)/profile/edit.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/app/(parent)/profile/edit.tsx)**: Senior profile editing form.
* **[`app/(parent)/profile/create.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/app/(parent)/profile/create.tsx)**: New senior onboarding form.
* **[`app/(parent)/reports/index.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/app/(parent)/reports/index.tsx)**: 24h & 7d vital analytics, heart rate bar chart, and clinical physician report generator for Dr. Robert Chen.
* **[`app/(parent)/settings.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/app/(parent)/settings.tsx)**: Push/SMS notification toggles and account settings.

#### Caregiver Console (`app/(caregiver)/`)
* **[`app/(caregiver)/_layout.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/app/(caregiver)/_layout.tsx)**: Stack layout for Caregiver screens.
* **[`app/(caregiver)/index.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/app/(caregiver)/index.tsx)**: Caregiver Dashboard with live Hero ring, sparklines, and one-tap family call buttons.
* **[`app/(caregiver)/care/index.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/app/(caregiver)/care/index.tsx)**: Medication administration screen with tactile pill check toggles.
* **[`app/(caregiver)/alerts/index.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/app/(caregiver)/alerts/index.tsx)**: Assigned incident log.
* **[`app/(caregiver)/alerts/[id].tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/app/(caregiver)/alerts/[id].tsx)**: Action-first emergency incident resolution screen.
* **[`app/(caregiver)/profile.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/app/(caregiver)/profile.tsx)**: Read-only care profile for Margaret.
* **[`app/(caregiver)/settings.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/app/(caregiver)/settings.tsx)**: Caregiver on-duty status toggle and notification preferences.

*(Note: The Admin Console for fleet management and audit logs is deployed separately as a browser web application).*

---

## 6. API & Telemetry Contract Specifications

When connecting this frontend to your production backend, the following REST & WebSocket contracts should be implemented:

| Method | Endpoint | Description | Request / Response Payload |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/v1/auth/login` | Authenticate user | `{ email, password, role }` $\rightarrow$ `{ token, user }` |
| **GET** | `/api/v1/elderly/:id/vitals/latest` | Get current vitals | $\rightarrow$ `{ heartRate, spo2, temperature, steps }` |
| **GET** | `/api/v1/elderly/:id/vitals/history` | Get 24h/7d sparkline history | `?period=24h` $\rightarrow$ `[{ timestamp, value }]` |
| **GET** | `/api/v1/alerts` | List all incidents | $\rightarrow$ `AlertIncident[]` |
| **PATCH**| `/api/v1/alerts/:id/acknowledge` | Acknowledge incident | `{ acknowledgedBy }` $\rightarrow$ `{ success: true }` |
| **POST** | `/api/v1/alerts/:id/resolve` | Resolve incident with notes | `{ resolvedBy, notes }` $\rightarrow$ `{ success: true }` |
| **GET** | `/api/v1/care/doses/today` | Fetch today's dosage routine | $\rightarrow$ `MedicationDose[]` |
| **PATCH**| `/api/v1/care/doses/:id/status` | Mark dose administered/missed | `{ status: 'taken', notes }` $\rightarrow$ `{ success: true }` |
| **WSS**  | `wss://api.elderguard.com/v1/stream` | Real-time WebSocket connection | Emits `vital:packet`, `alert:triggered` |

---

## 7. Production Hardware Transition Strategy

To connect real wearable sensors to this codebase without modifying any UI component:

1. **Open [`context/VitalsContext.tsx`](file:///c:/Users/User/Desktop/Prosper-files/ElderGuard-Frontend/context/VitalsContext.tsx)**.
2. In `useEffect()`, replace the mock interval timer with a **WebSocket connection**:
   ```typescript
   useEffect(() => {
     const socket = new WebSocket(`wss://api.elderguard.com/v1/stream?elderlyId=${activeProfile.id}`);
     
     socket.onmessage = (event) => {
       const packet = JSON.parse(event.data);
       if (packet.type === 'VITAL_UPDATE') {
         setVitals(packet.data);
       }
     };

     return () => socket.close();
   }, [activeProfile.id]);
   ```
3. Because all screens consume `useVitals()`, the entire UI will automatically stream the live hardware data with zero UI rewrites!
