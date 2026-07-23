import { Image, useWindowDimensions, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import logo from '@/assets/images/upya-logo.png';
import professionalCards from '@/assets/images/onboarding/professional-cards.png';
import { ButtonBack } from '@/components/button-back';
import { ButtonLink } from '@/components/button-link';
import { Screen } from '@/components/screen';
import { Text } from '@/components/ui/text';

/** Frame Figma 390×844 — Onboard cliente (11132:333). */
const FIGMA_WIDTH = 390;
const FIGMA_CONTENT_HEIGHT = 770;
const LOGO_WIDTH = 171;
const LOGO_HEIGHT = 34;
/** Export 2x do stack de cards (11132:370): 752×556. */
const CARDS_ASPECT = 752 / 556;
/** Largura máxima do conteúdo em tablets / telas largas. */
const CONTENT_MAX_WIDTH = 430;

export default function ClientOnboardingPage() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const usableHeight = height - insets.top - insets.bottom;

  const scale = Math.min(width / FIGMA_WIDTH, 1);
  const isCompact = usableHeight < FIGMA_CONTENT_HEIGHT || width > height;

  const logoWidth = LOGO_WIDTH * scale;
  const logoHeight = LOGO_HEIGHT * scale;
  const cardsWidth = Math.min(358 * scale, width - 32, CONTENT_MAX_WIDTH);
  const cardsHeight = cardsWidth / CARDS_ASPECT;

  const titleSize = Math.round(32 * Math.max(scale, 0.88));
  const bodySize = Math.round(16 * Math.max(scale, 0.9));
  const compactMinHeight = FIGMA_CONTENT_HEIGHT * Math.max(scale, 0.9);

  return (
    <Screen className="bg-gray-1000" contentClassName="px-4" scroll={isCompact}>
      <StatusBar style="light" />

      <View
        className="w-full flex-1 self-center"
        style={{
          maxWidth: CONTENT_MAX_WIDTH,
          minHeight: isCompact ? compactMinHeight : undefined,
        }}
      >
        <View className="items-center" style={{ paddingTop: 20 * scale }}>
          <Image
            source={logo}
            alt="Upya"
            accessibilityLabel="Upya"
            style={{ width: logoWidth, height: logoHeight }}
            resizeMode="contain"
          />
        </View>

        <View className="items-center" style={{ marginTop: 53 * scale }}>
          <Image
            source={professionalCards}
            alt="Profissionais Upya"
            accessibilityLabel="Profissionais Upya"
            style={{ width: cardsWidth, height: cardsHeight }}
            resizeMode="contain"
          />
        </View>

        <View className="mt-auto w-full gap-8 pb-1.5 pt-8">
          <View className="w-full gap-4">
            <Text
              className="text-center font-display leading-[1.4] tracking-[0.64px] text-gray-100"
              style={{ fontSize: titleSize }}
            >
              Sua recuperação começa aqui!
            </Text>
            <Text
              className="text-center font-sans leading-[1.4] tracking-[-0.32px] text-gray-500"
              style={{ fontSize: bodySize }}
            >
              Conecte-se a profissionais qualificados para cuidar da sua saúde
              com segurança, praticidade e atendimento personalizado.
            </Text>
          </View>

          <View className="w-full gap-4">
            <ButtonLink
              href={{ pathname: '/login', params: { role: 'client' } }}
            >
              Continuar
            </ButtonLink>
            <ButtonBack>Voltar</ButtonBack>
          </View>
        </View>
      </View>
    </Screen>
  );
}
