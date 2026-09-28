const fs = require('fs');
let text = fs.readFileSync('app/(parent)/reports/index.tsx', 'utf8');

if (!text.includes('useElderly')) {
  text = text.replace(
    "import { useRouter } from 'expo-router';",
    "import { useRouter } from 'expo-router';\nimport { useElderly } from '@/context/ElderlyContext';"
  );
  
  text = text.replace(
    "export default function ReportsScreen() {",
    "export default function ReportsScreen() {\n  const { activeProfile } = useElderly();"
  );
  
  text = text.replace(
    /Marie Johnson <Text style=\{styles\.personAge\}>· Age 74<\/Text>/g,
    "{activeProfile?.preferredName || activeProfile?.fullName || 'Senior'} <Text style={styles.personAge}>· {activeProfile?.age ? 'Age ' + activeProfile.age : ''}</Text>"
  );

  text = text.replace(
    /source=\{\{ uri: 'https:\/\/images\.unsplash\.com\/[^']+' \}\}/g,
    "source={{ uri: activeProfile?.imageUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop' }}"
  );

  fs.writeFileSync('app/(parent)/reports/index.tsx', text, 'utf8');
}
