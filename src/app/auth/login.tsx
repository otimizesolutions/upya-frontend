import { StyleSheet, View } from 'react-native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { TextField } from '@/components/text-field';
import { TextFieldPassword } from '@/components/text-field-password';
import { Button } from '@/components/button';
import { backgroundColor } from '@/domains/theme/constants/colors';
import { Link } from '@/components/link';
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

export default function LoginPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const loginMutation = useLoginMutation(form);

  function handleSubmit(values: z.infer<typeof formSchema>) {
    loginMutation.mutate(values);
  }

  return (
    <View style={styles.container}>
      <FormProvider {...form}>
        <TextField
          control={form.control}
          name="email"
          label="E-mail"
          placeholder="Insira seu e-mail"
          keyboardType="email-address"
        />

        <TextFieldPassword
          control={form.control}
          name="password"
          label="Senha"
          placeholder="Insira sua senha"
          containerStyle={{ marginBottom: 8 }}
        />

        <View style={styles.forgotContainer}>
          <Link href="/auth/forgot">Esqueci a senha</Link>
        </View>

        <View>
          <Button
            onPress={form.handleSubmit(handleSubmit)}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
          </Button>
        </View>
      </FormProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor,
    paddingHorizontal: 30,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: 50,
  },
});
