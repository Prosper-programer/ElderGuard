const fs = require('fs');
let text = fs.readFileSync('app/(parent)/emergency.tsx', 'utf8');
if(!text.includes('import { Platform } from')) {
    text = text.replace("import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';", "import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Linking, Platform } from 'react-native';");
}
text = text.replace(/<Car size/g, "<Activity size");
fs.writeFileSync('app/(parent)/emergency.tsx', text, 'utf8');
