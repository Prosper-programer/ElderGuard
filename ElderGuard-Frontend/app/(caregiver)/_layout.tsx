import { Stack } from 'expo-router';

export default function CaregiverLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="alerts/index" />
      <Stack.Screen name="alerts/[id]" />
      <Stack.Screen name="care/index" />
      <Stack.Screen name="history" />
      <Stack.Screen name="location" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
