import { Stack } from 'expo-router';
import { backgroundColor } from '@/domains/theme/constants/colors';

export default function PrivateLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor },
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
