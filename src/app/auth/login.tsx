import { View } from 'react-native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { TextField } from '@/components/text-field';
import { TextFieldPassword } from '@/components/text-field-password';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/link';
import { Form } from '@/components/ui/form';
import { Text } from '@/components/ui/text';
import { useLoginMutation } from '@/domains/auth/mutations';

const emailMessage = 'Preencha seu e-mail.';
const passwordMessage = 'Preencha sua senha.';
const formSchema = z.object({
  email: z
    .string({ message: emailMessage })
    .min(2, { message: emailMessage })
    .email({ message: emailMessage }),
  password: z
    .string({ message: passwordMessage })
    .min(1, { message: passwordMessage }),
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const loginMutation = useLoginMutation(form);

  function handleSubmit(values: LoginFormValues) {
    loginMutation.mutate(values);
  }

  return (
    <View className="flex-1 justify-center bg-background px-8">
      <Text variant="headingLg" className="mb-8 text-center">
        Entrar
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

        <TextFieldPassword
          control={form.control}
          name="password"
          label="Senha"
          placeholder="Insira sua senha"
          containerClassName="mb-2"
        />

        <View className="mb-12 items-end">
          <Link href="/auth/forgot">Esqueci a senha</Link>
        </View>

        <Button
          onPress={form.handleSubmit(handleSubmit)}
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
        </Button>
      </Form>
    </View>
  );
}
