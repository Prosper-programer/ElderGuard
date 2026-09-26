const fs = require('fs');
let text = fs.readFileSync('app/(parent)/health/index.tsx', 'utf8');

if (!text.includes("import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';")) {
  text = text.replace(
    "import { useRouter } from 'expo-router';",
    "import { useRouter } from 'expo-router';\nimport { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';\nimport { useVitals, getStatusColor } from '@/context/VitalsContext';\nimport { useElderly } from '@/context/ElderlyContext';"
  );
}

// Inside the component, grab useVitals
if (!text.includes("const { vitals } = useVitals();")) {
  text = text.replace(
    "export default function HealthMonitoringScreen() {",
    "export default function HealthMonitoringScreen() {\n  const { vitals } = useVitals();\n  const { activeProfile } = useElderly();"
  );
}

fs.writeFileSync('app/(parent)/health/index.tsx', text, 'utf8');
