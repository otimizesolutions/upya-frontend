import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useLogoutMutation } from '@/domains/auth/mutations';

export default function TabTwoScreen() {
  const logoutMutation = useLogoutMutation();

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text variant="headingSm">Você está na área autenticada.</Text>
      <Text variant="paragraphMd" className="mt-2 text-content-secondary">
        Aba Explorar.
      </Text>

      <Button
        className="mt-12 w-52"
        onPress={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
      >
        {logoutMutation.isPending ? 'Saindo...' : 'Sair'}
      </Button>
    </View>
  );
}
