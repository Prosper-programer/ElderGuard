const fs = require('fs');
const file = 'context/ElderlyContext.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace fake fallback emergency number
content = content.replace(/\|\| '\+1 555 000 0000'/g, "|| 'Not provided'");

fs.writeFileSync(file, content);
console.log('Fixed context/ElderlyContext.tsx');
