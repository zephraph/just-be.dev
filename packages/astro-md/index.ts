import type { AstroIntegration } from "astro";
import type { MarkdownProcessorRenderResult } from "@astrojs/markdown-remark";

export interface Renderer {
  render: (content: string) => Promise<MarkdownProcessorRenderResult>;
}

export default function renderIntegration(): AstroIntegration {
  const integration: AstroIntegration = {
    name: "astro:md",
    hooks: {
      async "astro:config:setup"({ addMiddleware }) {
        addMiddleware({
          entrypoint: "@just-be/astro-md/middleware.ts",
          order: "post",
        });
      },
    },
  };

  return integration;
}
