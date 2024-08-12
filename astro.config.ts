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
  /**
   * Note: I'd like this to be hybrid, but when that's enabled cf deployments give me a 500 error
   * @see https://just-be.sentry.io/share/issue/ab09f9239b3f45d1b27a222743afd6aa/
   */
  output: "server",
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
        /**
         * CF_PAGES set by Cloudflare at build time
         * @see https://developers.cloudflare.com/pages/configuration/build-configuration/#environment-variables
         */
        disable: !process.env.CF_PAGES,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: "just-be",
        project: "just-be-dev",
        telemetry: false,
      }),
    ],
  },
});
