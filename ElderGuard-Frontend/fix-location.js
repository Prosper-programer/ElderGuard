const fs = require('fs');
const file = 'app/(parent)/location.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/import\s*\{\s*MOCK_ELDERLY_PERSON\s*\}\s*from\s*'@\/services\/mockData';\s*/s, '');

fs.writeFileSync(file, content);
console.log('Fixed location.tsx');
