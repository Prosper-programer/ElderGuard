const fs = require('fs');
let editFile = fs.readFileSync('app/(parent)/profile/edit.tsx', 'utf8');
const missingStyles = "  fieldLabel: { fontSize: 12, fontWeight: '600', color: '#0F172A', marginBottom: 6 },\n  genderRow: { flexDirection: 'row', gap: 8 },\n  genderChip: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' },\n  genderChipActive: { backgroundColor: 'rgba(60, 111, 219, 0.08)', borderColor: '#3C6FDB' },\n  genderChipText: { fontSize: 14, color: '#475569' },\n  genderChipTextActive: { color: '#3C6FDB', fontWeight: '600' },\n";
editFile = editFile.replace(/bottomActions:\s*{[^}]*},\n/m, "bottomActions: {\n    paddingVertical: 24,\n    paddingBottom: 40,\n  },\n" + missingStyles);
editFile = editFile.replace(/const missingStyles = StyleSheet\.create\([\s\S]*?Object\.assign\(styles, missingStyles\);\r?\n/m, "");
fs.writeFileSync('app/(parent)/profile/edit.tsx', editFile, 'utf8');

let usersFile = fs.readFileSync('app/(admin)/users.tsx', 'utf8');
usersFile = usersFile.replace(/item\.role === 'parent'/g, "(item.role as any) === 'parent'");
fs.writeFileSync('app/(admin)/users.tsx', usersFile, 'utf8');
