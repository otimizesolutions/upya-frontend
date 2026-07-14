import { Stack } from 'expo-router';
import { backgroundColor } from '@/domains/theme/constants/colors';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor },
      }}
    />
  );
}
