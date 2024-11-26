import { resolve } from 'path'
import pkg from 'vite';
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

function pathResolve(dir) {
  return resolve(process.cwd(), '.', dir)
}

const { defineConfig } = pkg;
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  define: {
    'process.env': import.meta.env,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
  },
  parserOptions: {
    sourceType: 'module'
  },
  optimizeDeps: {
    include: ['@lcode/components-utils', 'axios', 'clone', 'dayjs', '@lcode/components-vue3']
  },
  resolve: {
    alias: {
      '@': pathResolve('src'),
    }
  },
  server: {
    hrm: true,
    port: 3033,
    host: 'dev-template.ppdai.com',
    proxy: {
      '/api': {
        target: 'http://ddstp.ppdapi.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/ddstp/, ''),
      },
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "./src/styles/variables.scss" as *;'
      }
    }
  },
})
