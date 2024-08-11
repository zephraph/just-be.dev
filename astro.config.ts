/// <reference types="./astro.config.d.ts" />

import { defineConfig } from "astro/config";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";

import { normalizeFrontmatter } from "./packages/my-remark";
import { remarkObsidian } from "./packages/remark-obsidian";
import mdRenderer from "./packages/astro-md";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  markdown: {
    remarkPlugins: [normalizeFrontmatter, remarkObsidian],
  },
  integrations: [mdRenderer({ configUrl: import.meta.url }), tailwind()],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  vite: {
    ssr: {
      external: ["node:path", "path"],
    },
    plugins: [
      nodePolyfills({
        include: ["url", "module"],
      }),
    ],
  },
});
