import { View } from 'react-native';
import { Text } from '@/components/ui/text';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text variant="headingSm">Você está na área autenticada.</Text>
      <Text variant="paragraphMd" className="mt-2 text-content-secondary">
        Aba Início.
      </Text>
    </View>
  );
}
