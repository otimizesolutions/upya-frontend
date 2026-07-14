import { Image, StyleSheet, View } from 'react-native';

/**
 * Splash alinhada ao Figma (Onboard): fundo preto, logo central e arcos nos cantos.
 * Usa o export completo da tela para cobrir a limitação da splash nativa no Android
 * (só logo + cor de fundo).
 */
export function AppSplashScreen() {
  return (
    <View style={styles.container} accessibilityLabel="Upya">
      <Image
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        source={require('../assets/images/splash.png')}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
});
