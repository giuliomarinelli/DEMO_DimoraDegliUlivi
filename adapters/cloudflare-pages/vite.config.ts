import { cloudflarePagesAdapter } from "@builder.io/qwik-city/adapters/cloudflare-pages/vite";
import { extendConfig } from "@builder.io/qwik-city/vite";
import baseConfig from "../../vite.config";

export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ["src/entry.cloudflare-pages.tsx", "@qwik-city-plan"],
      },
    },
    // Exclude every route from prerendering, but keep the adapter's output hooks.
    // In Qwik City 1.20.4, ssg: null also skips _worker.js/_routes.json generation.
    plugins: [
      cloudflarePagesAdapter({
        ssg: {
          include: [],
          exclude: ["/*"],
          emit404Pages: false,
          sitemapOutFile: null,
          maxWorkers: 1,
        },
      }),
    ],
  };
});
