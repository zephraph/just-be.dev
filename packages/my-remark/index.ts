import type { MarkdownAstroData, RemarkPlugin } from "@astrojs/markdown-remark";
import type { Heading } from "mdast";

export const normalizeFrontmatter: RemarkPlugin = () => {
  return (root, file) => {
    const fm = (file.data.astro as MarkdownAstroData).frontmatter;
    /**
     * Treat the homepage as a special case for layouts and fallback to default.
     */
    if (fm.homepage) {
      fm.layout = "homepage";
    } else if (!fm.layout) {
      fm.layout = "default";
    }

    if (fm.layout) {
      fm.layout = `@layouts/${fm.layout}.astro`;
    }

    /**
     * If the title isn't listed in the frontmatter, we'll try to infer it from
     * the first heading in the markdown file. This works well with the `obsidian-front-matter-title`
     * plugin.
     */
    if (!fm.title) {
      const title = root.children.find(
        (node) => node.type === "heading" && node.depth === 1
      ) as Heading | undefined;
      fm.title = title?.children.find((node) => node.type === "text")?.value;
    }
  };
};

export default normalizeFrontmatter;
