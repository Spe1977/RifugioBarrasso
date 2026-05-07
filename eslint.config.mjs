import js from "@eslint/js";
import globals from "globals";
import astro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    ignores: ["dist/**", ".astro/**", "node_modules/**", "lighthouserc.cjs"],
  },
  {
    files: ["**/*.{js,ts,astro}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
];
