import type { RemarkPlugin } from "@astrojs/markdown-remark";
import { visit } from "unist-util-visit";
import internalLinkPlugin from "./internal-link";
import embedPlugin from "./embed";
import { href } from "./internal-link/utils";
import type { CodeNode, EmbedNode, InternalLinkNode } from "./types";

interface RemarkObsidianOptions {
  fileResolver?: (path: string) => Promise<string>;
}

export const remarkObsidian = (
  options: RemarkObsidianOptions = {}
): RemarkPlugin =>
  function () {
    let unresolvedLinks: Set<string> = new Set();
    this.use(embedPlugin({ unresolvedLinks }));
    this.use(internalLinkPlugin({ unresolvedLinks }));

    return async (root) => {
      const resolvedLinks = await Promise.all(
        Array.from(unresolvedLinks).map(async (link) => ({
          [link]: (await options.fileResolver?.(link)) ?? link,
        }))
      ).then((links) => links.reduce((acc, link) => ({ ...acc, ...link }), {}));

      visit(root, "internalLink", (node: InternalLinkNode) => {
        if (node.value) {
          node.value = resolvedLinks[node.value];
          node.data!.hProperties.href = href(node);
        }
      });

      visit(root, "embed", (node: EmbedNode) => {
        if (!node.data) return;
        switch (node.data.hName) {
          case "image":
            node.data.hProperties.src =
              resolvedLinks[node.data.hProperties.src];
            break;
          case "video":
            node.data.hProperties.src =
              resolvedLinks[node.data.hProperties.src];
            break;
          case "audio":
            node.data.hProperties.src =
              resolvedLinks[node.data.hProperties.src];
            break;
        }
      });

      visit(root, "code", (node: CodeNode) => {
        if (node.lang) {
          node.data = {
            hProperties: {
              ["data-lang"]: node.lang,
            },
          };
        }
      });
    };
  };

export default remarkObsidian;
