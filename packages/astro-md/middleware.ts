/// <reference types="./middleware.d.ts" />

import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { defineMiddleware } from "astro:middleware";
import { normalizeFrontmatter } from "../my-remark";
import { remarkObsidian } from "../remark-obsidian";
import remarkFrontmatter from "remark-frontmatter";

function isULID(str: string) {
  // ULID regex to validate the format
  const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
  return ulidRegex.test(str);
}

export const onRequest = defineMiddleware(async (context, next) => {
  const fileResolver = async (path: string) => {
    if (isULID(path)) return path;
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
