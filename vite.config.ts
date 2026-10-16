import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/BLAMAZ/",         // important for GitHub Pages
  build: {
    // three.js (model 3D logo w stopce, ~990 kB) ładuje się osobno i dopiero przy przewinięciu do stopki
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})