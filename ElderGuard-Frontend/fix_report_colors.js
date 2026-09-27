const fs = require('fs');

// 1. Fix reports/index.tsx
let reportIdx = fs.readFileSync('app/(parent)/reports/index.tsx', 'utf8');
reportIdx = reportIdx.replace(/const TEAL = '#0D7066';\r?\nconst LIGHT_TEAL = '#E6F3F2';/g, 
  "import { Colors } from '@/constants/theme';\nconst TEAL = Colors.primary;\nconst LIGHT_TEAL = 'rgba(60, 111, 219, 0.1)';");
fs.writeFileSync('app/(parent)/reports/index.tsx', reportIdx, 'utf8');

// 2. Fix reports/preview.tsx
let reportPrev = fs.readFileSync('app/(parent)/reports/preview.tsx', 'utf8');
reportPrev = reportPrev.replace(/const TEAL = '#0D7066';/g, 
  "import { Colors } from '@/constants/theme';\nconst TEAL = Colors.primary;");
reportPrev = reportPrev.replace(/backgroundColor: '#E6F3F2'/g, "backgroundColor: 'rgba(60, 111, 219, 0.1)'");
fs.writeFileSync('app/(parent)/reports/preview.tsx', reportPrev, 'utf8');

