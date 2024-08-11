import type { AstroIntegration } from "astro";
import type { MarkdownProcessorRenderResult } from "@astrojs/markdown-remark";

export interface Renderer {
  render: (
    content: string,
    frontmatter?: Record<string, any>
  ) => Promise<MarkdownProcessorRenderResult>;
}

export default function renderIntegration(): AstroIntegration {
  const integration: AstroIntegration = {
    name: "astro:md",
    hooks: {
      async "astro:config:setup"({ addMiddleware }) {
        addMiddleware({
          entrypoint: "@just-be/astro-md/middleware.ts",
          order: "pre",
        });
      },
    },
  };

  return integration;
}
