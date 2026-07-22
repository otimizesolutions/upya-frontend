import { cloneElement, isValidElement, type ReactNode, useState } from 'react';
import {
  type Control,
  type FieldPath,
  type FieldValues,
  useController,
} from 'react-hook-form';
import { Pressable, TextInput, type TextInputProps, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type ClientRegistrationFieldProps<TFieldValues extends FieldValues> = Omit<
  TextInputProps,
  'placeholderTextColor' | 'value' | 'onChangeText' | 'onBlur'
> & {
  control: Control<TFieldValues>;
  /** Destaca o campo em erro mesmo sem `fieldState.error` (ex.: grupo e-mail). */
  forceError?: boolean;
  icon?: ReactNode;
  label: string;
  name: FieldPath<TFieldValues>;
  onToggleSecure?: () => void;
  secureVisible?: boolean;
  showErrorMessage?: boolean;
  transform?: (value: string) => string;
};

export function RegistrationErrorMessage({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <Text
      accessibilityLiveRegion="polite"
      className="text-center font-sans text-[16px] leading-[1.4] tracking-[-0.32px] text-red-500"
    >
      {message}
    </Text>
  );
}

export function ClientRegistrationField<TFieldValues extends FieldValues>({
  control,
  forceError = false,
  icon,
  label,
  name,
  onFocus,
  onToggleSecure,
  secureVisible,
  showErrorMessage = true,
  transform,
  ...props
}: ClientRegistrationFieldProps<TFieldValues>) {
  const [focused, setFocused] = useState(false);
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });
  const value = String(field.value ?? '');
  const hasValue = value.length > 0;
  const hasError = !!error || forceError;
  const renderedIcon =
    hasError && isValidElement<{ color?: string }>(icon)
      ? cloneElement(icon, { color: '#ed5562' })
      : icon;

  return (
    <View className="w-full">
      <View
        className={cn(
          'h-14 w-full flex-row items-center gap-3 rounded-full border bg-gray-900 px-4',
          focused && !hasValue && !hasError ? 'border-neon' : 'border-gray-800',
          hasError && 'border-red-500',
        )}
      >
        {renderedIcon ?? null}
        <View className="min-w-0 flex-1 justify-center">
          {hasValue && (
            <Text className="font-sans text-[12px] leading-[1.7] text-gray-600">
              {label}
            </Text>
          )}
          <TextInput
            {...props}
            value={value}
            className="min-w-0 flex-1 p-0 font-sans text-[16px] leading-[1.4] text-gray-100"
            placeholder={hasValue ? undefined : label}
            placeholderTextColor="#868b91"
            onFocus={(event) => {
              setFocused(true);
              onFocus?.(event);
            }}
            onBlur={() => {
              setFocused(false);
              field.onBlur();
            }}
            onChangeText={(nextValue) =>
              field.onChange(transform ? transform(nextValue) : nextValue)
            }
          />
        </View>
        {onToggleSecure && (
          <Pressable
            accessibilityLabel={
              secureVisible ? 'Ocultar senha' : 'Mostrar senha'
            }
            accessibilityRole="button"
            hitSlop={10}
            onPress={onToggleSecure}
          >
            {secureVisible ? (
              <Eye color="#868b91" size={20} strokeWidth={1.75} />
            ) : (
              <EyeOff color="#868b91" size={20} strokeWidth={1.75} />
            )}
          </Pressable>
        )}
      </View>
      {showErrorMessage && !!error && (
        <View className="pt-4">
          <RegistrationErrorMessage message={error?.message} />
        </View>
      )}
    </View>
  );
}
