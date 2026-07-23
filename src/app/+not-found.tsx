import { ButtonLink } from '@/components/button-link';
import { Screen } from '@/components/screen';
import { Text } from '@/components/ui/text';
import { Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Screen contentClassName="items-center justify-center p-5">
        <Text variant="paragraphMd">This screen doesn&apos;t exist.</Text>

        <ButtonLink href="/" className="mt-5">
          Go to home screen!
        </ButtonLink>
      </Screen>
    </>
  );
}
