import type { PropsWithChildren } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { isValidCpf, onlyDigits } from '@/domains/registration/validation';

export const professionalRegistrationSchema = z
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
    crefito: z
      .string()
      .min(1, 'CREFITO incorreto.')
      .refine((value) => onlyDigits(value).length >= 6, 'CREFITO incorreto.'),
    password: z
      .string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres.')
      .regex(/[^A-Za-z0-9]/, 'A senha deve conter um caractere especial.'),
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

export type ProfessionalRegistrationData = z.infer<
  typeof professionalRegistrationSchema
>;

const initialData: ProfessionalRegistrationData = {
  confirmEmail: '',
  confirmPassword: '',
  cpf: '',
  crefito: '',
  email: '',
  fullName: '',
  otp: '',
  password: '',
  phone: '',
};

export function ProfessionalRegistrationProvider({
  children,
}: PropsWithChildren) {
  const form = useForm<ProfessionalRegistrationData>({
    resolver: zodResolver(professionalRegistrationSchema),
    defaultValues: initialData,
    mode: 'onChange',
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

export function useProfessionalRegistrationForm() {
  return useFormContext<ProfessionalRegistrationData>();
}
