const fs = require('fs');
let content = fs.readFileSync('app/(parent)/emergency.tsx', 'utf8');

const newCode = `  const handleYango = async () => {
    try {
      await Linking.openURL('yango://');
    } catch (appError) {
      if (Platform.OS === 'ios') {
        Linking.openURL('https://apps.apple.com/app/yango/id1436984399').catch(() => {
          Alert.alert('Notice', 'Could not open Yango or the App Store.');
        });
      } else {
        Linking.openURL('market://details?id=com.yandex.yango').catch(() => {
          Linking.openURL('https://play.google.com/store/apps/details?id=com.yandex.yango').catch(() => {
            Alert.alert('Notice', 'Could not open Yango or the Play Store.');
          });
        });
      }
    }
  };`;

content = content.replace(/  const handleYango = async \(\) => \{[\s\S]*?\n  \};\n/, newCode + '\n');
fs.writeFileSync('app/(parent)/emergency.tsx', content, 'utf8');
