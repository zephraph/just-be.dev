import type { RemarkPlugin } from "@astrojs/markdown-remark";
import { fromMarkdown } from "./mdast";
import { syntax } from "./syntax";

export { syntax } from "./syntax";
export { html } from "./html";
export { fromMarkdown } from "./mdast";

interface InternalLinkPluginOptions {
  unresolvedLinks?: Set<string>;
}

export const internalLinkPlugin = (
  options: InternalLinkPluginOptions = {}
): RemarkPlugin =>
  function () {
    // TODO: Fix this type
    const data = this.data() as any;

    data.micromarkExtensions = (data.micromarkExtensions || []).concat(
      syntax()
    );
    data.fromMarkdownExtensions = (data.fromMarkdownExtensions || []).concat(
      fromMarkdown(options)
    );
  };

export default internalLinkPlugin;