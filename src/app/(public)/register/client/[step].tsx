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
import { ClientRegistrationField } from '@/components/client-registration-field';
import { ClientRegistrationOtp } from '@/components/client-registration-otp';
import { ClientRegistrationShell } from '@/components/client-registration-shell';
import { Screen } from '@/components/screen';
import { Text } from '@/components/ui/text';
import { useClientRegistrationForm } from '@/domains/client-registration/context';

type RegistrationStep =
  'email' | 'phone' | 'otp' | 'personal' | 'password' | 'success';

const iconProps = { color: '#868b91', size: 20, strokeWidth: 1.75 };

function routeFor(step: RegistrationStep): Href {
  return `/register/client/${step}` as Href;
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
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  const emailsMatch =
    data.confirmEmail.length > 0 && data.email === data.confirmEmail;

  return (
    <ClientRegistrationShell
      activeStep={1}
      disabled={!emailValid || !emailsMatch}
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
          control={form.control}
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
  const phone = form.watch('phone');
  const valid = onlyDigits(phone).length >= 10;

  return (
    <ClientRegistrationShell
      activeStep={2}
      disabled={!valid}
      onContinue={async () => {
        if (await form.trigger('phone')) {
          router.push(routeFor('otp'));
        }
      }}
    >
      <View className="w-full">
        <ClientRegistrationField
          autoComplete="tel"
          autoFocus
          control={form.control}
          icon={<Phone {...iconProps} />}
          keyboardType="phone-pad"
          label="Insira seu telefone"
          name="phone"
          returnKeyType="done"
          textContentType="telephoneNumber"
          transform={formatPhone}
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
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (seconds === 0) return;
    const timer = setTimeout(() => setSeconds((current) => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  return (
    <ClientRegistrationShell
      activeStep={3}
      disabled={otp.length !== 4}
      onContinue={async () => {
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
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
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
  const nameValid = data.fullName.trim().split(/\s+/).length >= 2;
  const cpfValid = onlyDigits(data.cpf).length === 11;

  return (
    <ClientRegistrationShell
      activeStep={4}
      disabled={!nameValid || !cpfValid}
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
            textContentType="name"
          />
          <ClientRegistrationField
            control={form.control}
            icon={<Contact {...iconProps} />}
            keyboardType="number-pad"
            label="CPF"
            name="cpf"
            returnKeyType="done"
            transform={formatCpf}
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
  const data = form.watch();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const hasLength = data.password.length >= 8;
  const hasSpecial = /[^A-Za-z0-9]/.test(data.password);
  const passwordsMatch =
    data.confirmPassword.length > 0 && data.password === data.confirmPassword;

  return (
    <ClientRegistrationShell
      activeStep={6}
      totalSteps={6}
      disabled={!hasLength || !hasSpecial || !passwordsMatch}
      onContinue={async () => {
        if (await form.trigger(['password', 'confirmPassword'])) {
          router.push(routeFor('success'));
        }
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
            control={form.control}
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
              Deve ter pelo menos 8 caracteres
            </PasswordRequirement>
            <PasswordRequirement checked={hasSpecial}>
              Deve conter um caractere especial
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
