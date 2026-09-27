const fs = require('fs');
const file = 'app/(parent)/emergency.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/import\s*\{\s*MOCK_ELDERLY_PERSON,\s*MOCK_DOCTOR,\s*MOCK_CAREGIVER\s*\}\s*from\s*'@\/services\/mockData';/s, '');
content = content.replace(/MOCK_ELDERLY_PERSON\.address/g, "activeProfile?.address || 'Location Unknown'");

fs.writeFileSync(file, content);
console.log('Fixed emergency.tsx');
