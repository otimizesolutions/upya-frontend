import type { PropsWithChildren } from 'react';
import { View, type ViewProps } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { cn } from '@/lib/utils';

/** Espaço entre o teclado e o input focado. */
const DEFAULT_BOTTOM_OFFSET = 24;

export type FormScreenProps = PropsWithChildren<{
  className?: string;
  contentClassName?: string;
  edges?: Edge[];
  style?: ViewProps['style'];
  /**
   * Espaçamento extra entre o teclado e o campo em foco.
   * @default 24
   */
  bottomOffset?: number;
  /**
   * Quando `false`, desativa o ajuste automático do teclado
   * (útil para depurar ou telas especiais).
   * @default true
   */
  keyboardAware?: boolean;
}>;

/**
 * Layout padrão para telas de formulário.
 *
 * Centraliza Safe Area + scroll consciente do teclado (Android/iOS),
 * evitando que o teclado cubra o input focado.
 *
 * Preferir este componente a `<Screen scroll>` em qualquer tela com inputs.
 *
 * @example
 * ```tsx
 * <FormScreen contentClassName="px-4 py-6">
 *   <TextInput />
 * </FormScreen>
 * ```
 */
export function FormScreen({
  children,
  className,
  contentClassName,
  edges,
  style,
  bottomOffset = DEFAULT_BOTTOM_OFFSET,
  keyboardAware = true,
}: FormScreenProps) {
  return (
    <View className={cn('flex-1 bg-background', className)} style={style}>
      <SafeAreaView className="flex-1" edges={edges}>
        <KeyboardAwareScrollView
          bottomOffset={bottomOffset}
          bounces={false}
          enabled={keyboardAware}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className={cn('min-h-full grow', contentClassName)}>
            {children}
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </View>
  );
}
