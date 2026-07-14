import { useTheme } from '@/domains/theme/contexts';
import { View, Text, StyleSheet } from 'react-native';

export interface FormMessageProps {
  message?: string | null;
  error?: string | null;
}

export const FormMessage = ({ message, error }: FormMessageProps) => {
  const { formMessage } = useTheme();

  if (!message && !error) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: error ? formMessage.errorColor : formMessage.color,
          fontSize: formMessage.fontSize,
          fontFamily: formMessage.fontFamily,
          fontWeight: formMessage.fontWeight,
        }}
      >
        {error || message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
  },
});
