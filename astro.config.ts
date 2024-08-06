/// <reference types="./astro.config.d.ts" />

import { defineConfig } from "astro/config";
import remarkObsidian from "remark-obsidian";
import { normalizeFrontmatter } from "./plugins/normalize-fontmatter.remark.js";
import tailwind from "@astrojs/tailwind";
import markdownIntegration from "@astropub/md";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  markdown: {
    remarkPlugins: [normalizeFrontmatter, remarkObsidian],
  },
  integrations: [markdownIntegration(), tailwind()],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
});
