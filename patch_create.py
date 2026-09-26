import re

with open(r'c:\Users\LENOVO\Desktop\level 2\stage\internship\app\ElderGuard\ElderGuard-Frontend\app\(parent)\profile\create.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
if 'expo-image-picker' not in content:
    content = content.replace(""import { ArrowLeft, UserPlus, AlertCircle } from 'lucide-react-native';"", 
                              ""import { ArrowLeft, UserPlus, AlertCircle, Camera } from 'lucide-react-native';\nimport * as ImagePicker from 'expo-image-picker';\nimport { Image } from 'react-native';"")

# Add state
if 'const [imageUrl, setImageUrl] = useState' not in content:
    content = content.replace(""const [fullName, setFullName] = useState('');"",
                              ""const [fullName, setFullName] = useState('');\n  const [imageUrl, setImageUrl] = useState<string | null>(null);"")

# Add image picker logic
picker_logic = '''
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUrl(result.assets[0].uri);
    }
  };
'''
if 'const pickImage =' not in content:
    content = content.replace(""const handleCreate = async () => {"", picker_logic + ""\n  const handleCreate = async () => {"")

# Pass imageUrl to createProfile
if 'imageUrl: imageUrl || undefined,' not in content:
    content = content.replace(""age: parseInt(age, 10),"", ""imageUrl: imageUrl || undefined,\n      age: parseInt(age, 10),"")

# Add UI for image picker
ui_logic = '''
      <View style={styles.introHeader}>
        <TouchableOpacity onPress={pickImage} style={{ alignSelf: 'center', marginBottom: 20, width: 100, height: 100, borderRadius: 50, backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 2, borderColor: '#CBD5E1' }}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={{ width: '100%', height: '100%' }} />
          ) : (
            <>
              <Camera size={32} color="#64748B" />
              <Text style={{ fontSize: 10, color: '#64748B', marginTop: 4 }}>Add Photo</Text>
            </>
          )}
        </TouchableOpacity>
'''
if '<TouchableOpacity onPress={pickImage}' not in content:
    content = content.replace(""<View style={styles.introHeader}>"", ui_logic)

with open(r'c:\Users\LENOVO\Desktop\level 2\stage\internship\app\ElderGuard\ElderGuard-Frontend\app\(parent)\profile\create.tsx', 'w', encoding='utf-8') as f:
    f.write(content)