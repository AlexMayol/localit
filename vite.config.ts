import { defineConfig } from "vitest/config";
import dts from "vite-plugin-dts";
import path from "path";
import { terser } from "rollup-plugin-terser";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "Localit",
      formats: ["es", "cjs"],
      fileName: (format) => `localit.${format}.js`,
    },
    rollupOptions: {
      output: {
        compact: true,
      },
      plugins: [
        dts(),
        terser({
          compress: true,
          mangle: true,
          format: {
            comments: false,
          },
        }),
      ],
    },
  },

  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
