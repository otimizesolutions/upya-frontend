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
import { useCreateCustomerMutation } from '@/domains/customers/mutations';
import {
  hasPasswordMinLength,
  hasPasswordSpecialChar,
  PASSWORD_MIN_LENGTH_MESSAGE,
  PASSWORD_SPECIAL_CHAR_MESSAGE,
} from '@/domains/registration/validation';

type RegistrationStep =
  | 'email'
  | 'phone'
  | 'otp'
  | 'personal'
  | 'password'
  | 'success';

const iconProps = { color: '#868b91', size: 20, strokeWidth: 1.75 };

const FIELD_STEP: Partial<
  Record<keyof ClientRegistrationData, RegistrationStep>
> = {
  email: 'email',
  confirmEmail: 'email',
  phone: 'phone',
  fullName: 'personal',
  cpf: 'personal',
  password: 'password',
  confirmPassword: 'password',
};

const STEP_PRIORITY: RegistrationStep[] = [
  'email',
  'phone',
  'personal',
  'password',
];

function routeFor(step: RegistrationStep): Href {
  return `/register/client/${step}` as Href;
}

function resolveStepForFields(
  fields: (keyof ClientRegistrationData)[],
): RegistrationStep | null {
  for (const step of STEP_PRIORITY) {
    if (fields.some((field) => FIELD_STEP[field] === step)) {
      return step;
    }
  }
  return null;
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

function formatPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function EmailStep() {
  const router = useRouter();
  const form = useClientRegistrationForm();
  const data = form.watch();
  const errors = form.formState.errors;
  const isMismatch =
    errors.confirmEmail?.message === 'Os e-mails não coincidem.';
  const hasGroupError = !!(errors.email || errors.confirmEmail) && !isMismatch;
  const errorMessage = errors.email?.message ?? errors.confirmEmail?.message;

  return (
    <ClientRegistrationShell
      activeStep={1}
      disabled={!data.email || !data.confirmEmail}
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
          autoFocus
          control={form.control}
          forceError={hasGroupError || !!errors.email}
          icon={<Mail {...iconProps} />}
          keyboardType="email-address"
          label="Insira seu e-mail"
          name="email"
          returnKeyType="next"
          showErrorMessage={false}
          textContentType="emailAddress"
          transform={(value) => value.trim()}
        />
        <ClientRegistrationField
          autoCapitalize="none"
          autoComplete="email"
          control={form.control}
          forceError={hasGroupError || !!errors.confirmEmail}
          icon={<Mail {...iconProps} />}
          keyboardType="email-address"
          label="Confirme o e-mail"
          name="confirmEmail"
          returnKeyType="done"
          showErrorMessage={false}
          textContentType="emailAddress"
          transform={(value) => value.trim()}
        />
        <RegistrationErrorMessage message={errorMessage} />
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
  const phone = form.watch('phone');
  const hasPhone = onlyDigits(phone).length > 0;

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
          icon={<Phone {...iconProps} />}
          keyboardType="phone-pad"
          label="Insira seu telefone"
          name="phone"
          returnKeyType="done"
          showErrorMessage={false}
          textContentType="telephoneNumber"
          transform={formatPhone}
        />
        <RegistrationErrorMessage
          message={form.formState.errors.phone?.message}
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
  const data = form.watch();
  const errors = form.formState.errors;
  const errorMessage = errors.fullName?.message ?? errors.cpf?.message;

  return (
    <ClientRegistrationShell
      activeStep={4}
      disabled={!data.fullName.trim() || !onlyDigits(data.cpf)}
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
            autoFocus
            control={form.control}
            icon={<UserRound {...iconProps} />}
            label="Nome completo"
            name="fullName"
            returnKeyType="next"
            showErrorMessage={false}
            textContentType="name"
          />
          <ClientRegistrationField
            control={form.control}
            icon={<Contact {...iconProps} />}
            keyboardType="number-pad"
            label="CPF"
            name="cpf"
            returnKeyType="done"
            showErrorMessage={false}
            transform={formatCpf}
          />
        </View>
        <RegistrationErrorMessage message={errorMessage} />
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
  const data = form.watch();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const hasLength = hasPasswordMinLength(data.password);
  const hasSpecial = hasPasswordSpecialChar(data.password);
  const passwordsMatch =
    data.confirmPassword.length > 0 && data.password === data.confirmPassword;
  const passwordError =
    form.formState.errors.password?.message ??
    form.formState.errors.confirmPassword?.message;

  const createCustomer = useCreateCustomerMutation(form, {
    onSuccess: () => {
      router.push(routeFor('success'));
    },
    onFieldErrors: (fields) => {
      const step = resolveStepForFields(fields);
      if (step && step !== 'password') {
        router.navigate(routeFor(step));
      }
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
            autoFocus
            autoComplete="new-password"
            control={form.control}
            forceError={!!form.formState.errors.password}
            icon={<LockKeyhole {...iconProps} />}
            label="Senha"
            name="password"
            secureTextEntry={!passwordVisible}
            secureVisible={passwordVisible}
            showErrorMessage={false}
            textContentType="newPassword"
            onToggleSecure={() => setPasswordVisible((current) => !current)}
          />
          <ClientRegistrationField
            autoComplete="new-password"
            control={form.control}
            forceError={!!form.formState.errors.confirmPassword}
            icon={<LockKeyhole {...iconProps} />}
            label="Confirmar Senha"
            name="confirmPassword"
            secureTextEntry={!confirmVisible}
            secureVisible={confirmVisible}
            showErrorMessage={false}
            textContentType="newPassword"
            onToggleSecure={() => setConfirmVisible((current) => !current)}
          />
          <RegistrationErrorMessage message={passwordError} />
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
  const step = params.step as RegistrationStep;

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
