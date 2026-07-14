import { Image, useWindowDimensions, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import logo from '@/assets/images/upya-logo.png';
import professionalCards from '@/assets/images/onboarding/professional-cards.png';
import { ButtonBack } from '@/components/button-back';
import { ButtonLink } from '@/components/button-link';
import { Screen } from '@/components/screen';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

/** Frame Figma 390×844 — Onboard profissional (11132:333). */
const FIGMA_WIDTH = 390;
const FIGMA_HEIGHT = 844;
const LOGO_WIDTH = 171;
const LOGO_HEIGHT = 34;
/** Export 2x do stack de cards (11132:370): 752×556. */
const CARDS_ASPECT = 752 / 556;

export default function ProfessionalOnboardingPage() {
  const { width, height } = useWindowDimensions();
  const scale = Math.min(width / FIGMA_WIDTH, height / FIGMA_HEIGHT, 1);
  const isCompact = height < 700;

  const logoWidth = LOGO_WIDTH * scale;
  const logoHeight = LOGO_HEIGHT * scale;
  const cardsWidth = Math.min(376 * scale, width - 16);
  const cardsHeight = cardsWidth / CARDS_ASPECT;

  return (
    <Screen className="bg-gray-1000" contentClassName="px-4" scroll={isCompact}>
      <StatusBar style="light" />

      {/* Logo — Figma y≈47 */}
      <View className={cn('items-center', isCompact ? 'pt-2' : 'pt-1.5')}>
        <Image
          source={logo}
          alt="Upya"
          accessibilityLabel="Upya"
          style={{ width: logoWidth, height: logoHeight }}
          resizeMode="contain"
        />
      </View>

      {/* Cards — Figma y=151, largura ~376 */}
      <View className="min-h-0 flex-1 items-center justify-center">
        <Image
          source={professionalCards}
          alt="Profissionais Upya"
          accessibilityLabel="Profissionais Upya"
          style={{ width: cardsWidth, height: cardsHeight }}
          resizeMode="contain"
        />
      </View>

      {/* Texto + botões — Figma y=512, gap 24 entre blocos */}
      <View className="w-full gap-6 pb-2">
        <View className="w-full gap-2">
          <Text className="text-center font-display-semibold text-[24px] leading-[1.4] text-gray-100">
            Sua recuperação começa aqui!
          </Text>
          <Text className="text-center font-sans text-[16px] leading-[1.4] text-gray-400">
            Conecte-se a profissionais qualificados para cuidar da sua saúde com
            segurança, praticidade e atendimento personalizado.
          </Text>
        </View>

        <View className="w-full gap-3">
          <ButtonLink href="/register">Avançar</ButtonLink>
          <ButtonBack>Voltar</ButtonBack>
        </View>
      </View>
    </Screen>
  );
}
