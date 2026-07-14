import { ButtonLink } from '@/components/button-link';
import { backgroundColor } from '@/domains/theme/constants/colors';
import { View, StyleSheet, Text } from 'react-native';

export default function RegisterPage() {
  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 20 }}>
        A página de Registro não foi implementada ainda.
      </Text>
      <ButtonLink href="/auth/login">Entrar</ButtonLink>
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
