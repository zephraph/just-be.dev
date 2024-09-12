/// <reference types="./middleware.d.ts" />

import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { defineMiddleware } from "astro:middleware";
import { normalizeFrontmatter } from "../my-remark";
import { remarkObsidian } from "../remark-obsidian";
import remarkFrontmatter from "remark-frontmatter";

export const onRequest = defineMiddleware(async (context, next) => {
  const fileResolver = async (path: string) => {
    return (await context.locals.runtime.env.KV_MAPPINGS.get(path)) ?? path;
  };
  const processor = await createMarkdownProcessor({
    remarkPlugins: [
      remarkFrontmatter,
      normalizeFrontmatter,
      remarkObsidian({ fileResolver }),
    ],
  });
  context.locals.render = processor.render;
  return next();
});
