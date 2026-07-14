import { Image, useWindowDimensions, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import logo from '@/assets/images/upya-logo.png';
import avatarJonathas from '@/assets/images/onboarding/avatar-jonathas.jpg';
import avatarPriscilla from '@/assets/images/onboarding/avatar-priscilla.jpg';
import { ButtonBack } from '@/components/button-back';
import { ButtonLink } from '@/components/button-link';
import { Screen } from '@/components/screen';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

/** Frame Figma 390×844 — Onboard profissional (11122:15). */
const FIGMA_WIDTH = 390;
const FIGMA_HEIGHT = 844;
const LOGO_WIDTH = 171;
const LOGO_HEIGHT = 34;
/** Agenda (11140:102). */
const SCHEDULE_W = 355.55;
const SCHEDULE_H = 268;
const CONTENT_MAX_WIDTH = 430;

const DAYS = [
  { weekday: 'Ter', day: '21', selected: false },
  { weekday: 'Qua', day: '22', selected: true },
  { weekday: 'Qui', day: '23', selected: false },
  { weekday: 'Qui', day: '23', selected: false },
] as const;

const APPOINTMENTS = [
  {
    name: 'Jonathas Alencar',
    specialty: 'Fortalecimento e mobilidade',
    time: '09:00 - 10:00',
    avatar: avatarJonathas,
  },
  {
    name: 'Priscilla Alencar',
    specialty: 'Alivio de dores',
    time: '09:00 - 10:00',
    avatar: avatarPriscilla,
  },
] as const;

const TIME_LABELS = ['08:00', '09:00', '10:00', '10:00'] as const;

/** Escala uniforme das medidas do Figma — texto nativo (sem bitmap). */
function SchedulePreview({ s }: { s: number }) {
  const dayW = 60 * s;
  const dayH = 64 * s;
  const navSize = 40 * s;
  const iconSize = 24 * s;
  const avatarSize = 45.88 * s;
  const cardRadius = 7.34 * s;

  return (
    <View style={{ width: SCHEDULE_W * s, gap: 26 * s }}>
      {/* Dias — Figma 11132:405 */}
      <View className="w-full flex-row items-center justify-between">
        <View
          className="shrink-0 items-center justify-center rounded-full bg-gray-800"
          style={{ width: navSize, height: navSize }}
        >
          <ChevronLeft color="#ffffff" size={iconSize} strokeWidth={2} />
        </View>

        {DAYS.map((item, index) => (
          <View
            key={`${item.weekday}-${item.day}-${index}`}
            className={cn(
              'shrink-0 items-center justify-center border bg-gray-1000',
              item.selected ? 'border-neon' : 'border-gray-100',
            )}
            style={{
              width: dayW,
              height: dayH,
              borderRadius: 8 * s,
              paddingVertical: 8 * s,
            }}
          >
            <Text
              className={cn(
                'text-center font-display-semibold leading-[1.4]',
                item.selected ? 'text-neon' : 'text-gray-100',
              )}
              style={{ fontSize: 20 * s }}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              allowFontScaling={false}
            >
              {item.weekday}
            </Text>
            <Text
              className={cn(
                'text-center font-display-semibold leading-[1.4]',
                item.selected ? 'text-neon' : 'text-gray-100',
              )}
              style={{ fontSize: 24 * s }}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              allowFontScaling={false}
            >
              {item.day}
            </Text>
          </View>
        ))}

        <View
          className="shrink-0 items-center justify-center rounded-full bg-gray-800"
          style={{ width: navSize, height: navSize }}
        >
          <ChevronRight color="#ffffff" size={iconSize} strokeWidth={2} />
        </View>
      </View>

      {/* Timeline + cards — Figma 11140:101 */}
      <View className="w-full flex-row items-end justify-between">
        <View
          className="shrink-0 justify-center"
          style={{ height: 178 * s, paddingRight: 8 * s }}
        >
          <View style={{ gap: 36 * s }}>
            {TIME_LABELS.map((label, index) => (
              <Text
                key={`${label}-${index}`}
                className="font-sans text-gray-100"
                style={{ fontSize: 12 * s }}
                numberOfLines={1}
                allowFontScaling={false}
              >
                {label}
              </Text>
            ))}
          </View>
        </View>

        <View className="min-w-0 flex-1" style={{ gap: 52 * s }}>
          {APPOINTMENTS.map((appointment) => (
            <View
              key={appointment.name}
              className="w-full flex-row items-center border border-gray-700 bg-gray-900"
              style={{
                gap: 7.34 * s,
                paddingLeft: 8 * s,
                paddingRight: 7.34 * s,
                paddingVertical: 7.34 * s,
                borderRadius: cardRadius,
                borderWidth: Math.max(0.5, 0.92 * s),
              }}
            >
              <View
                className="min-w-0 flex-1 flex-row items-center"
                style={{ gap: 9.18 * s }}
              >
                <Image
                  source={appointment.avatar}
                  alt={appointment.name}
                  accessibilityLabel={appointment.name}
                  style={{
                    width: avatarSize,
                    height: avatarSize,
                    borderRadius: 3.67 * s,
                  }}
                  resizeMode="cover"
                />
                <View
                  className="min-w-0 flex-1 justify-center"
                  style={{ gap: 5.5 * s }}
                >
                  <Text
                    className="font-display-semibold leading-[1.4] text-gray-100"
                    style={{ fontSize: 14.68 * s }}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}
                    allowFontScaling={false}
                  >
                    {appointment.name}
                  </Text>
                  <Text
                    className="font-display-regular leading-[1.7] text-gray-100"
                    style={{ fontSize: 11 * s }}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}
                    allowFontScaling={false}
                  >
                    {appointment.specialty}
                  </Text>
                </View>
              </View>

              <View
                className="shrink-0 items-stretch"
                style={{ gap: 3.67 * s }}
              >
                <View
                  className="flex-row items-center justify-center"
                  style={{ gap: 8.26 * s }}
                >
                  <Clock color="#ffffff" size={15.2 * s} strokeWidth={2} />
                  <Text
                    className="font-display-regular leading-[1.7] text-gray-100"
                    style={{ fontSize: 10 * s }}
                    numberOfLines={1}
                    allowFontScaling={false}
                  >
                    {appointment.time}
                  </Text>
                </View>
                <View
                  className="items-center justify-center border border-neon bg-gray-900"
                  style={{
                    borderRadius: cardRadius,
                    borderWidth: Math.max(0.5, 0.92 * s),
                    paddingHorizontal: 7.34 * s,
                    paddingVertical: 3.67 * s,
                  }}
                >
                  <Text
                    className="font-display-semibold leading-[1.4] text-neon"
                    style={{ fontSize: 11 * s }}
                    numberOfLines={1}
                    allowFontScaling={false}
                  >
                    Confirmado
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export default function ProfessionalOnboardingPage() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const usableHeight = height - insets.top - insets.bottom;

  const scale = Math.min(width / FIGMA_WIDTH, usableHeight / FIGMA_HEIGHT, 1);
  const isCompact = usableHeight < 700;
  const isVeryCompact = usableHeight < 600;

  const logoWidth = LOGO_WIDTH * scale;
  const logoHeight = LOGO_HEIGHT * scale;

  const footerReserve = isVeryCompact ? 210 : isCompact ? 240 : 268;
  const scheduleMaxH = Math.max(
    usableHeight - logoHeight - footerReserve,
    usableHeight * 0.3,
  );
  const scheduleMaxW = Math.min(
    SCHEDULE_W * scale,
    width - 32,
    CONTENT_MAX_WIDTH,
  );
  const scheduleScale = Math.min(
    scheduleMaxW / SCHEDULE_W,
    scheduleMaxH / SCHEDULE_H,
    1,
  );

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
        <View
          className={cn(
            'shrink-0 items-center',
            isVeryCompact ? 'pt-1' : isCompact ? 'pt-2' : 'pt-3',
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

        <View className="min-h-0 w-full flex-1 items-center justify-center">
          <SchedulePreview s={scheduleScale} />
        </View>

        <View
          className={cn(
            'w-full shrink-0',
            isVeryCompact ? 'gap-4 pb-1' : 'gap-6 pb-2',
          )}
        >
          <View className="w-full gap-2">
            <Text
              className="text-center font-display-semibold leading-[1.4] text-gray-100"
              style={{ fontSize: titleSize }}
            >
              Trabalhe no seu ritmo
            </Text>
            <Text
              className="text-center font-sans leading-[1.4] tracking-[-0.32px] text-gray-500"
              style={{ fontSize: bodySize }}
            >
              Lorem ipsum door Lorem ipsum doorLorem ipsum doorLorem ipsum
              doorLorem ipsum doorLorem ipsum door
            </Text>
          </View>

          <View className="w-full gap-3">
            <ButtonLink
              href={{ pathname: '/login', params: { role: 'professional' } }}
            >
              Avançar
            </ButtonLink>
            <ButtonBack>Voltar</ButtonBack>
          </View>
        </View>
      </View>
    </Screen>
  );
}
