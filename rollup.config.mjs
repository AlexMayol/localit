import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import { terser } from "rollup-plugin-terser";
import packageJson from "./package.json"  with { type: 'json' };

const name = packageJson.main.replace(/\.js$/, "");

const bundle = (config) => ({
  ...config,
  input: "src/index.ts",
  external: (id) => !/^[./]/.test(id),
});

export default [
  bundle({
    plugins: [esbuild(), terser()],
    output: [
      {
        name: "localit",
        file: `${name}.js`,
        exports: "named",
        format: "umd",
        sourcemap: false,
      },
      {
        name: "localit",
        dir: "browser",
        exports: "named",
        format: "umd",
        sourcemap: false,
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: `${name}.d.ts`,
      format: "es",
    },
  }),
];
