const fs = require('fs');
const file = 'context/ElderlyContext.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add apiUpdateElderlyProfile import
content = content.replace(
  /apiCreateDoctor,\s*\}\s*from\s*'@\/services\/elderlyService';/s,
  "apiCreateDoctor,\n  apiUpdateElderlyProfile,\n} from '@/services/elderlyService';"
);

// 2. Rewrite updateProfile
const oldUpdate = /const updateProfile = \(id: string, updates: Partial<ElderlyProfile>\) => \{[\s\S]*?\}\);[\s\n]*\};/s;
const newUpdate = `const updateProfile = async (id: string, updates: Partial<ElderlyProfile>) => {
    // Optimistic update locally
    setProfiles((prev) =>
      prev.map((profile) => {
        if (profile.id === id) {
          return { ...profile, ...updates, updatedAt: new Date().toISOString() };
        }
        return profile;
      })
    );

    // Sync to backend
    const backendPayload: any = {};
    if (updates.primaryCaregiverId) {
      backendPayload.caregiver_id = parseInt(updates.primaryCaregiverId.replace('usr-', ''), 10);
    }
    if (updates.doctorId) {
      backendPayload.doctor_id = parseInt(updates.doctorId.replace('usr-', ''), 10);
    }
    if (updates.fullName) backendPayload.full_name = updates.fullName;
    if (updates.address) backendPayload.address = updates.address;
    
    await apiUpdateElderlyProfile(id, backendPayload);
  };`;

content = content.replace(oldUpdate, newUpdate);

// 3. Force assignment in provisionCaregiver
const oldProvCg = /if \(activeProfile && !activeProfile\.primaryCaregiverName && res\.caregiver\) \{/g;
const newProvCg = `if (activeProfile && res.caregiver) {`;
content = content.replace(oldProvCg, newProvCg);

fs.writeFileSync(file, content);
console.log('Fixed context/ElderlyContext.tsx');
