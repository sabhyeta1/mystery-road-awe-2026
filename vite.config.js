import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    // Development only: the dev server forwards /api/... to the local Node backend.
    proxy: {
      "/api": "http://127.0.0.1:3001",
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        react: "react.html",
      },
    },
  },
});