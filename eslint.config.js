import globals from "globals";
import tseslint from "typescript-eslint";
import pluginJs from "@eslint/js";

export default [
  { languageOptions: { globals: globals.browser } },
  {
    // Global ignores
    ignores: ["dist/", ".DS_Store", "browser/"],
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      indent: ["error", 2],
      "linebreak-style": "off",
    },
  },
];
