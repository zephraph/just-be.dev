/// <reference types="./middleware.d.ts" />

import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { defineMiddleware } from "astro:middleware";
import matter from "gray-matter";

const processor = await createMarkdownProcessor(
  await import(__ASTRO_CONFIG_PATH__).then((m) => m.markdown)
);

export const onRequest = defineMiddleware((context, next) => {
  context.locals.render = (content, frontmatter) => {
    const raw = matter(content);
    return processor.render(raw.content, {
      frontmatter: { ...raw.data, ...frontmatter },
    });
  };
  return next();
});
