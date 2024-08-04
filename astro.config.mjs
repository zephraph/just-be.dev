import { defineConfig } from "astro/config";
import remarkObsidian from "remark-obsidian";
import { normalizeLayouts } from "./plugins/normalize-layouts.remark.mjs";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  markdown: {
    remarkPlugins: [normalizeLayouts, remarkObsidian]
  },
  integrations: [tailwind()]
});