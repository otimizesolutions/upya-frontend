import { defineConfig } from '@kubb/core';
import { pluginOas } from '@kubb/plugin-oas';
import { pluginTs } from '@kubb/plugin-ts';
import { pluginClient } from '@kubb/plugin-client';
import { pluginReactQuery } from '@kubb/plugin-react-query';

/**
 * Gera tipos e clients a partir do schema OpenAPI do backend.
 * Ajuste `input.path` se o schema estiver em outra URL/arquivo.
 *
 * Rodar: npm run generate:api
 */
export default defineConfig({
  root: '.',
  input: {
    path: 'http://localhost:8000/api/schema/',
  },
  output: {
    path: './src/gen',
    clean: false,
  },
  plugins: [
    pluginOas({ validate: false }),
    pluginTs({
      output: {
        path: './types',
      },
    }),
    pluginClient({
      output: {
        path: './clients',
      },
      importPath: '@/lib/kubb-client',
      dataReturnType: 'data',
    }),
    pluginReactQuery({
      output: {
        path: './hooks',
      },
      client: {
        importPath: '@/lib/kubb-client',
        dataReturnType: 'data',
      },
    }),
  ],
});
