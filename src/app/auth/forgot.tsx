import { backgroundColor } from '@/domains/theme/constants/colors';
import { View, StyleSheet, Text } from 'react-native';

export default function ForgotPasswordPage() {
  return (
    <View style={styles.container}>
      <Text>A página de Esqueci a senha não foi implementada ainda.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
