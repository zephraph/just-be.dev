/// <reference types="./middleware.d.ts" />

import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { defineMiddleware } from "astro:middleware";
import matter from "gray-matter";
import { normalizeFrontmatter } from "../my-remark";
import { remarkObsidian } from "../remark-obsidian";

const processor = await createMarkdownProcessor({
  remarkPlugins: [normalizeFrontmatter, remarkObsidian],
});

export const onRequest = defineMiddleware((context, next) => {
  context.locals.render = (content, frontmatter) => {
    const raw = matter(content);
    return processor.render(raw.content, {
      frontmatter: { ...raw.data, ...frontmatter },
    });
  };
  return next();
});
