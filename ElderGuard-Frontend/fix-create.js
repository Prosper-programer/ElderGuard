const fs = require('fs');
const file = 'app/(parent)/profile/create.tsx';
let content = fs.readFileSync(file, 'utf8');

// Strip out default states
content = content.replace(/useState\('\+237 671 23 45 67'\);/g, "useState('');");
content = content.replace(/useState\('Dr\. Jean-Paul Mbarga'\);/g, "useState('');");
content = content.replace(/useState\('Cardiologie & M.decine G.riatrique'\);/g, "useState('');");
content = content.replace(/useState\('H.pital Central de Yaound.'\);/g, "useState('');");
content = content.replace(/useState\('\+237 655 89 12 34'\);/g, "useState('');");
content = content.replace(/useState\('doctor\.mbarga@GUYNOVA GUARD\.cm'\);/g, "useState('');");

// Strip out fallback values in handleCreate
content = content.replace(/doctorName: doctorName\.trim\(\) \|\| 'Dr\. Jean-Paul Mbarga',/g, "doctorName: doctorName.trim() || undefined,");
content = content.replace(/doctorPhone: doctorPhone\.trim\(\) \|\| '\+237 655 89 12 34',/g, "doctorPhone: doctorPhone.trim() || undefined,");
content = content.replace(/doctorSpecialty: doctorSpecialty\.trim\(\) \|\| 'Cardiologie & M.decine G.riatrique',/g, "doctorSpecialty: doctorSpecialty.trim() || undefined,");
content = content.replace(/doctorHospital: doctorHospital\.trim\(\) \|\| 'H.pital Central de Yaound.',/g, "doctorHospital: doctorHospital.trim() || undefined,");
content = content.replace(/doctorEmail: doctorEmail\.trim\(\) \|\| 'doctor\.mbarga@GUYNOVA GUARD\.cm',/g, "doctorEmail: doctorEmail.trim() || undefined,");

fs.writeFileSync(file, content);
console.log('Fixed profile/create.tsx');
