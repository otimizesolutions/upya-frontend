import { type ReactNode, useState } from 'react';
import { type Control, useController } from 'react-hook-form';
import { Pressable, TextInput, type TextInputProps, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import type { ClientRegistrationData } from '@/domains/client-registration/context';
import { cn } from '@/lib/utils';

type ClientRegistrationFieldProps = Omit<
  TextInputProps,
  'placeholderTextColor' | 'value' | 'onChangeText' | 'onBlur'
> & {
  control: Control<ClientRegistrationData>;
  icon: ReactNode;
  label: string;
  name: keyof ClientRegistrationData;
  onToggleSecure?: () => void;
  secureVisible?: boolean;
  transform?: (value: string) => string;
};

export function ClientRegistrationField({
  control,
  icon,
  label,
  name,
  onFocus,
  onToggleSecure,
  secureVisible,
  transform,
  ...props
}: ClientRegistrationFieldProps) {
  const [focused, setFocused] = useState(false);
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });
  const value = field.value;
  const hasValue = value.length > 0;

  return (
    <View className="w-full">
      <View
        className={cn(
          'h-14 w-full flex-row items-center gap-3 rounded-full border bg-gray-900 px-4',
          focused && !hasValue ? 'border-neon' : 'border-gray-800',
          error && 'border-red-500',
        )}
      >
        {icon}
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
      {!!error && (
        <Text className="px-4 pt-1 font-sans text-[12px] text-red-500">
          {error.message}
        </Text>
      )}
    </View>
  );
}
