import { defineConfig } from "vitest/config";
import dts from "vite-plugin-dts";
import path from "path";

export default defineConfig({
  build: {
    minify: "esbuild",
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "Localit",
      formats: ["es", "cjs"],
      fileName: (format) => `localit.${format}.js`,
    }
  },
  plugins: [dts()],
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
