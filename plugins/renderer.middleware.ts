import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { markdown } from "../astro.config";
import { defineMiddleware } from "astro:middleware";
import matter from "gray-matter";

const processor = await createMarkdownProcessor(markdown);

export const onRequest = defineMiddleware((context, next) => {
  context.locals.render = (content, frontmatter) => {
    const raw = matter(content);
    return processor.render(raw.content, {
      frontmatter: { ...raw.data, ...frontmatter },
    });
  };
  return next();
});
