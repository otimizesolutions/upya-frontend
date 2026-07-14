import { View } from 'react-native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { TextField } from '@/components/text-field';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
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
  const form = useForm<ForgotFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  function handleSubmit(_values: ForgotFormValues) {
    // Endpoint de recuperação ainda não conectado
  }

  return (
    <View className="flex-1 justify-center bg-background px-8">
      <Text variant="headingLg" className="mb-3 text-center">
        Esqueci a senha
      </Text>
      <Text variant="paragraphSm" className="mb-8 text-center text-content-secondary">
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

        <Button onPress={form.handleSubmit(handleSubmit)} className="mb-6">
          Enviar
        </Button>

        <View className="items-center">
          <Link href="/auth/login">Voltar ao login</Link>
        </View>
      </Form>
    </View>
  );
}
