/// <reference types="./astro.config.d.ts" />

import { defineConfig, type AstroUserConfig } from "astro/config";
import remarkObsidian from "remark-obsidian";
import { normalizeFrontmatter } from "./plugins/normalize-fontmatter.remark";
import tailwind from "@astrojs/tailwind";
import markdownIntegration from "./plugins/renderer";

import cloudflare from "@astrojs/cloudflare";

export const markdown: NonNullable<AstroUserConfig["markdown"]> = {
  remarkPlugins: [normalizeFrontmatter, remarkObsidian],
};

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  markdown,
  integrations: [markdownIntegration(), tailwind()],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
});
