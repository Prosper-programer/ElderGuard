const fs = require('fs');
let text = fs.readFileSync('app/(parent)/index.tsx', 'utf8');

// 1. In the JSX, change ChevronRight color and Battery color to white-ish
text = text.replace(/<Battery size=\{14\} color=\{Colors\.textTertiary\} \/>/, "<Battery size={14} color='rgba(255,255,255,0.7)' />");
text = text.replace(/<ChevronRight size=\{20\} color=\{Colors\.border\} \/>/, "<ChevronRight size={20} color='rgba(255,255,255,0.4)' />");

// 2. Modify styles
text = text.replace(/patientStatusCard: \{[\s\S]*?elevation: 5,\r?\n  \},/, 
\patientStatusCard: {
    padding: Spacing.lg,
    backgroundColor: '#1E293B', // Deep Slate / Navy
    borderRadius: BorderRadius.lg,
    borderWidth: 0,
    marginBottom: Spacing.xl,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 8,
  },\);

text = text.replace(/patientName: \{\r?\n    fontSize: 20,\r?\n    fontWeight: '700',\r?\n    color: Colors\.textPrimary,/m,
\patientName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,\);

text = text.replace(/patientSubtext: \{\r?\n    fontSize: 13,\r?\n    color: Colors\.textSecondary,/m,
\patientSubtext: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',\);

text = text.replace(/lastUpdateText: \{\r?\n    fontSize: 12,\r?\n    color: Colors\.textTertiary,/m,
\lastUpdateText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',\);

text = text.replace(/batteryText: \{\r?\n    fontSize: 12,\r?\n    color: Colors\.textTertiary,/m,
\atteryText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',\);

// 3. Make the background of the whole app slightly darker (F6F8FC instead of white if it isn't already)
// The ScreenContainer uses backgroundColor={Colors.background}, which is probably F8FAFC. 

fs.writeFileSync('app/(parent)/index.tsx', text, 'utf8');
