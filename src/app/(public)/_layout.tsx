import { Stack } from 'expo-router';
import { backgroundColor } from '@/domains/theme/constants/colors';

const screenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor },
  animation: 'slide_from_right' as const,
};

export default function PublicLayout() {
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot" />
    </Stack>
  );
}
