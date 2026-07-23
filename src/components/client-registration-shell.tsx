import type { PropsWithChildren } from 'react';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { FormScreen } from '@/components/form-screen';
import { Text } from '@/components/ui/text';

type ClientRegistrationShellProps = PropsWithChildren<{
  activeStep: number;
  buttonLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  onContinue: () => void;
  totalSteps?: number;
}>;

export function ClientRegistrationShell({
  activeStep,
  buttonLabel = 'Continuar',
  children,
  disabled,
  loading = false,
  onContinue,
  totalSteps = 5,
}: ClientRegistrationShellProps) {
  const router = useRouter();
  const isDisabled = disabled || loading;

  return (
    <FormScreen
      className="bg-gray-1000"
      contentClassName="px-4"
      edges={['top', 'bottom']}
    >
      <StatusBar style="light" />
      <View className="w-full max-w-[430px] flex-1 self-center pt-4">
        <View className="gap-6">
          <View className="h-[34px] flex-row items-center gap-4">
            <Pressable
              accessibilityLabel="Voltar"
              accessibilityRole="button"
              className="h-5 w-5 items-center justify-center"
              hitSlop={12}
              onPress={() => router.back()}
            >
              <ChevronLeft color="#9ca1a7" size={20} strokeWidth={1.75} />
            </Pressable>
            <Text className="font-display-semibold text-[24px] leading-[1.4] text-gray-100">
              Cadastro
            </Text>
          </View>

          <View className="h-1.5 w-full flex-row gap-2">
            {Array.from({ length: totalSteps }, (_, index) => (
              <View
                key={index}
                className={
                  index < activeStep
                    ? 'h-1.5 flex-1 rounded-full bg-neon'
                    : 'h-1.5 flex-1 rounded-full bg-gray-900'
                }
              />
            ))}
          </View>
        </View>

        <View className="h-[324px] w-full items-center justify-center">
          {children}
        </View>

        <View className="-mt-4 w-full p-4">
          <Button
            disabled={isDisabled}
            onPress={onContinue}
            className={isDisabled ? 'bg-neon-200' : undefined}
            textClassName={isDisabled ? 'text-gray-700' : undefined}
          >
            {loading ? 'Enviando...' : buttonLabel}
          </Button>
        </View>
      </View>
    </FormScreen>
  );
}
