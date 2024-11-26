import { resolve } from 'path'
import pkg from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'

function pathResolve(dir) {
  return resolve(process.cwd(), '.', dir)
}

const { defineConfig } = pkg
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    legacy({
      targets: {}
      // renderModernChunks: false
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {}
      }
    }
    // chunkSizeWarningLimit: 1500,
  },
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
      '@': pathResolve('src')
    }
  },
  server: {
    hrm: true,
    port: 3021,
    open: true,
    https: true,
    host: 'dev-sam.huixtj.com',
    proxy: {
      '/huix': {
        // target: 'http://tjgateway.ppdapi.com',
        // target: 'http://hrm.tjapi.com',
        target: 'http://10.114.160.24:8080',
        rewrite: path => path.replace(/^\/huix\/hrm/, ''),
        changeOrigin: true
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "./src/styles/variables.scss" as *;',
        silenceDeprecations: ['legacy-js-api'],
      }
    }
  }
})
