import { View, StyleSheet, Text } from 'react-native';
import { backgroundColor } from '@/domains/theme/constants/colors';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Você está na área authenticada.</Text>
      <Text>Aba Início.</Text>
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
