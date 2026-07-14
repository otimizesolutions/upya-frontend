import { useAuth } from '@/domains/auth/contexts';
import { backgroundColor } from '@/domains/theme/constants/colors';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import 'react-native-reanimated';

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    router.replace('/(tabs)');
  }, [router, isAuthenticated]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="forgot" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor,
  },
});
