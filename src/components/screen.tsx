import type { PropsWithChildren } from 'react';
import { ScrollView, View, type ViewProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { cn } from '@/lib/utils';

export type ScreenProps = PropsWithChildren<{
  className?: string;
  contentClassName?: string;
  /** Quando true, o conteúdo rola em telas menores / teclado. */
  scroll?: boolean;
  edges?: Edge[];
  style?: ViewProps['style'];
}>;

/**
 * Wrapper padrão de tela: SafeAreaView + layout flex responsivo.
 * Use `scroll` para conteúdos longos sem inputs.
 * Para formulários (TextInput), use `FormScreen` (`@/components/form-screen`).
 */
export function Screen({
  children,
  className,
  contentClassName,
  scroll = false,
  edges,
  style,
}: ScreenProps) {
  return (
    <View className={cn('flex-1 bg-background', className)} style={style}>
      <SafeAreaView className="flex-1" edges={edges}>
        {scroll ? (
          <ScrollView
            className="flex-1"
            contentContainerClassName={cn('grow', contentClassName)}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View className={cn('flex-1', contentClassName)}>{children}</View>
        )}
      </SafeAreaView>
    </View>
  );
}
