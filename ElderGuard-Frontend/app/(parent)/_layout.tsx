import { Stack } from 'expo-router';

export default function ParentLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="health/index" />
      <Stack.Screen name="location" />
      <Stack.Screen name="geofencing" />
      <Stack.Screen name="care/index" />
      <Stack.Screen name="care/new-medication" />
      <Stack.Screen name="alerts/index" />
      <Stack.Screen name="alerts/[id]" />
      <Stack.Screen name="emergency" />
      <Stack.Screen name="first-aid" />
      <Stack.Screen name="device" />
      <Stack.Screen name="profile/index" />
      <Stack.Screen name="profile/edit" />
      <Stack.Screen name="profile/create" />
      <Stack.Screen name="caregivers/create" />
      <Stack.Screen name="doctors/create" />
      <Stack.Screen name="health-report" />
      <Stack.Screen name="reports/index" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="more" />
      <Stack.Screen name="doctor-status" />
      <Stack.Screen name="history" />
      <Stack.Screen name="ai-insights" />
    </Stack>
  );
}
