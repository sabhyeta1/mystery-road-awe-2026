import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";

export default [
  { ignores: ["dist/", "node_modules/"] },
  js.configs.recommended,
  {
    files: ["src/**/*.js"],
    languageOptions: { globals: { ...globals.browser } },
    rules: {
      "prefer-const": "error",
      "no-var": "error",
    },
  },
  prettier,
];