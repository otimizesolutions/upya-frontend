import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

export interface FormMessageProps {
  message?: string | null;
  error?: string | null;
  className?: string;
}

export const FormMessage = ({ message, error, className }: FormMessageProps) => {
  if (!message && !error) {
    return null;
  }

  return (
    <View className={cn('items-stretch', className)}>
      <Text
        variant="paragraphXs"
        className={error ? 'text-destructive' : 'text-content-secondary'}
      >
        {error || message}
      </Text>
    </View>
  );
};
