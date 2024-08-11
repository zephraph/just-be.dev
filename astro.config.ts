/// <reference types="./astro.config.d.ts" />

import { defineConfig } from "astro/config";
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
  integrations: [mdRenderer(), tailwind()],
  adapter: cloudflare({
    imageService: "cloudflare",
    platformProxy: {
      enabled: true,
    },
  }),
});
