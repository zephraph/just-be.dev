import type { MarkdownAstroData, RemarkPlugin } from "@astrojs/markdown-remark";
import { visit } from "unist-util-visit";
import internalLinkPlugin from "./internal-link";
import embedPlugin from "./embed";

export const remarkObsidian: RemarkPlugin = function () {
  this.use(internalLinkPlugin, embedPlugin);

  return (root, file) => {
    // const fm = (file.data.astro as MarkdownAstroData).frontmatter;
    // visit(root, "paragraph", (node, index, parent) => {
    // });
  };
};

export default remarkObsidian;
