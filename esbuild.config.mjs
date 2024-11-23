import * as esbuild from "esbuild";

const sharedConfig = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  sourcemap: false,
  target: ["es2020"],
};

const outputs = [
  {
    outfile: "dist/index.min.cjs.js",
    format: "cjs",
    globalName: "localit",
  },
  {
    outfile: "dist/index.min.esm.js",
    format: "esm",
  },
  {
    outfile: "dist/index.min.iife.js",
    format: "iife",
    globalName: "localit",
  },
];
Promise.all(
  outputs.map((config) => esbuild.build({ ...sharedConfig, ...config }))
).catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
