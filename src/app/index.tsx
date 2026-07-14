import {
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Text,
  Dimensions,
} from 'react-native';
import image from '@/assets/images/welcome.png';
import { ButtonLink } from '@/components/button-link';
import { Link } from '@/components/link';
import { backgroundColor } from '@/domains/theme/constants/colors';

export default function HomePage() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Template do Expo</Text>
          <Image style={styles.image} source={image} alt="preview image" />

          <View style={styles.registerContainer}>
            <ButtonLink href="/auth/register" replace>
              Começar
            </ButtonLink>
            <Text style={styles.loginText}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor,
  },
  innerContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  title: {
    color: '#222',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
    fontSize: 26,
  },
  image: {
    width: '100%',
    height: Dimensions.get('window').height * 0.5,
    resizeMode: 'contain',
  },
  registerContainer: {
    paddingHorizontal: 100,
  },
  loginText: {
    marginTop: 20,
    color: '#222',
    textAlign: 'center',
  },
});
