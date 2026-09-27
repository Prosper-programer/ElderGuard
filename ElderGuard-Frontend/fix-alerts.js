const fs = require('fs');
const file = 'app/(parent)/alerts/index.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/import\s*\{\s*MOCK_ALERTS_LIST\s*\}\s*from\s*'@\/services\/mockData';/s, '');
content = content.replace(/const combinedAlerts = alerts\.length > 0 \? alerts : MOCK_ALERTS_LIST;/s, 'const combinedAlerts = alerts;');

fs.writeFileSync(file, content);
console.log('Fixed alerts/index.tsx');
