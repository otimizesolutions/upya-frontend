import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { House, Send } from 'lucide-react-native';

import { useAuth } from '@/domains/auth/contexts';
import { primary } from '@/domains/theme/constants/colors';
import { StatusBar } from 'expo-status-bar';

export default function TabLayout() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }
    router.replace('/auth/login');
  }, [router, isAuthenticated]);

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1">
        <StatusBar style="dark" />
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: primary,
            headerShown: false,
            tabBarStyle: Platform.select({
              ios: {
                position: 'absolute',
              },
              default: {},
            }),
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <House size={28} color={color} />,
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: 'Explore',
              tabBarIcon: ({ color }) => <Send size={28} color={color} />,
            }}
          />
        </Tabs>
      </SafeAreaView>
    </View>
  );
}
