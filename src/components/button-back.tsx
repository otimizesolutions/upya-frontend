import { useRouter } from 'expo-router';
import { Button, type ButtonProps } from '@/components/ui/button';

export type ButtonBackProps = Omit<ButtonProps, 'onPress'>;

/** Botão que retorna à tela anterior do histórico de navegação. */
export function ButtonBack({
  children = 'Voltar',
  variant = 'secondary',
  ...props
}: ButtonBackProps) {
  const router = useRouter();

  return (
    <Button
      variant={variant}
      onPress={() => {
        if (router.canGoBack()) {
          router.back();
          return;
        }
        router.replace('/');
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
