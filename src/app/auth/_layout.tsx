import { useAuth } from '@/domains/auth/contexts';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1">
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="forgot" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaView>
    </View>
  );
}
