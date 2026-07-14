import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

export type LoginRole = 'client' | 'professional';

type LoginRoleToggleProps = {
  value: LoginRole;
  onChange: (role: LoginRole) => void;
  className?: string;
};

/** Toggle Cliente / Profissional — Figma Toogle (11203:418 / 11203:419). */
export function LoginRoleToggle({
  value,
  onChange,
  className,
}: LoginRoleToggleProps) {
  return (
    <View
      className={cn(
        'h-12 w-full flex-row items-center gap-2 rounded-full bg-gray-800',
        className,
      )}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: value === 'client' }}
        onPress={() => onChange('client')}
        className={cn(
          'h-full flex-1 items-center justify-center rounded-full px-1 py-2',
          value === 'client' ? 'bg-neon-200' : 'bg-gray-800',
        )}
      >
        <Text
          className={cn(
            'text-center font-display-semibold text-[16px] leading-[1.4]',
            value === 'client' ? 'text-gray-1000' : 'text-gray-100',
          )}
        >
          Cliente
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: value === 'professional' }}
        onPress={() => onChange('professional')}
        className={cn(
          'h-full flex-1 items-center justify-center rounded-full px-1 py-2',
          value === 'professional' ? 'bg-neon-200' : 'bg-gray-800',
        )}
      >
        <Text
          className={cn(
            'text-center font-display-semibold text-[16px] leading-[1.4]',
            value === 'professional' ? 'text-gray-1000' : 'text-gray-100',
          )}
        >
          Profissional
        </Text>
      </Pressable>
    </View>
  );
}
