import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useLogoutMutation } from '@/domains/auth/mutations';
import { useAuthStore } from '@/domains/auth/stores';

export default function ExploreScreen() {
  const router = useRouter();
  const logoutMutation = useLogoutMutation();
  const role = useAuthStore((state) => state.role);

  async function handleLogout() {
    await logoutMutation.mutateAsync();
    router.replace({
      pathname: '/login',
      params: { role: role ?? 'client' },
    });
  }

  return (
    <View className="flex-1 items-center justify-center bg-background px-4">
      <Text variant="headingSm">Você está na área autenticada.</Text>
      <Text variant="paragraphMd" className="mt-2 text-content-secondary">
        Aba Explorar.
      </Text>

      <Button
        className="mt-12 w-full max-w-xs"
        disabled={logoutMutation.isPending}
        onPress={handleLogout}
      >
        {logoutMutation.isPending ? 'Saindo...' : 'Sair'}
      </Button>
    </View>
  );
}
