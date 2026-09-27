const fs = require('fs');
const file = 'app/(parent)/device.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/import\s*\{\s*MOCK_ELDERLY_PERSON,\s*MOCK_VITALS\s*\}\s*from\s*'@\/services\/mockData';/s, '');
content = content.replace(/MOCK_ELDERLY_PERSON\.deviceId/g, "activeProfile?.deviceStatus?.deviceId || 'Unknown-ID'");

fs.writeFileSync(file, content);
console.log('Fixed device.tsx');
