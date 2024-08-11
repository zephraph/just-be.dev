import type { MarkdownAstroData, RemarkPlugin } from "@astrojs/markdown-remark";
import { visit } from "unist-util-visit";
import wikiLinkPlugin from "./wiki-link";

export const remarkObsidian: RemarkPlugin = function () {
  this.use(wikiLinkPlugin, {});

  return (root, file) => {
    // const fm = (file.data.astro as MarkdownAstroData).frontmatter;
    // visit(root, "paragraph", (node, index, parent) => {
    // });
  };
};

export default remarkObsidian;
