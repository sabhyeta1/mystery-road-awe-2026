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
  {
    // Layering rule: only the API-access layer may call fetch().
    files: ["src/react/**/*.{ts,tsx}"],
    ignores: ["src/react/api/**"],
    rules: {
      "no-restricted-globals": [
        "error",
        {
          name: "fetch",
          message: "Call the backend only from src/react/api/ and use a hook in components.",
        },
      ],
    },
  },
  prettier,
]);