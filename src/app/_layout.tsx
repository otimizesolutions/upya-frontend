import '../../global.css';

import { useEffect } from 'react';
import { ThemeProvider, type Theme } from 'expo-router/react-navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useFonts,
  // Nomes oficiais do pacote @expo-google-fonts/inter
  // eslint-disable-next-line camelcase
  Inter_400Regular,
  // eslint-disable-next-line camelcase
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Toasts } from '@backpackapp-io/react-native-toast';
import 'react-native-reanimated';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/domains/auth/contexts';
import { useAuthStore } from '@/domains/auth/stores';
import { backgroundColor } from '@/domains/theme/constants/colors';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const AppTheme: Theme = {
  dark: true,
  colors: {
    primary: '#e8ff00',
    background: backgroundColor,
    card: backgroundColor,
    text: '#ffffff',
    border: '#1e1e1e',
    notification: '#e8ff00',
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    bold: { fontFamily: 'System', fontWeight: '700' },
    heavy: { fontFamily: 'System', fontWeight: '800' },
  },
};

function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor },
      }}
    >
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
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const setHasHydrated = useAuthStore((state) => state.setHasHydrated);

  // Só as fontes usadas no primeiro paint (welcome / onboarding / botões).
  /* eslint-disable camelcase */
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    'ClashDisplay-Semibold': require('../assets/fonts/ClashDisplay-Semibold.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    'ClashDisplay-Bold': require('../assets/fonts/ClashDisplay-Bold.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    'Panchang-Regular': require('../assets/fonts/Panchang-Regular.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    'Panchang-Bold': require('../assets/fonts/Panchang-Bold.ttf'),
  });
  /* eslint-enable camelcase */
  const fontsReady = fontsLoaded || !!fontError;

  // Fallback: não prender a splash se a hidratação do AsyncStorage atrasar.
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!useAuthStore.getState().hasHydrated) {
        setHasHydrated(true);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [setHasHydrated]);

  // Uma única splash nativa até fonts + auth estarem prontos.
  useEffect(() => {
    if (fontsReady && hasHydrated) {
      SplashScreen.hideAsync();
    }
  }, [fontsReady, hasHydrated]);

  if (!fontsReady || !hasHydrated) {
    return null;
  }

  return (
    <GestureHandlerRootView
      className="flex-1 bg-background"
      style={{ flex: 1, backgroundColor }}
    >
      <Toasts />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider value={AppTheme}>
            <RootNavigator />
            <StatusBar style="light" />
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
