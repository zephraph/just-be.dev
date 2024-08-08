/// <reference types="./astro.config.d.ts" />

import { defineConfig, type AstroUserConfig } from "astro/config";
import remarkObsidian from "remark-obsidian";
import { normalizeFrontmatter } from "./plugins/normalize-fontmatter.remark";
import localsMarkdown from "./plugins/locals-markdown";

import tailwind from "@astrojs/tailwind";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  markdown: {
    remarkPlugins: [normalizeFrontmatter, remarkObsidian],
  },
  integrations: [localsMarkdown({ configUrl: import.meta.url }), tailwind()],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
});
