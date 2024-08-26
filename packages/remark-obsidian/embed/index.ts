import type { RemarkPlugin } from "@astrojs/markdown-remark";
import { syntax } from "./syntax";
import { fromMarkdown } from "./mdast";

export { syntax } from "./syntax";
export { html } from "./html";
export { fromMarkdown } from "./mdast";

export const embedPlugin: RemarkPlugin = function () {
  // TODO: Fix this type
  const data = this.data() as any;

  data.micromarkExtensions = (data.micromarkExtensions || []).concat(syntax());
  data.fromMarkdownExtensions = (data.fromMarkdownExtensions || []).concat(
    fromMarkdown()
  );
};

export default embedPlugin;
