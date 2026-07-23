import { useEffect, useState } from 'react';
import { Image, Pressable, useWindowDimensions, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import clientHero from '@/assets/images/login/client-hero.jpg';
import professionalHero from '@/assets/images/login/professional-hero.png';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import {
  LoginRoleToggle,
  type LoginRole,
} from '@/components/login-role-toggle';
import { LoginTextField } from '@/components/login-text-field';
import { FormScreen } from '@/components/form-screen';
import { Text } from '@/components/ui/text';
import { useLoginMutation } from '@/domains/auth/mutations';
import { cn } from '@/lib/utils';

function parseLoginRole(value: string | string[] | undefined): LoginRole {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === 'professional' ? 'professional' : 'client';
}

const FIGMA_HEIGHT = 844;
const CONTENT_MAX_WIDTH = 430;
/** Frame da imagem no Figma (11205:481): 390×526. */
const HERO_FIGMA_HEIGHT = 526;
/** Imagem cliente (11205:482): 390×585, y=-30. */
const CLIENT_IMAGE_FIGMA_HEIGHT = 585;
const CLIENT_IMAGE_FIGMA_TOP = -30;
/** Imagem profissional: ~131.75% da altura, deslocada ~6%. */
const PRO_IMAGE_HEIGHT_RATIO = 1.3175;
const PRO_IMAGE_TOP_RATIO = 0.06;

const emailMessage = 'Preencha seu e-mail.';
const passwordMessage = 'Preencha sua senha.';
const formSchema = z.object({
  email: z
    .string({ message: emailMessage })
    .min(2, { message: emailMessage })
    .email({ message: emailMessage }),
  password: z
    .string({ message: passwordMessage })
    .min(1, { message: passwordMessage }),
});

type LoginFormValues = z.infer<typeof formSchema>;

/** Gradientes do Figma — Cliente (11205:482) / Profissional. */
function HeroFade({
  width,
  height,
  role,
}: {
  width: number;
  height: number;
  role: LoginRole;
}) {
  const isClient = role === 'client';
  const gradId = isClient ? 'client' : 'pro';

  return (
    <Svg
      width={width}
      height={height}
      style={{ position: 'absolute', left: 0, top: 0 }}
      pointerEvents="none"
    >
      <Defs>
        <LinearGradient id={`${gradId}FadeTop`} x1="0" y1="0" x2="0" y2="1">
          <Stop
            offset={isClient ? '0%' : '0%'}
            stopColor="#000"
            stopOpacity="1"
          />
          <Stop
            offset={isClient ? '4.5%' : '4%'}
            stopColor="#000"
            stopOpacity="1"
          />
          <Stop
            offset={isClient ? '30.9%' : '32%'}
            stopColor="#000"
            stopOpacity="0"
          />
        </LinearGradient>
        <LinearGradient id={`${gradId}FadeBottom`} x1="0" y1="0" x2="0" y2="1">
          <Stop
            offset={isClient ? '0%' : '25%'}
            stopColor="#000"
            stopOpacity="0"
          />
          <Stop
            offset={isClient ? '72%' : '80%'}
            stopColor="#000"
            stopOpacity="0.85"
          />
          {/* Opacidade 1 no fim evita hairline na junção com o fundo preto */}
          <Stop offset="100%" stopColor="#000" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill={`url(#${gradId}FadeTop)`}
      />
      <Rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill={`url(#${gradId}FadeBottom)`}
      />
    </Svg>
  );
}

export default function LoginPage() {
  const { width, height } = useWindowDimensions();
  const router = useRouter();
  const { role: roleParam } = useLocalSearchParams<{ role?: string }>();
  const [role, setRole] = useState<LoginRole>(() => parseLoginRole(roleParam));
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    setRole(parseLoginRole(roleParam));
  }, [roleParam]);

  function handleRoleChange(next: LoginRole) {
    setRole(next);
    router.setParams({ role: next });
  }

  const isCompact = height < 700;
  const isVeryCompact = height < 640;
  /** Reserva o formulário (título + inputs + botões) em qualquer altura. */
  const formReserve = isVeryCompact ? 360 : isCompact ? 390 : 410;
  /**
   * Hero = proporção Figma 526/844 (~62%), limitado para não esmagar o form
   * e com piso para manter o enquadramento em telas baixas.
   */
  const heroHeight = Math.max(
    height * 0.42,
    Math.min((HERO_FIGMA_HEIGHT / FIGMA_HEIGHT) * height, height - formReserve),
  );

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const loginMutation = useLoginMutation(form);

  function handleSubmit(values: LoginFormValues) {
    loginMutation.mutate({ ...values, role });
  }

  const heroSource = role === 'client' ? clientHero : professionalHero;

  /**
   * Crop por role — Figma:
   * - Cliente (11205:482): y=-30, h=585 em frame 526
   * - Profissional: h≈131.75%, top≈6%
   */
  const imageHeight =
    role === 'professional'
      ? heroHeight * PRO_IMAGE_HEIGHT_RATIO
      : heroHeight * (CLIENT_IMAGE_FIGMA_HEIGHT / HERO_FIGMA_HEIGHT);
  const imageTop =
    role === 'professional'
      ? heroHeight * PRO_IMAGE_TOP_RATIO
      : heroHeight * (CLIENT_IMAGE_FIGMA_TOP / HERO_FIGMA_HEIGHT);

  /** Inteiros + bleed evitam hairlines de subpixel no Android/iOS. */
  const bleedX = 3;
  const bleedY = 2;
  const heroBoxW = Math.ceil(width) + bleedX * 2;
  const heroBoxH = Math.ceil(heroHeight) + bleedY;

  return (
    <View className="flex-1 bg-gray-1000">
      <StatusBar style="light" />

      {/* Hero full-bleed — sem borda/linha de corte */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: -bleedX,
          width: heroBoxW,
          height: heroBoxH,
          backgroundColor: '#000000',
          overflow: 'hidden',
        }}
      >
        <Image
          source={heroSource}
          alt=""
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={{
            position: 'absolute',
            top: imageTop,
            left: 0,
            width: heroBoxW,
            height: Math.ceil(imageHeight) + bleedY,
          }}
          resizeMode="cover"
        />
        <HeroFade width={heroBoxW} height={heroBoxH} role={role} />
        {/* Extensão preta mínima sob o clip — some a hairline inferior */}
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: -1,
            height: 8,
            backgroundColor: '#000000',
          }}
        />
      </View>

      <FormScreen className="bg-transparent" contentClassName="px-0">
        <View
          className={cn(
            'w-full flex-1 self-center',
            isCompact ? 'min-h-full justify-between' : 'justify-between',
          )}
          style={{ maxWidth: CONTENT_MAX_WIDTH }}
        >
          {/* Toggle — Figma y≈64, px-24 */}
          <View className="w-full px-6 pt-2">
            <LoginRoleToggle value={role} onChange={handleRoleChange} />
          </View>

          {/* Form — Figma y≈401, px-16, gap-32 */}
          <View className="w-full gap-8 px-4 pb-2">
            <Text className="text-center font-display-semibold text-[24px] leading-[1.4] text-gray-100">
              Que bom ter você de volta!
            </Text>

            <Form {...form}>
              <View className="w-full gap-4">
                <View className="w-full gap-4">
                  <LoginTextField
                    control={form.control}
                    name="email"
                    placeholder="Insira seu Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                    leftAdorn={
                      <Mail size={20} color="#ffffff" strokeWidth={1.75} />
                    }
                  />

                  <View className="w-full gap-1">
                    <LoginTextField
                      control={form.control}
                      name="password"
                      placeholder="Insira sua senha"
                      secureTextEntry={!isPasswordVisible}
                      autoComplete="password"
                      textContentType="password"
                      leftAdorn={
                        <LockKeyhole
                          size={20}
                          color="#ffffff"
                          strokeWidth={1.75}
                        />
                      }
                      rightAdorn={
                        <Pressable
                          onPress={() => setIsPasswordVisible((prev) => !prev)}
                          hitSlop={8}
                          accessibilityRole="button"
                          accessibilityLabel={
                            isPasswordVisible
                              ? 'Ocultar senha'
                              : 'Mostrar senha'
                          }
                        >
                          {isPasswordVisible ? (
                            <EyeOff
                              size={20}
                              color="#ffffff"
                              strokeWidth={1.75}
                            />
                          ) : (
                            <Eye size={20} color="#ffffff" strokeWidth={1.75} />
                          )}
                        </Pressable>
                      }
                    />

                    <Link href="/forgot" asChild>
                      <Pressable
                        accessibilityRole="link"
                        className="items-start self-start p-2"
                      >
                        <Text className="font-display-semibold text-[16px] leading-[1.4] text-gray-100">
                          Esqueceu sua senha?
                        </Text>
                      </Pressable>
                    </Link>
                  </View>
                </View>

                <Button
                  onPress={form.handleSubmit(handleSubmit)}
                  disabled={loginMutation.isPending}
                  className="w-full"
                >
                  {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
                </Button>
              </View>
            </Form>

            <View className="w-full gap-0.5">
              <View className="w-full flex-row items-center gap-2.5">
                <View className="h-px flex-1 bg-gray-800" />
                <Text className="font-sans text-[14px] leading-[1.5] text-gray-400">
                  Primeiro acesso?
                </Text>
                <View className="h-px flex-1 bg-gray-800" />
              </View>

              <Pressable
                accessibilityRole="button"
                className="h-[52px] w-full items-center justify-center bg-gray-1000"
                onPress={() => {
                  if (role === 'client') {
                    router.push('/register/client/email');
                  } else {
                    router.push('/register/professional/email');
                  }
                }}
              >
                <Text className="font-display-semibold text-[20px] leading-[1.4] text-gray-100">
                  Cadastre-se
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </FormScreen>
    </View>
  );
}
