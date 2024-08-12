/// <reference types="./astro.config.d.ts" />

import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";
import { normalizeFrontmatter } from "./packages/my-remark";
import { remarkObsidian } from "./packages/remark-obsidian";
import mdRenderer from "./packages/astro-md";
import { sentryVitePlugin } from "@sentry/vite-plugin";

/**
 * This is a little hack to be able to progrmmatically detect
 * if we're pre-rendering or in SSR mode.
 */
process.env.IS_BUILD = "true";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  markdown: {
    remarkPlugins: [normalizeFrontmatter, remarkObsidian],
  },
  integrations: [mdRenderer(), tailwind()],
  adapter: cloudflare({
    imageService: "cloudflare",
    platformProxy: {
      enabled: true,
    },
  }),
  vite: {
    build: {
      sourcemap: true,
    },
    ssr: {
      external: ["node:async_hooks"],
    },
    plugins: [
      sentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: "just-be",
        project: "just-be-dev",
      }),
    ],
  },
});
