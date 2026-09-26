const fs = require('fs');
let text = fs.readFileSync('app/(parent)/index.tsx', 'utf8');

// 1. Greeting Name in Blue
text = text.replace(
  /<Text style=\{styles\.greetingTitle\}>Good morning, \{parentFirstName\} ??<\/Text>/,
  "<Text style={styles.greetingTitle}>Good morning, <Text style={{ color: Colors.primary }}>{parentFirstName}</Text> ??</Text>"
);

// 2. Interactive Icons to Blue
// Top Header Bell
text = text.replace(
  /<Bell size=\{20\} color=\{Colors\.textPrimary\} \/>/g,
  "<Bell size={20} color={Colors.primary} />"
);
// Care Plan Pill
text = text.replace(
  /<Pill size=\{20\} color=\{Colors\.textPrimary\} \/>/g,
  "<Pill size={20} color={Colors.primary} />"
);

// 3. Section Overline Color
text = text.replace(
  /sectionOverline: \{\r?\n    fontSize: 12,\r?\n    fontWeight: '700',\r?\n    color: Colors\.textSecondary,/m,
  "sectionOverline: {\n    fontSize: 12,\n    fontWeight: '800',\n    color: Colors.primary,"
);

// 4. Map Overlay Tint
text = text.replace(
  /mapQuickActionOverlay: \{\r?\n    flex: 1,\r?\n    backgroundColor: 'rgba\\(255, 255, 255, 0\.4\\)',/m,
  "mapQuickActionOverlay: {\n    flex: 1,\n    backgroundColor: 'rgba(60, 111, 219, 0.45)',"
);
// Make map quick action text white so it reads clearly over blue
text = text.replace(
  /mapQuickActionLabel: \{\r?\n    fontSize: 14,\r?\n    fontWeight: '700',\r?\n    color: Colors\.textPrimary,/m,
  "mapQuickActionLabel: {\n    fontSize: 14,\n    fontWeight: '700',\n    color: Colors.white,"
);

fs.writeFileSync('app/(parent)/index.tsx', text, 'utf8');
