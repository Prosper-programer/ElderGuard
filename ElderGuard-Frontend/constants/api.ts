import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * BACKEND API CONFIGURATION
 * 
 * Automatically selects the appropriate backend URL depending on the runtime platform:
 * 1. Web browser: http://localhost:5000
 * 2. Expo Go (physical phone over Wi-Fi): uses your computer's local Wi-Fi IP automatically via hostUri
 * 3. Android Emulator: http://10.0.2.2:5000
 * 4. iOS Simulator / Fallback: http://localhost:5000
 */
export const getApiBaseUrl = (): string => {
  // If running in a web browser
  if (Platform.OS === 'web') {
    return 'http://localhost:5000';
  }

  // When testing on a physical phone with Expo Go
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const localIp = hostUri.split(':')[0];
    return `http://${localIp}:5000`;
  }

  // Android Emulator default loopback address
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000';
  }

  // Default fallback for iOS Simulator / desktop
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiBaseUrl();
