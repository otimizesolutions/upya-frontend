import { Stack } from 'expo-router';
import { ProfessionalRegistrationProvider } from '@/domains/professional-registration/context';

export default function ProfessionalRegistrationLayout() {
  return (
    <ProfessionalRegistrationProvider>
      <Stack
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      />
    </ProfessionalRegistrationProvider>
  );
}
