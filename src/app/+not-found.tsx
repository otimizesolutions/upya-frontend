import { ButtonLink } from '@/components/button-link';
import { Text } from '@/components/ui/text';
import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center bg-background p-5">
        <Text variant="paragraphMd">This screen doesn&apos;t exist.</Text>

        <ButtonLink href="/" className="mt-5">
          Go to home screen!
        </ButtonLink>
      </View>
    </>
  );
}
