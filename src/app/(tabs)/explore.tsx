import { View, StyleSheet, Text } from 'react-native';
import { backgroundColor } from '@/domains/theme/constants/colors';
import { Button } from '@/components/button';
import { useLogoutMutation } from '@/domains/auth/mutations';

export default function TabTwoScreen() {
  const logoutMutation = useLogoutMutation();

  return (
    <View style={styles.container}>
      <Text>Você está na área authenticada.</Text>
      <Text>Aba Explorar.</Text>

      <View style={{ width: 200 }}>
        <Button
          style={{ marginTop: 50 }}
          onPress={() => logoutMutation.mutate()}
        >
          {logoutMutation.isPending ? 'Saindo...' : 'Sair'}
        </Button>
      </View>
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
