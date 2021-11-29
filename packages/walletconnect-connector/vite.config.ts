import { defineConfig } from 'vite'
import host from 'vite-plugin-host'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'WalletconnectConnector'
    }
  },
  server: {
    port: parseInt(process.env.port || '3000'),
    open: true
  },
  plugins: [host()]
})
