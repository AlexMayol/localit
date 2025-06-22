import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'path';
import terser from '@rollup/plugin-terser';


export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'Localit',
      formats: ['es', 'cjs'],
      fileName: (format) => `localit.${format}.js`,
    },
    rollupOptions: {
      external: [],
      plugins: [
        terser({
          format: {
            comments: false
          }
        })
      ]
    },
  },
  plugins: [dts()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
});
