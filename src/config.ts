const apiHost = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

if (!apiHost) {
  throw new Error(
    'EXPO_PUBLIC_API_BASE_URL não está definida no arquivo .env',
  );
}

/** Base da API REST (`…/api`), derivada de `EXPO_PUBLIC_API_BASE_URL`. */
export const API_BASE_URL = apiHost.endsWith('/api')
  ? apiHost
  : `${apiHost}/api`;

export const TOKEN_KEY = 'REFRESH_TOKEN';
