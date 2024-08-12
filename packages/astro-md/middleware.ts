/// <reference types="./middleware.d.ts" />

import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { defineMiddleware } from "astro:middleware";
import { normalizeFrontmatter } from "../my-remark";
import { remarkObsidian } from "../remark-obsidian";
import remarkFrontmatter from "remark-frontmatter";

// TODO: Figure out how to pass in plugins from astro's config
const processor = await createMarkdownProcessor({
  remarkPlugins: [remarkFrontmatter, normalizeFrontmatter, remarkObsidian],
});

export const onRequest = defineMiddleware((context, next) => {
  context.locals.render = processor.render;
  return next();
});
