import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import 'react-native-reanimated';
import { AuthProvider } from '@/context/AuthContext';
import { ElderlyProvider } from '@/context/ElderlyContext';
import { VitalsProvider } from '@/context/VitalsContext';
import { AlertProvider } from '@/context/AlertContext';
import { CareProvider } from '@/context/CareContext';

// Keep splash visible while fonts load
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <ElderlyProvider>
        <VitalsProvider>
          <AlertProvider>
            <CareProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(parent)" />
                <Stack.Screen name="(caregiver)" />
                <Stack.Screen name="(doctor)" />
                <Stack.Screen name="(admin)" />
                <Stack.Screen name="design-system" />
              </Stack>
              <StatusBar style="dark" />
            </CareProvider>
          </AlertProvider>
        </VitalsProvider>
      </ElderlyProvider>
    </AuthProvider>
  );
}
