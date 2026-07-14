import '../../global.css';

import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Suspense, useEffect } from 'react';
import { Toasts } from '@backpackapp-io/react-native-toast';
import 'react-native-reanimated';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/domains/auth/contexts';
import { Text } from '@/components/ui/text';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    'ClashDisplay-Regular': require('../assets/fonts/ClashDisplay-Regular.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    'ClashDisplay-Semibold': require('../assets/fonts/ClashDisplay-Semibold.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    'ClashDisplay-Bold': require('../assets/fonts/ClashDisplay-Bold.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    'Panchang-Regular': require('../assets/fonts/Panchang-Regular.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    'Panchang-Semibold': require('../assets/fonts/Panchang-Semibold.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    'Panchang-Bold': require('../assets/fonts/Panchang-Bold.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Suspense
      fallback={
        <>
          <Text>Absolute Loading...</Text>
        </>
      }
    >
      <GestureHandlerRootView className="flex-1">
        <Toasts />
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ThemeProvider value={DefaultTheme}>
              <Stack
                initialRouteName="index"
                screenOptions={{ headerShown: false }}
              >
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="auth" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </AuthProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </Suspense>
  );
}
