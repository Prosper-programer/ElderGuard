const fs = require('fs');
let text = fs.readFileSync('app/(parent)/profile/edit.tsx', 'utf8');

const missing = \
  fieldLabel: { fontSize: 12, fontWeight: '600', color: '#0F172A', marginBottom: 6 },
  genderRow: { flexDirection: 'row', gap: 8 },
  genderChip: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' },
  genderChipActive: { backgroundColor: 'rgba(60, 111, 219, 0.08)', borderColor: '#3C6FDB' },
  genderChipText: { fontSize: 14, color: '#475569' },
  genderChipTextActive: { color: '#3C6FDB', fontWeight: '600' }
\;

text = text.replace("paddingBottom: Spacing['3xl'],\r\n  },\r\n});", "paddingBottom: Spacing['3xl'],\r\n  },\r\n" + missing + "\n});");
text = text.replace("paddingBottom: Spacing['3xl'],\n  },\n});", "paddingBottom: Spacing['3xl'],\n  },\n" + missing + "\n});");

fs.writeFileSync('app/(parent)/profile/edit.tsx', text, 'utf8');
