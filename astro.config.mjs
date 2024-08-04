import { defineConfig } from "astro/config";
import remarkObsidian from "remark-obsidian";

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkObsidian],
  },
});
