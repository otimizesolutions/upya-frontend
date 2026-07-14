import '../../global.css';

import { ThemeProvider, type Theme } from 'expo-router/react-navigation';
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
import { AuthProvider, useAuth } from '@/domains/auth/contexts';
import { AppSplashScreen } from '@/components/splash-screen';
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
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700',
    },
    heavy: {
      fontFamily: 'System',
      fontWeight: '800',
    },
  },
};

function RootNavigator() {
  const { isAuthenticated, hasHydrated } = useAuth();

  if (!hasHydrated) {
    return <AppSplashScreen />;
  }

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
        className="flex-1 bg-background"
        style={{ backgroundColor }}
        onLayout={() => {
          SplashScreen.hideAsync();
        }}
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
    </Suspense>
  );
}
