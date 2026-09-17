import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://www.shirtscanner.com",
  output: "static",
  integrations: [sitemap(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
