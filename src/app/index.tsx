import { Dimensions, Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import image from '@/assets/images/welcome.png';
import { ButtonLink } from '@/components/button-link';
import { Link } from '@/components/link';
import { Text } from '@/components/ui/text';

export default function HomePage() {
  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-stretch justify-center">
          <Text variant="headingLg" className="mb-5 text-center">
            UPYA
          </Text>
          <Image
            className="w-full"
            style={{ height: Dimensions.get('window').height * 0.5 }}
            source={image}
            alt="preview image"
            resizeMode="contain"
          />

          <View className="px-24">
            <ButtonLink href="/auth/register" replace>
              Começar
            </ButtonLink>
            <Text variant="paragraphSm" className="mt-5 text-center">
              Já tem conta?{' '}
              <Link href="/auth/login" replace>
                Entrar
              </Link>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
