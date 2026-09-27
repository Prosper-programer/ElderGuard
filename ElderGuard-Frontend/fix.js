const fs = require('fs');
const file = 'app/(parent)/emergency.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /const yangoUrl = 'yango:\/\/';\s*try \{\s*const supported = await Linking\.canOpenURL\(yangoUrl\);\s*if \(supported\) \{\s*await Linking\.openURL\(yangoUrl\);\s*\} else \{\s*if \(Platform\.OS === 'ios'\) \{\s*Linking\.openURL\('https:\/\/apps\.apple\.com\/app\/yango\/id1436984399'\);\s*\} else \{\s*Linking\.openURL\('https:\/\/play\.google\.com\/store\/apps\/details\?id=com\.yandex\.yango'\);\s*\}\s*\}\s*\} catch \(error\) \{\s*Alert\.alert\('Error', 'Unable to open Yango app\.'\);\s*\}/s;

const newText = `try {
      await Linking.openURL('yango://');
    } catch (appError) {
      try {
        const storeUrl = Platform.OS === 'ios'
          ? 'https://apps.apple.com/app/yango/id1436984399'
          : 'https://play.google.com/store/apps/details?id=com.yandex.yango';
        await Linking.openURL(storeUrl);
      } catch (storeError) {
        Alert.alert('Notice', 'Could not open Yango or the App Store.');
      }
    }`;

content = content.replace(regex, newText);
fs.writeFileSync(file, content);
console.log('Fixed');
