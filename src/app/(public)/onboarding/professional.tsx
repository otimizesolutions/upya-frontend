import { Image, useWindowDimensions, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
/** Largura máxima do conteúdo em tablets / telas largas. */
const CONTENT_MAX_WIDTH = 430;

export default function ProfessionalOnboardingPage() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const usableHeight = height - insets.top - insets.bottom;

  const scale = Math.min(width / FIGMA_WIDTH, usableHeight / FIGMA_HEIGHT, 1);
  const isCompact = usableHeight < 700;
  const isVeryCompact = usableHeight < 600;

  const logoWidth = LOGO_WIDTH * scale;
  const logoHeight = LOGO_HEIGHT * scale;

  /** Espaço reservado para logo + texto + botões + gaps. */
  const reservedVertical =
    logoHeight + (isVeryCompact ? 220 : isCompact ? 250 : 280);
  const cardsMaxByHeight = Math.max(
    usableHeight - reservedVertical,
    usableHeight * 0.28,
  );
  const cardsMaxByWidth = Math.min(376 * scale, width - 32, CONTENT_MAX_WIDTH);
  const cardsWidth = Math.min(cardsMaxByWidth, cardsMaxByHeight * CARDS_ASPECT);
  const cardsHeight = cardsWidth / CARDS_ASPECT;

  const titleSize = Math.round(24 * Math.max(scale, 0.88));
  const bodySize = Math.round(16 * Math.max(scale, 0.88));

  return (
    <Screen className="bg-gray-1000" contentClassName="px-4" scroll={isCompact}>
      <StatusBar style="light" />

      <View
        className={cn(
          'w-full flex-1 self-center',
          isCompact ? 'min-h-full justify-between' : 'justify-between',
        )}
        style={{ maxWidth: CONTENT_MAX_WIDTH }}
      >
        {/* Logo — Figma y≈47 */}
        <View
          className={cn(
            'items-center',
            isVeryCompact ? 'pt-1' : isCompact ? 'pt-2' : 'pt-1.5',
          )}
        >
          <Image
            source={logo}
            alt="Upya"
            accessibilityLabel="Upya"
            style={{ width: logoWidth, height: logoHeight }}
            resizeMode="contain"
          />
        </View>

        {/* Cards — Figma y=151, largura ~376 */}
        <View className="min-h-0 flex-1 items-center justify-center py-2">
          <Image
            source={professionalCards}
            alt="Profissionais Upya"
            accessibilityLabel="Profissionais Upya"
            style={{ width: cardsWidth, height: cardsHeight }}
            resizeMode="contain"
          />
        </View>

        {/* Texto + botões — Figma y=512, gap 24 entre blocos */}
        <View
          className={cn('w-full', isVeryCompact ? 'gap-4 pb-1' : 'gap-6 pb-2')}
        >
          <View className="w-full gap-2">
            <Text
              className="text-center font-display-semibold leading-[1.4] text-gray-100"
              style={{ fontSize: titleSize }}
            >
              Sua recuperação começa aqui!
            </Text>
            <Text
              className="text-center font-sans leading-[1.4] text-gray-400"
              style={{ fontSize: bodySize }}
            >
              Conecte-se a profissionais qualificados para cuidar da sua saúde
              com segurança, praticidade e atendimento personalizado.
            </Text>
          </View>

          <View className="w-full gap-3">
            <ButtonLink href="/register">Avançar</ButtonLink>
            <ButtonBack>Voltar</ButtonBack>
          </View>
        </View>
      </View>
    </Screen>
  );
}
