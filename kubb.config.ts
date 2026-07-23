import { pluginTs } from '@kubb/plugin-ts'
import { pluginZod } from '@kubb/plugin-zod'
import { defineConfig } from 'kubb/config'
import { loadEnvFile } from 'node:process'

loadEnvFile()

const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL

if (!apiBaseUrl) {
  throw new Error('EXPO_PUBLIC_API_BASE_URL não está definida no arquivo .env')
}

export default defineConfig({
  input: `${apiBaseUrl}/api/docs/schema`,
  output: {
    path: './src/gen',
  },
  plugins: [
    pluginTs({
      output: {
        path: './models',
        mode: 'directory',
      },
    }),
    pluginZod({
      output: {
        path: './schemas',
        mode: 'directory',
      },
    }),
  ],
})
