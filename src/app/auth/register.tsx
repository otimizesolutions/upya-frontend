import { View } from 'react-native';
import { ButtonLink } from '@/components/button-link';
import { Text } from '@/components/ui/text';

export default function RegisterPage() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-8">
      <Text variant="paragraphMd" className="mb-5 text-center">
        A página de Registro não foi implementada ainda.
      </Text>
      <ButtonLink href="/auth/login">Entrar</ButtonLink>
    </View>
  );
}
