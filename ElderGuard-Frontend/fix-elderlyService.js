const fs = require('fs');
const file = 'services/elderlyService.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "if (token) headers['Authorization'] = Bearer $token;",
  "if (token) headers['Authorization'] = `Bearer ${token}`;"
);

content = content.replace(
  "const response = await fetch(${API_BASE_URL}/api/Patient/$id, {",
  "const response = await fetch(`${API_BASE_URL}/api/Patient/${id}`, {"
);

fs.writeFileSync(file, content);
console.log('Fixed syntax in elderlyService.ts');
