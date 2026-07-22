import { Stack } from 'expo-router';
import { ClientRegistrationProvider } from '@/domains/client-registration/context';

export default function ClientRegistrationLayout() {
  return (
    <ClientRegistrationProvider>
      <Stack
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      />
    </ClientRegistrationProvider>
  );
}
