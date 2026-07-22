import { useRef, useState } from 'react';
import { Pressable, TextInput, useWindowDimensions, View } from 'react-native';
import { Text } from '@/components/ui/text';

type ClientRegistrationOtpProps = {
  onChange: (value: string) => void;
  value: string;
};

export function ClientRegistrationOtp({
  onChange,
  value,
}: ClientRegistrationOtpProps) {
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  const { width } = useWindowDimensions();
  const digitSize = Math.min(72, (width - 56) / 4);

  return (
    <Pressable
      accessibilityLabel="Código de verificação com quatro dígitos"
      accessibilityRole="button"
      onPress={() => inputRef.current?.focus()}
    >
      <View className="flex-row gap-2">
        {Array.from({ length: 4 }, (_, index) => {
          const digit = value[index];
          const activeIndex = Math.min(value.length, 3);
          const isActive = focused && value.length < 4 && index === activeIndex;

          return (
            <View
              key={index}
              className={
                isActive
                  ? 'items-center justify-center rounded-full border border-neon bg-gray-900'
                  : 'items-center justify-center rounded-full border border-gray-800 bg-gray-900'
              }
              style={{ width: digitSize, height: digitSize }}
            >
              <Text
                className={
                  digit
                    ? 'font-sans-medium text-[36px] leading-[1.4] text-gray-100'
                    : 'font-sans-medium text-[36px] leading-[1.4] text-gray-800'
                }
              >
                {digit ?? '0'}
              </Text>
            </View>
          );
        })}
      </View>
      <TextInput
        ref={inputRef}
        autoFocus
        keyboardType="number-pad"
        maxLength={4}
        value={value}
        onBlur={() => setFocused(false)}
        onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, 4))}
        onFocus={() => setFocused(true)}
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
      />
    </Pressable>
  );
}
