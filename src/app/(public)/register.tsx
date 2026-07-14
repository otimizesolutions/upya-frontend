import { ButtonLink } from '@/components/button-link';
import { Screen } from '@/components/screen';
import { Text } from '@/components/ui/text';

export default function RegisterPage() {
  return (
    <Screen contentClassName="items-center justify-center px-8 py-6">
      <Text variant="paragraphMd" className="mb-5 text-center">
        A página de Registro não foi implementada ainda.
      </Text>
      <ButtonLink href="/login" className="w-full max-w-sm">
        Entrar
      </ButtonLink>
    </Screen>
  );
}
