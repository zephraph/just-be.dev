import { wikiLink } from "./syntax/wiki-link";
import { wikiCode } from "./syntax/utils";
import type { RemarkPlugin } from "@astrojs/markdown-remark";
import { fromMarkdown } from "./mdast";

export function syntax() {
  return {
    text: { [wikiCode.start]: wikiLink },
  };
}
export { html } from "./html";
export { fromMarkdown } from "./mdast";

export const wikiLinkPugin: RemarkPlugin = function () {
  // TODO: Fix this type
  const data = this.data() as any;

  data.micromarkExtensions = (data.micromarkExtensions || []).concat(syntax());
  data.fromMarkdownExtensions = (data.fromMarkdownExtensions || []).concat(
    fromMarkdown()
  );
};

export default wikiLinkPugin;
