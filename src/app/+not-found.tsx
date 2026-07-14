import { ButtonLink } from '@/components/button-link';
import { backgroundColor } from '@/domains/theme/constants/colors';
import { Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text>This screen doesn't exist.</Text>

        <ButtonLink href="/" style={{ marginTop: 20 }}>
          Go to home screen!
        </ButtonLink>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor,
  },
});
