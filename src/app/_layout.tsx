import '../../global.css';

import { DefaultTheme, ThemeProvider } from 'expo-router/react-navigation';
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
import { Suspense } from 'react';
import { Toasts } from '@backpackapp-io/react-native-toast';
import 'react-native-reanimated';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/domains/auth/contexts';
import { useAuth } from '@/domains/auth/contexts';
import { AppSplashScreen } from '@/components/splash-screen';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootNavigator() {
  const { isAuthenticated, hasHydrated } = useAuth();

  if (!hasHydrated) {
    return <AppSplashScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(public)" />
      </Stack.Protected>

      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(private)" />
      </Stack.Protected>

      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

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

  if (!loaded) {
    return null;
  }

  return (
    <Suspense fallback={<AppSplashScreen />}>
      <GestureHandlerRootView
        className="flex-1"
        onLayout={() => {
          SplashScreen.hideAsync();
        }}
      >
        <Toasts />
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ThemeProvider value={DefaultTheme}>
              <RootNavigator />
              <StatusBar style="auto" />
            </ThemeProvider>
          </AuthProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </Suspense>
  );
}
