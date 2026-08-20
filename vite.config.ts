import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base relativa: funciona tanto na raiz quanto em subpasta (ex.: GitHub Pages
// de projeto, https://usuario.github.io/nome-do-repo/), sem precisar saber
// o nome do repositório de antemão.
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      // Precisa espelhar o "paths" de tsconfig.app.json — o Vite não lê o
      // tsconfig automaticamente, então o alias tem que ser declarado aqui também.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    target: "es2020",
  },
});
