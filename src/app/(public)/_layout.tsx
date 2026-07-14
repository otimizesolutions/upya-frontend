import { Stack } from 'expo-router';
import { backgroundColor } from '@/domains/theme/constants/colors';

export default function PublicLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" />
      <Stack.Screen name="forgot" />
    </Stack>
  );
}
