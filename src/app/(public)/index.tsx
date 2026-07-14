import { Image, useWindowDimensions, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import logo from '@/assets/images/upya-logo.png';
import onboardGraphic from '@/assets/images/onboard-graphic.png';
import { ButtonLink } from '@/components/button-link';
import { Screen } from '@/components/screen';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

/** Proporções do frame Figma 390×844 (Onboard / 11127:203). */
const FIGMA_WIDTH = 390;
const FIGMA_HEIGHT = 844;
const LOGO_WIDTH = 171;
const LOGO_HEIGHT = 34;
/** Export 3x do Wrapper (11191:52): 1014×993. */
const GRAPHIC_ASPECT = 1014 / 993;

export default function WelcomePage() {
  const { width, height } = useWindowDimensions();
  const scale = Math.min(width / FIGMA_WIDTH, height / FIGMA_HEIGHT, 1);
  const isCompact = height < 700;

  const logoWidth = LOGO_WIDTH * scale;
  const logoHeight = LOGO_HEIGHT * scale;
  const graphicWidth = Math.min(338 * scale, width - 32);
  const graphicHeight = graphicWidth / GRAPHIC_ASPECT;

  return (
    <Screen className="bg-gray-1000" contentClassName="px-4" scroll={isCompact}>
      <StatusBar style="light" />

      {/* Logo — Figma y=72 (≈32px abaixo do status) */}
      <View className={cn('items-center', isCompact ? 'pt-4' : 'pt-8')}>
        <Image
          source={logo}
          alt="Upya"
          accessibilityLabel="Upya"
          style={{ width: logoWidth, height: logoHeight }}
          resizeMode="contain"
        />
      </View>

      {/* Ilustração — Wrapper Figma y=114 */}
      <View className="min-h-0 flex-1 items-center justify-center">
        <Image
          source={onboardGraphic}
          alt="Rede de pacientes e profissionais"
          accessibilityLabel="Rede de pacientes e profissionais"
          style={{ width: graphicWidth, height: graphicHeight }}
          resizeMode="contain"
        />
      </View>

      {/* Texto — Figma y=477, gap 8 */}
      <View className="w-full gap-2">
        <Text className="text-center font-display-semibold text-[24px] leading-[1.4] text-gray-100">
          A conexão entre pacientes e profissionais
        </Text>
        <Text className="text-center font-sans text-[14px] leading-[1.4] text-gray-500">
          A Upya aproxima pacientes e fisioterapeutas qualificados, tornando o
          acesso à saúde mais rápido, simples e seguro.
        </Text>
      </View>

      {/* Botões — Figma y=688, gap 12 (~76px após o texto) */}
      <View
        className={cn('w-full gap-3 pb-2', isCompact ? 'mt-6' : 'mt-[76px]')}
      >
        <ButtonLink href="/onboarding/client">Sou cliente</ButtonLink>
        <ButtonLink href="/onboarding/professional" variant="secondary">
          Sou profissional
        </ButtonLink>
      </View>
    </Screen>
  );
}
