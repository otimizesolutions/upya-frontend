import type { PropsWithChildren } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import {
  isValidCpf,
  onlyDigits,
  passwordSchema,
} from '@/domains/registration/validation';

export const clientRegistrationSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Informe seu e-mail.')
      .email('Digite um e-mail válido.'),
    confirmEmail: z
      .string()
      .min(1, 'Informe seu e-mail.')
      .email('Digite um e-mail válido.'),
    phone: z
      .string()
      .min(1, 'Informe seu telefone.')
      .refine(
        (value) => [10, 11].includes(onlyDigits(value).length),
        'Digite um telefone válido.',
      ),
    otp: z
      .string()
      .min(1, 'Informe o código de validação.')
      .length(4, 'Informe o código de validação.'),
    fullName: z
      .string()
      .min(1, 'Informe seu nome.')
      .refine(
        (value) => value.trim().split(/\s+/).length >= 2,
        'Informe seu nome.',
      ),
    cpf: z
      .string()
      .min(1, 'Informe seu CPF.')
      .refine(isValidCpf, 'Digite um CPF válido.'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirme sua senha.'),
  })
  .refine((values) => values.email === values.confirmEmail, {
    message: 'Os e-mails não coincidem.',
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
