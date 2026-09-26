const fs = require('fs');
let text = fs.readFileSync('app/(parent)/index.tsx', 'utf8');

text = text.replace(/<Battery size=\{14\} color=\{Colors\.textTertiary\} \/>/, "<Battery size={14} color='rgba(255,255,255,0.7)' />");
text = text.replace(/<ChevronRight size=\{20\} color=\{Colors\.border\} \/>/, "<ChevronRight size={20} color='rgba(255,255,255,0.4)' />");

text = text.replace(/patientStatusCard: \{[\s\S]*?elevation: 5,\r?\n  \},/, 
"patientStatusCard: {\n    padding: Spacing.lg,\n    backgroundColor: '#1E293B',\n    borderRadius: BorderRadius.lg,\n    borderWidth: 0,\n    marginBottom: Spacing.xl,\n    shadowColor: Colors.primary,\n    shadowOffset: { width: 0, height: 12 },\n    shadowOpacity: 0.2,\n    shadowRadius: 30,\n    elevation: 8,\n  },");

text = text.replace(/patientName: \{\r?\n    fontSize: 20,\r?\n    fontWeight: '700',\r?\n    color: Colors\.textPrimary,/m,
"patientName: {\n    fontSize: 20,\n    fontWeight: '700',\n    color: Colors.white,");

text = text.replace(/patientSubtext: \{\r?\n    fontSize: 13,\r?\n    color: Colors\.textSecondary,/m,
"patientSubtext: {\n    fontSize: 13,\n    color: 'rgba(255, 255, 255, 0.7)',");

text = text.replace(/lastUpdateText: \{\r?\n    fontSize: 12,\r?\n    color: Colors\.textTertiary,/m,
"lastUpdateText: {\n    fontSize: 12,\n    color: 'rgba(255, 255, 255, 0.6)',");

text = text.replace(/batteryText: \{\r?\n    fontSize: 12,\r?\n    color: Colors\.textTertiary,/m,
"batteryText: {\n    fontSize: 12,\n    color: 'rgba(255, 255, 255, 0.8)',");

fs.writeFileSync('app/(parent)/index.tsx', text, 'utf8');
