import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { House, Send } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { primary } from '@/domains/theme/constants/colors';

export default function PrivateTabsLayout() {
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
            name="home"
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
