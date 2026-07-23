import { useEffect, useState } from 'react';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Controller } from 'react-hook-form';
import {
  Check,
  Contact,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from 'lucide-react-native';
import { View } from 'react-native';
import {
  ClientRegistrationField,
  RegistrationErrorMessage,
} from '@/components/client-registration-field';
import { ClientRegistrationOtp } from '@/components/client-registration-otp';
import { ClientRegistrationShell } from '@/components/client-registration-shell';
import { Screen } from '@/components/screen';
import { Text } from '@/components/ui/text';
import {
  type ClientRegistrationData,
  useClientRegistrationForm,
} from '@/domains/client-registration/context';
import {
  resolveCustomerStepForField,
  resolveFirstCustomerErrorField,
  type ClientRegistrationStep,
} from '@/domains/customers/errors';
import { useCreateCustomerMutation } from '@/domains/customers/mutations';
import {
  hasPasswordMinLength,
  hasPasswordSpecialChar,
  PASSWORD_MIN_LENGTH_MESSAGE,
  PASSWORD_SPECIAL_CHAR_MESSAGE,
} from '@/domains/registration/validation';
import {
  CPF_MASK,
  CPF_MAX_LENGTH,
  PHONE_MASK,
  PHONE_MAX_LENGTH,
} from '@/lib/masks';

const iconProps = { color: '#868b91', size: 20, strokeWidth: 1.75 };

type FocusField = keyof ClientRegistrationData;

function routeFor(step: ClientRegistrationStep, focus?: FocusField): Href {
  return {
    pathname: '/register/client/[step]',
    params: focus ? { step, focus } : { step },
  };
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

function useFocusField(fieldName?: string) {
  const form = useClientRegistrationForm();

  useEffect(() => {
    if (!fieldName) return;

    const timer = setTimeout(() => {
      form.setFocus(fieldName as FocusField);
    }, 350);

    return () => clearTimeout(timer);
  }, [fieldName, form]);
}

function EmailStep() {
  const router = useRouter();
  const form = useClientRegistrationForm();
  const params = useLocalSearchParams<{ focus?: string }>();
  const email = form.watch('email');
  const confirmEmail = form.watch('confirmEmail');
  const errors = form.formState.errors;
  const focusField = params.focus;
  useFocusField(focusField);

  return (
    <ClientRegistrationShell
      activeStep={1}
      disabled={!email || !confirmEmail}
      onContinue={async () => {
        if (await form.trigger(['email', 'confirmEmail'])) {
          router.push(routeFor('phone'));
        }
      }}
    >
      <View className="w-full gap-4">
        <ClientRegistrationField
          autoCapitalize="none"
          autoComplete="email"
          autoFocus={focusField === 'email' || !focusField}
          control={form.control}
          forceError={!!errors.email}
          icon={<Mail {...iconProps} />}
          keyboardType="email-address"
          label="Insira seu e-mail"
          name="email"
          returnKeyType="next"
          textContentType="emailAddress"
          transform={(value) => value.trim()}
        />
        <ClientRegistrationField
          autoCapitalize="none"
          autoComplete="email"
          autoFocus={focusField === 'confirmEmail'}
          control={form.control}
          forceError={!!errors.confirmEmail}
          icon={<Mail {...iconProps} />}
          keyboardType="email-address"
          label="Confirme o e-mail"
          name="confirmEmail"
          returnKeyType="done"
          textContentType="emailAddress"
          transform={(value) => value.trim()}
        />
        <Text className="font-sans text-[14px] leading-[1.5] text-gray-400">
          Ao clicar em continuar, você concorda com os{' '}
          <Text className="text-[#f0ff8c]">Termos de uso</Text> e está ciente do{' '}
          <Text className="text-[#f0ff8c]">Aviso de privacidade.</Text>
        </Text>
      </View>
    </ClientRegistrationShell>
  );
}

function PhoneStep() {
  const router = useRouter();
  const form = useClientRegistrationForm();
  const params = useLocalSearchParams<{ focus?: string }>();
  const hasPhone = onlyDigits(form.watch('phone')).length > 0;
  useFocusField(params.focus);

  return (
    <ClientRegistrationShell
      activeStep={2}
      disabled={!hasPhone}
      onContinue={async () => {
        if (await form.trigger('phone')) {
          router.push(routeFor('otp'));
        }
      }}
    >
      <View className="w-full gap-6">
        <ClientRegistrationField
          autoComplete="tel"
          autoFocus
          control={form.control}
          forceError={!!form.formState.errors.phone}
          icon={<Phone {...iconProps} />}
          keyboardType="phone-pad"
          label="Insira seu telefone"
          mask={PHONE_MASK}
          maxLength={PHONE_MAX_LENGTH}
          name="phone"
          returnKeyType="done"
          textContentType="telephoneNumber"
        />
      </View>
    </ClientRegistrationShell>
  );
}

function OtpStep() {
  const router = useRouter();
  const form = useClientRegistrationForm();
  const phone = form.watch('phone');
  const otp = form.watch('otp');
  const otpError = form.formState.errors.otp?.message;
  const [seconds, setSeconds] = useState(60);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (seconds === 0) {
      if (otp.length === 4) {
        form.setError('otp', {
          type: 'expired',
          message: 'O código expirou. Solicite um novo.',
        });
      }
      return;
    }
    const timer = setTimeout(() => setSeconds((current) => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [form, otp.length, seconds]);

  return (
    <ClientRegistrationShell
      activeStep={3}
      disabled={submitted && otp.length !== 4}
      onContinue={async () => {
        setSubmitted(true);
        if (seconds === 0) {
          form.setError('otp', {
            type: 'expired',
            message: 'O código expirou. Solicite um novo.',
          });
          return;
        }
        if (await form.trigger('otp')) {
          router.push(routeFor('personal'));
        }
      }}
    >
      <View className="w-full items-center gap-8">
        <View className="w-full items-center gap-2">
          <Text className="text-center font-display-semibold text-[24px] leading-[1.4] text-gray-100">
            {'Enviamos um código\npor SMS'}
          </Text>
          <Text className="text-center font-sans text-[16px] leading-[1.4] tracking-[-0.32px] text-gray-600">
            Código enviado para {phone}
          </Text>
        </View>
        <View className="items-center gap-4">
          <Controller
            control={form.control}
            name="otp"
            render={({ field }) => (
              <ClientRegistrationOtp
                error={!!otpError}
                value={field.value}
                onBlur={field.onBlur}
                onChange={(value) => {
                  form.clearErrors('otp');
                  field.onChange(value);
                }}
              />
            )}
          />
          <RegistrationErrorMessage message={otpError} />
          <Text
            className={
              seconds > 0
                ? 'font-sans text-[16px] leading-[1.4] text-gray-800'
                : 'font-sans text-[16px] leading-[1.4] text-gray-100'
            }
            onPress={
              seconds === 0
                ? () => {
                    form.setValue('otp', '');
                    form.clearErrors('otp');
                    setSeconds(60);
                  }
                : undefined
            }
          >
            {seconds > 0
              ? `Reenviar código em ${seconds} segundos`
              : 'Reenviar código'}
          </Text>
        </View>
      </View>
    </ClientRegistrationShell>
  );
}

function PersonalStep() {
  const router = useRouter();
  const form = useClientRegistrationForm();
  const params = useLocalSearchParams<{ focus?: string }>();
  const fullName = form.watch('fullName');
  const cpf = form.watch('cpf');
  const errors = form.formState.errors;
  const focusField = params.focus;
  useFocusField(focusField);

  return (
    <ClientRegistrationShell
      activeStep={4}
      disabled={!fullName.trim() || !onlyDigits(cpf)}
      onContinue={async () => {
        if (await form.trigger(['fullName', 'cpf'])) {
          router.push(routeFor('password'));
        }
      }}
    >
      <View className="w-full gap-6">
        <Text className="text-center font-display-semibold text-[24px] leading-[1.4] text-gray-100">
          Dados Pessoais
        </Text>
        <View className="w-full gap-4">
          <ClientRegistrationField
            autoCapitalize="words"
            autoComplete="name"
            autoFocus={focusField === 'fullName' || !focusField}
            control={form.control}
            forceError={!!errors.fullName}
            icon={<UserRound {...iconProps} />}
            label="Nome completo"
            name="fullName"
            returnKeyType="next"
            textContentType="name"
          />
          <ClientRegistrationField
            autoFocus={focusField === 'cpf'}
            control={form.control}
            forceError={!!errors.cpf}
            icon={<Contact {...iconProps} />}
            keyboardType="number-pad"
            label="CPF"
            mask={CPF_MASK}
            maxLength={CPF_MAX_LENGTH}
            name="cpf"
            returnKeyType="done"
          />
        </View>
      </View>
    </ClientRegistrationShell>
  );
}

function PasswordRequirement({
  checked,
  children,
}: {
  checked: boolean;
  children: string;
}) {
  return (
    <View className="flex-row items-center gap-2">
      <View
        className={
          checked
            ? 'h-5 w-5 items-center justify-center rounded-full bg-neon'
            : 'h-5 w-5 items-center justify-center rounded-full bg-gray-800'
        }
      >
        <Check color="#000000" size={13} strokeWidth={2.5} />
      </View>
      <Text className="font-sans text-[14px] leading-[1.5] text-gray-700">
        {children}
      </Text>
    </View>
  );
}

function PasswordStep() {
  const router = useRouter();
  const form = useClientRegistrationForm();
  const params = useLocalSearchParams<{ focus?: string }>();
  const password = form.watch('password');
  const confirmPassword = form.watch('confirmPassword');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const hasLength = hasPasswordMinLength(password);
  const hasSpecial = hasPasswordSpecialChar(password);
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const errors = form.formState.errors;
  const focusField = params.focus;
  useFocusField(focusField);

  const createCustomer = useCreateCustomerMutation(form, {
    onSuccess: () => {
      router.push(routeFor('success'));
    },
    onFieldErrors: (fields) => {
      const firstField = resolveFirstCustomerErrorField(fields);
      if (!firstField) return;

      const step = resolveCustomerStepForField(firstField);
      if (!step) return;

      if (step === 'password') {
        form.setFocus(firstField);
        return;
      }

      router.navigate(routeFor(step, firstField));
    },
  });

  return (
    <ClientRegistrationShell
      activeStep={6}
      totalSteps={6}
      disabled={!hasLength || !hasSpecial || !passwordsMatch}
      loading={createCustomer.isPending}
      onContinue={async () => {
        if (!(await form.trigger(['password', 'confirmPassword']))) return;
        createCustomer.mutate(form.getValues());
      }}
    >
      <View className="w-full gap-6">
        <Text className="text-center font-display-semibold text-[24px] leading-[1.4] text-gray-100">
          Senha
        </Text>
        <View className="w-full gap-4">
          <ClientRegistrationField
            autoComplete="new-password"
            autoFocus={focusField === 'password' || !focusField}
            control={form.control}
            forceError={!!errors.password}
            icon={<LockKeyhole {...iconProps} />}
            label="Senha"
            name="password"
            secureTextEntry={!passwordVisible}
            secureVisible={passwordVisible}
            textContentType="newPassword"
            onToggleSecure={() => setPasswordVisible((current) => !current)}
          />
          <ClientRegistrationField
            autoComplete="new-password"
            autoFocus={focusField === 'confirmPassword'}
            control={form.control}
            forceError={!!errors.confirmPassword}
            icon={<LockKeyhole {...iconProps} />}
            label="Confirmar Senha"
            name="confirmPassword"
            secureTextEntry={!confirmVisible}
            secureVisible={confirmVisible}
            textContentType="newPassword"
            onToggleSecure={() => setConfirmVisible((current) => !current)}
          />
          <View className="gap-3">
            <PasswordRequirement checked={hasLength}>
              {PASSWORD_MIN_LENGTH_MESSAGE}
            </PasswordRequirement>
            <PasswordRequirement checked={hasSpecial}>
              {PASSWORD_SPECIAL_CHAR_MESSAGE}
            </PasswordRequirement>
          </View>
        </View>
      </View>
    </ClientRegistrationShell>
  );
}

function SuccessStep() {
  const router = useRouter();
  const form = useClientRegistrationForm();

  useEffect(() => {
    const timer = setTimeout(() => {
      form.reset();
      router.replace({ pathname: '/login', params: { role: 'client' } });
    }, 1800);
    return () => clearTimeout(timer);
  }, [form, router]);

  return (
    <Screen
      className="bg-gray-1000"
      contentClassName="items-center justify-center"
    >
      <StatusBar style="light" />
      <View className="w-[187px] items-center gap-4">
        <View className="h-[120px] w-[120px] items-center justify-center rounded-full bg-[rgba(232,255,0,0.1)]">
          <Check color="#e8ff00" size={56} strokeWidth={2} />
        </View>
        <Text className="text-center font-display-semibold text-[24px] leading-[1.4] text-gray-100">
          Conta Criada com sucesso
        </Text>
      </View>
    </Screen>
  );
}

export default function ClientRegistrationStepPage() {
  const params = useLocalSearchParams<{ step?: string }>();
  const step = params.step as ClientRegistrationStep;

  switch (step) {
    case 'phone':
      return <PhoneStep />;
    case 'otp':
      return <OtpStep />;
    case 'personal':
      return <PersonalStep />;
    case 'password':
      return <PasswordStep />;
    case 'success':
      return <SuccessStep />;
    case 'email':
    default:
      return <EmailStep />;
  }
}
