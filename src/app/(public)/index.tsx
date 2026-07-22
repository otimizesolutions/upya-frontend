import { Image, Pressable, useWindowDimensions, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link, type Href } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import logo from '@/assets/images/upya-logo.png';
import onboardGraphic from '@/assets/images/onboard-graphic.png';
import { Screen } from '@/components/screen';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

/** Proporções do frame Figma 390×844 (Início / 11364:12396). */
const FIGMA_WIDTH = 390;
const FIGMA_CONTENT_HEIGHT = 770;
const LOGO_WIDTH = 171;
const LOGO_HEIGHT = 36;
const CONTENT_MAX_WIDTH = 430;
const GRAPHIC_WIDTH = 290;
/** Export do Wrapper da ilustração: 1014×993. */
const GRAPHIC_ASPECT = 1014 / 993;

type RoleCardProps = {
  description: string;
  href: Href;
  title: string;
};

function RoleCard({ description, href, title }: RoleCardProps) {
  return (
    <Link href={href} asChild>
      <Pressable
        accessibilityHint={`Continuar como ${title.toLowerCase()}`}
        accessibilityRole="button"
        className="min-h-[106px] w-full flex-row items-center gap-2 rounded-[16px] bg-gray-900 p-4 active:bg-gray-800"
      >
        <View className="min-w-0 flex-1 gap-2">
          <Text className="font-display-regular text-[18px] leading-[1.4] text-gray-100">
            {title}
          </Text>
          <Text className="font-sans text-[14px] leading-[1.4] text-gray-500">
            {description}
          </Text>
        </View>
        <View className="h-8 w-8 shrink-0 items-center justify-center">
          <ChevronRight color="#e8ff00" size={32} strokeWidth={2.5} />
        </View>
      </Pressable>
    </Link>
  );
}

export default function WelcomePage() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const usableHeight = height - insets.top - insets.bottom;
  const scale = Math.min(
    width / FIGMA_WIDTH,
    usableHeight / FIGMA_CONTENT_HEIGHT,
    1,
  );
  const isCompact = usableHeight < 740 || width > height;

  const logoWidth = LOGO_WIDTH * scale;
  const logoHeight = LOGO_HEIGHT * scale;
  const graphicWidth = Math.min(GRAPHIC_WIDTH * scale, width - 32);
  const graphicHeight = graphicWidth / GRAPHIC_ASPECT;
  const titleSize = Math.round(28 * Math.max(scale, 0.86));

  return (
    <Screen className="bg-gray-1000" contentClassName="px-4" scroll={isCompact}>
      <StatusBar style="light" />

      <View
        className={cn(
          'w-full flex-1 self-center',
          isCompact && 'min-h-[700px]',
        )}
        style={{ maxWidth: CONTENT_MAX_WIDTH }}
      >
        <View className={cn('items-center', isCompact ? 'pt-2' : 'pt-[14px]')}>
          <Image
            source={logo}
            alt="Upya"
            accessibilityLabel="Upya"
            style={{ width: logoWidth, height: logoHeight }}
            resizeMode="contain"
          />
        </View>

        <View className={cn('items-center', isCompact ? 'mt-3' : 'mt-[18px]')}>
          <Image
            source={onboardGraphic}
            alt="Rede de pacientes e profissionais"
            accessibilityLabel="Rede de pacientes e profissionais"
            style={{ width: graphicWidth, height: graphicHeight }}
            resizeMode="contain"
          />
        </View>

        <View className={cn('w-full gap-2', isCompact ? 'mt-3' : 'mt-[14px]')}>
          <Text
            className="text-center font-display-semibold leading-[1.4] tracking-[0.56px] text-gray-100"
            style={{ fontSize: titleSize }}
          >
            Conexão entre Pacientes e Profissionais
          </Text>
          <Text className="text-center font-sans text-[14px] leading-[1.4] text-gray-500">
            A Upya aproxima pacientes e fisioterapeutas qualificados, tornando o
            acesso à saúde mais rápido, simples e seguro.
          </Text>
        </View>

        <View className="mt-auto w-full gap-3 pb-1 pt-7">
          <RoleCard
            href="/onboarding/client"
            title="Cliente"
            description="Agendar sessões e acompanhar meu tratamento."
          />
          <RoleCard
            href="/onboarding/professional"
            title="Profissional"
            description="Gerenciar pacientes, agenda e atendimentos."
          />
        </View>
      </View>
    </Screen>
  );
}
