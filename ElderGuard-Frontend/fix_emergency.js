const fs = require('fs');
let text = fs.readFileSync('app/(parent)/emergency.tsx', 'utf8');
text = text.replace(/Easing,\r?\n\} from 'react-native';/, "Easing,\n  Platform,\n} from 'react-native';");
fs.writeFileSync('app/(parent)/emergency.tsx', text, 'utf8');
