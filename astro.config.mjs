import { defineConfig, fontProviders } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://www.shirtscanner.com",
  output: "static",
  integrations: [sitemap(), react()],
  prefetch: {
    prefetchAll: true,
  },
  fonts: [
    {
      name: "Geist Variable",
      cssVariable: "--font-geist",
      provider: fontProviders.local(),
      options: {
        variants: [
          {
            weight: "100 900",
            style: "normal",
            src: [
              "./node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2",
            ],
          },
        ],
      },
    },
    {
      name: "Archivo Variable",
      cssVariable: "--font-archivo",
      provider: fontProviders.local(),
      options: {
        variants: [
          {
            weight: "100 900",
            style: "normal",
            stretch: "62% 125%",
            src: [
              "./node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2",
              "./node_modules/@fontsource-variable/archivo/files/archivo-latin-ext-wdth-normal.woff2",
            ],
          },
        ],
      },
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
