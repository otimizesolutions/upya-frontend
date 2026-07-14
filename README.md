# Template Expo

Esse é um template de app utilizando o [Expo](https://expo.dev) criado com o [`create-expo-app`](https://www.npmjs.com/package/create-expo-app) e ajustado para funcionar como uma base para projetos futuros.

## Funcionalidades

Algumas funcionalidades foram implementadas por padrão.

- Sistema de login com `JWT` pré-implementado.
- Refresh-token funcional.
- Configuração de emissão de `TOAST's`.
- Tratamento de erros padrão de aplicações `django` com `django-rest-framework`.
- React-query com `axios` para requisições `HTTP`.

### Documentações Relacionadas

- [Tratamento de erros padrão do django-rest-framework](./docs/tratamento-de-erros-drf.md)

## Rodando Localmente

1. Instalar dependencias

   ```bash
   npm install
   ```

2. Inicializar o App

   ```bash
    npx expo start
   ```

Na saída do terminal, você terá opções para abrir o app em:

- [Build de desenvolvimento](https://docs.expo.dev/develop/development-builds/introduction/)
- [Emulador de android](https://docs.expo.dev/workflow/android-studio-emulator/)
- [Simulador de ios](https://docs.expo.dev/workflow/ios-simulator/)
- [App Expo Go](https://expo.dev/go), um app sandbox limitado para testar o app de desenvolvimento com o Expo sem a necessidade de rodar a build.
