import type { AstroIntegration } from "astro";
import type { MarkdownProcessorRenderResult } from "@astrojs/markdown-remark";

export interface Renderer {
  render: (
    content: string,
    frontmatter?: Record<string, any>
  ) => Promise<MarkdownProcessorRenderResult>;
}

export default function renderIntegration() {
  const integration: AstroIntegration = {
    name: "astro:md",
    hooks: {
      "astro:config:setup"({ addMiddleware }) {
        addMiddleware({
          entrypoint: "@plugins/renderer.middleware",
          order: "pre",
        });
      },
    },
  };

  return integration;
}
