const fs = require('fs');
let text = fs.readFileSync('app/(parent)/reports/preview.tsx', 'utf8');

if (!text.includes('useElderly')) {
  text = text.replace(
    "import { useRouter } from 'expo-router';",
    "import { useRouter } from 'expo-router';\nimport { useElderly } from '@/context/ElderlyContext';\nimport { useVitals } from '@/context/VitalsContext';"
  );
  
  text = text.replace(
    "export default function ReportPreviewScreen() {",
    "export default function ReportPreviewScreen() {\n  const { activeProfile } = useElderly();\n  const { vitals } = useVitals();"
  );
  
  text = text.replace(
    "Marie Johnson - Weekly Report",
    "{activeProfile?.preferredName || activeProfile?.fullName || 'Senior'} - Weekly Report"
  );

  text = text.replace(
    /During this period, Marie Johnson's health/g,
    "During this period, {activeProfile?.preferredName || 'the senior'}'s health"
  );

  text = text.replace(
    /<Text style=\{styles\.rowValue\}>78 BPM<\/Text>/g,
    "<Text style={styles.rowValue}>{vitals?.heartRate?.value || '78'} BPM</Text>"
  );

  text = text.replace(
    /<Text style=\{styles\.rowValue\}>97%<\/Text>/g,
    "<Text style={styles.rowValue}>{vitals?.spo2?.value || '97'}%</Text>"
  );

  text = text.replace(
    /<Text style=\{styles\.rowValue\}>36\.7°C<\/Text>/g,
    "<Text style={styles.rowValue}>{vitals?.temperature?.value || '36.7'}{vitals?.temperature?.unit || '°C'}</Text>"
  );

  fs.writeFileSync('app/(parent)/reports/preview.tsx', text, 'utf8');
}
