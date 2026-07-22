import type { PropsWithChildren } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';

const onlyDigits = (value: string) => value.replace(/\D/g, '');

export const clientRegistrationSchema = z
  .object({
    email: z.email('Informe um e-mail válido.'),
    confirmEmail: z.email('Confirme seu e-mail.'),
    phone: z
      .string()
      .refine(
        (value) => onlyDigits(value).length >= 10,
        'Informe um telefone válido.',
      ),
    otp: z.string().length(4, 'Informe o código de quatro dígitos.'),
    fullName: z
      .string()
      .refine(
        (value) => value.trim().split(/\s+/).length >= 2,
        'Informe seu nome completo.',
      ),
    cpf: z
      .string()
      .refine(
        (value) => onlyDigits(value).length === 11,
        'Informe um CPF válido.',
      ),
    password: z
      .string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres.')
      .regex(/[^A-Za-z0-9]/, 'A senha deve conter um caractere especial.'),
    confirmPassword: z.string().min(1, 'Confirme sua senha.'),
  })
  .refine((values) => values.email === values.confirmEmail, {
    message: 'Os endereços de e-mail devem ser iguais.',
    path: ['confirmEmail'],
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'As senhas devem ser iguais.',
    path: ['confirmPassword'],
  });

export type ClientRegistrationData = z.infer<typeof clientRegistrationSchema>;

const initialData: ClientRegistrationData = {
  confirmEmail: '',
  confirmPassword: '',
  cpf: '',
  email: '',
  fullName: '',
  otp: '',
  password: '',
  phone: '',
};

export function ClientRegistrationProvider({ children }: PropsWithChildren) {
  const form = useForm<ClientRegistrationData>({
    resolver: zodResolver(clientRegistrationSchema),
    defaultValues: initialData,
    mode: 'onChange',
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

export function useClientRegistrationForm() {
  return useFormContext<ClientRegistrationData>();
}
