import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import { terser } from "rollup-plugin-terser";

const name = require("./package.json").main.replace(/\.js$/, "");
const bundle = (config) => ({
  ...config,
  input: "src/localit.ts",
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
