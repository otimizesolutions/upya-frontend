import { cloneElement, isValidElement, type ReactNode, useState } from 'react';
import {
  type Control,
  type FieldPath,
  type FieldValues,
  useController,
  useFormContext,
} from 'react-hook-form';
import { Pressable, TextInput, type TextInputProps, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useMaskedInputProps, type Mask } from 'react-native-mask-input';
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
  /** Máscara do `react-native-mask-input` (ex.: telefone). */
  mask?: Mask;
  name: FieldPath<TFieldValues>;
  onToggleSecure?: () => void;
  secureVisible?: boolean;
  showErrorMessage?: boolean;
  /** Transformação simples; ignorada quando `mask` está definida. */
  transform?: (value: string) => string;
};

export function RegistrationErrorMessage({ message }: { message?: string }) {
  if (!message) return null;

  const lines = message.split('\n').filter(Boolean);
  if (lines.length === 0) return null;

  return (
    <View accessibilityLiveRegion="polite" className="w-full gap-1">
      {lines.map((line, index) => (
        <Text
          key={`${index}-${line}`}
          className="text-center font-sans text-[16px] leading-[1.4] tracking-[-0.32px] text-red-500"
        >
          {line}
        </Text>
      ))}
    </View>
  );
}

export function ClientRegistrationField<TFieldValues extends FieldValues>({
  control,
  forceError = false,
  icon,
  label,
  mask,
  name,
  onFocus,
  onToggleSecure,
  secureVisible,
  showErrorMessage = true,
  transform,
  ...props
}: ClientRegistrationFieldProps<TFieldValues>) {
  const [focused, setFocused] = useState(false);
  const { clearErrors } = useFormContext<TFieldValues>();
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

  const handleChangeText = (nextValue: string) => {
    if (error) clearErrors(name);
    field.onChange(nextValue);
  };

  const maskedInputProps = useMaskedInputProps({
    value,
    mask,
    onChangeText: (masked) => handleChangeText(masked),
  });

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
            ref={field.ref}
            {...(mask
              ? maskedInputProps
              : {
                  value,
                  onChangeText: (nextValue: string) =>
                    handleChangeText(
                      transform ? transform(nextValue) : nextValue,
                    ),
                })}
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
      {showErrorMessage && !!error?.message && (
        <View className="pt-4">
          <RegistrationErrorMessage message={error.message} />
        </View>
      )}
    </View>
  );
}
