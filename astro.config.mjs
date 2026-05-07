import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  output: "static",
  site: "https://www.rifugiobarrasso.com",
  integrations: [sitemap()],
  vite: {
    resolve: {
      alias: {
        "@components": fileURLToPath(
          new URL("./src/components", import.meta.url),
        ),
        "@data": fileURLToPath(new URL("./src/data", import.meta.url)),
        "@layouts": fileURLToPath(new URL("./src/layouts", import.meta.url)),
        "@styles": fileURLToPath(new URL("./src/styles", import.meta.url)),
      },
    },
  },
});
