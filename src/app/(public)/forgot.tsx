import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { TextField } from '@/components/text-field';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Screen } from '@/components/screen';
import { Text } from '@/components/ui/text';
import { Link } from '@/components/link';

const emailMessage = 'Preencha seu e-mail.';
const formSchema = z.object({
  email: z
    .string({ message: emailMessage })
    .min(2, { message: emailMessage })
    .email({ message: emailMessage }),
});

type ForgotFormValues = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const form = useForm<ForgotFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  function handleSubmit() {
    // Endpoint de recuperação ainda não conectado
  }

  return (
    <Screen scroll contentClassName="justify-center px-8 py-6">
      <Text variant="headingLg" className="mb-3 text-center">
        Esqueci a senha
      </Text>
      <Text
        variant="paragraphSm"
        className="mb-8 text-center text-content-secondary"
      >
        Informe seu e-mail para receber as instruções de recuperação.
      </Text>

      <Form {...form}>
        <TextField
          control={form.control}
          name="email"
          label="E-mail"
          placeholder="Insira seu e-mail"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Button
          onPress={form.handleSubmit(handleSubmit)}
          className="mb-6 w-full"
        >
          Enviar
        </Button>

        <View className="items-center">
          <Link
            href="/login"
            onPress={(event) => {
              if (router.canGoBack()) {
                event.preventDefault();
                router.back();
              }
            }}
          >
            Voltar ao login
          </Link>
        </View>
      </Form>
    </Screen>
  );
}
