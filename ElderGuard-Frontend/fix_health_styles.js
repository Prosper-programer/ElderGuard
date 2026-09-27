const fs = require('fs');
let text = fs.readFileSync('app/(parent)/health/index.tsx', 'utf8');

// The script added new styles at the top of StyleSheet.create, but we left the old ones.
// I will find the old ones and remove them.
text = text.replace(/screenTitle: \{\s*fontSize: 20,\s*fontWeight: '800',\s*color: Colors\.white,\s*\},/g, "");
text = text.replace(/backBtn: \{\s*width: 38,\s*height: 38,\s*borderRadius: 12,\s*backgroundColor: 'rgba\(255,255,255,0\.1\)',\s*borderWidth: 0,\s*borderColor: '#E2E8F0',\s*alignItems: 'center',\s*justifyContent: 'center',\s*\},/g, "");
text = text.replace(/periodSwitcher: \{\s*flexDirection: 'row',\s*backgroundColor: 'rgba\(255,255,255,0\.1\)',\s*alignSelf: 'center',\s*borderRadius: 10,\s*padding: 4,\s*\},/g, "");
text = text.replace(/periodBtnActive: \{\s*backgroundColor: Colors\.primary,\s*shadowColor: '#000',\s*shadowOffset: \{ width: 0, height: 1 \},\s*shadowOpacity: 0\.1,\s*shadowRadius: 2,\s*elevation: 2,\s*\},/g, "");
text = text.replace(/periodBtnText: \{\s*fontSize: 13,\s*fontWeight: '600',\s*color: 'rgba\(255,255,255,0\.6\)',\s*\},/g, "");
text = text.replace(/periodBtnTextActive: \{\s*color: Colors\.white,\s*\},/g, "");

// Write it back
fs.writeFileSync('app/(parent)/health/index.tsx', text, 'utf8');
