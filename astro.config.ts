/// <reference types="./astro.config.d.ts" />

import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";
import { myRemark } from "./packages/my-remark";
import mdRenderer from "./packages/astro-md";
import astroCloudflareSentry from "./packages/astro-cf-sentry";
import fullReload from "vite-plugin-full-reload";

// https://astro.build/config
export default defineConfig({
  site:
    process.env.NODE_ENV === "development"
      ? "http://localhost:4321"
      : "https://just-be.dev",
  /**
   * Note: I'd like this to be hybrid, but when that's enabled cf deployments give me a 500 error
   * @see https://just-be.sentry.io/share/issue/ab09f9239b3f45d1b27a222743afd6aa/
   */
  output: "server",
  markdown: {
    remarkPlugins: [myRemark],
  },
  integrations: [
    mdRenderer(),
    tailwind(),
    astroCloudflareSentry({
      org: "just-be",
      project: "just-be-dev",
      telemetry: false,
    }),
  ],
  adapter: cloudflare({
    imageService: "cloudflare",
    platformProxy: {
      enabled: true,
    },
  }),
  vite: {
    plugins: [fullReload(["notes/**/*.md"])],
  },
});
