import type { AstroIntegration } from "astro";
import type { MarkdownProcessorRenderResult } from "@astrojs/markdown-remark";

export interface Renderer {
  render: (
    content: string,
    frontmatter?: Record<string, any>
  ) => Promise<MarkdownProcessorRenderResult>;
}

interface LocalsMarkdownOptions {
  /**
   * Pass `import.meta.url` to this option
   */
  configUrl: string;
}

export default function renderIntegration({
  configUrl,
}: LocalsMarkdownOptions): AstroIntegration {
  const integration: AstroIntegration = {
    name: "astro:md",
    hooks: {
      "astro:config:setup"({ addMiddleware, updateConfig }) {
        updateConfig({
          vite: {
            define: {
              __ASTRO_CONFIG_PATH__: JSON.stringify(configUrl),
            },
          },
        });
        addMiddleware({
          entrypoint: "@plugins/locals-markdown/middleware.ts",
          order: "pre",
        });
      },
    },
  };

  return integration;
}
