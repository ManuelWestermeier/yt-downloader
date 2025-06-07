import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["pwa-icon.png"],
      manifest: {
        name: "YouTube Downloader",
        short_name: "YT-DL",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        icons: [{ src: "pwa-icon.png", sizes: "192x192", type: "image/png" }],
      },
    }),
  ],
  build: {
    outDir: "docs",
    assetsDir: "assets",
  },
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
