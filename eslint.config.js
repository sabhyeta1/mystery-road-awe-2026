import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { ignores: ["dist/", "node_modules/"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["src/**/*.{js,ts}"],
    languageOptions: { globals: { ...globals.browser } },
    rules: {
      "prefer-const": "error",
      "no-var": "error",
    },
  },
  prettier,
]);