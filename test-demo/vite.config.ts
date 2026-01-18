import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import stringHash from 'string-hash'

export default defineConfig({
  root: __dirname,
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, '../src') }
    ]
  },
  plugins: [vue()],
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true
  },
  css: {
    modules: {
      generateScopedName: (name, filename, css) => {
        const f = filename.split('?')[0].split('.')[0]
        const file = path.basename(f)
        const hash = stringHash(css).toString(36).substr(0, 5)
        return `${file}_${name}_${hash}`
      }
    }
  }
})

