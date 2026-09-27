const fs = require('fs');
const glob = require('fs').readdirSync;

function processFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Strip mock imports
  content = content.replace(/import\s*\{[^}]*MOCK_[^}]*\}\s*from\s*'@\/services\/mockData';/gs, '');

  // Caregiver index
  content = content.replace(/MOCK_CAREGIVER\.name/g, "user?.name || 'Caregiver'");
  content = content.replace(/MOCK_USERS\.Tutor\.phone/g, "'+237671234567'");
  content = content.replace(/MOCK_USERS\.doctor\.phone/g, "'+237655891234'");
  content = content.replace(/MOCK_CAREGIVER\.shiftStart/g, "'08:00 AM'");
  content = content.replace(/MOCK_CAREGIVER\.shiftEnd/g, "'05:00 PM'");
  content = content.replace(/MOCK_CARE_ACTIVITIES\.slice\(0, 3\)/g, "[]");
  
  // Telemetry (Doctor)
  content = content.replace(/MOCK_HEART_RATE_HISTORY\.slice\(-8\)/g, "[]");
  content = content.replace(/MOCK_SPO2_HISTORY\.slice\(-8\)/g, "[]");
  content = content.replace(/MOCK_TEMP_HISTORY/g, "[]");
  
  // Location
  content = content.replace(/MOCK_ELDERLY_PERSON\.address/g, "activeProfile?.address || 'No Address'");
  content = content.replace(/MOCK_ELDERLY_PERSON\.room/g, "'Primary Residence'");
  content = content.replace(/MOCK_USERS\.Tutor\.phone/g, "'+15551234567'");

  // History / Care / Alerts
  content = content.replace(/MOCK_TIMELINE_EVENTS/g, "[]");
  content = content.replace(/MOCK_CARE_ACTIVITIES/g, "[]");
  content = content.replace(/MOCK_ALERTS_LIST/g, "[]");

  // Settings
  content = content.replace(/MOCK_USERS\.caregiver\.email/g, "user?.email || ''");
  content = content.replace(/MOCK_USERS\.caregiver\.phone/g, "user?.phone || ''");

  fs.writeFileSync(file, content);
}

const files = [
  'app/(caregiver)/index.tsx',
  'app/(caregiver)/location.tsx',
  'app/(caregiver)/history.tsx',
  'app/(caregiver)/settings.tsx',
  'app/(caregiver)/alerts/index.tsx',
  'app/(caregiver)/care/index.tsx',
  'app/(doctor)/telemetry.tsx'
];

files.forEach(processFile);
console.log('Fixed caregiver and doctor screens');
