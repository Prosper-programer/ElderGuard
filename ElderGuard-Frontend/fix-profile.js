const fs = require('fs');
const file = 'app/(parent)/profile/index.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove MOCK imports
content = content.replace(/import\s*\{\s*MOCK_ELDERLY_PERSON,\s*MOCK_CAREGIVER,\s*MOCK_DOCTOR,\s*MOCK_USERS,\s*\}\s*from\s*'@\/services\/mockData';/s, '');

// Replace MOCK_ELDERLY_PERSON
content = content.replace(/MOCK_ELDERLY_PERSON\.bloodType/g, "activeProfile?.medicalInfo?.bloodType || 'Unknown'");
content = content.replace(/MOCK_ELDERLY_PERSON\.height/g, "'N/A'");
content = content.replace(/MOCK_ELDERLY_PERSON\.weight/g, "'N/A'");
content = content.replace(/MOCK_ELDERLY_PERSON\.address/g, "activeProfile?.address || 'No Address'");
content = content.replace(/MOCK_ELDERLY_PERSON\.room/g, "'Primary Residence'");
content = content.replace(/MOCK_ELDERLY_PERSON\.conditions/g, "(activeProfile?.medicalInfo?.chronicConditions || [])");
content = content.replace(/MOCK_ELDERLY_PERSON\.allergies/g, "(activeProfile?.medicalInfo?.allergies || [])");

// Replace contacts
content = content.replace(/name: MOCK_USERS\.Tutor\.name,/g, "name: user?.name || 'Primary Tutor',");
content = content.replace(/phone: MOCK_USERS\.Tutor\.phone,/g, "phone: user?.phone || 'No Phone',");

content = content.replace(/name: MOCK_CAREGIVER\.name,/g, "name: activeProfile?.primaryCaregiverName || 'Not Assigned',");
content = content.replace(/phone: MOCK_CAREGIVER\.phone,/g, "phone: 'N/A',");

content = content.replace(/name: MOCK_DOCTOR\.name,/g, "name: activeProfile?.doctorName || 'Not Assigned',");
content = content.replace(/phone: MOCK_DOCTOR\.phone,/g, "phone: activeProfile?.doctorPhone || 'N/A',");

fs.writeFileSync(file, content);
console.log('Fixed profile/index.tsx');
