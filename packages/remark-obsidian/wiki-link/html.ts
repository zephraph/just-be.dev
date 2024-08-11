/// <reference path="./types.d.ts" />
import type { CompileData, Handle, HtmlExtension } from "micromark-util-types";
import { displayName, href, slugify } from "./utils";

export function html(): HtmlExtension {
  const enterWikiLink: Handle = function () {
    let stack = this.getData("wikiLinkStack");
    if (!stack) this.setData("wikiLinkStack", (stack = []));

    stack.push({
      type: "wikiLink",
    });
  };

  function top(stack: CompileData["wikiLinkStack"]) {
    return stack[stack.length - 1];
  }

  const exitWikiLinkAlias: Handle = function (token) {
    const alias = this.sliceSerialize(token);
    const current = top(this.getData("wikiLinkStack"));
    current.alias = alias;
  };

  const exitWikiLinkHeading: Handle = function (token) {
    const heading = this.sliceSerialize(token);
    const current = top(this.getData("wikiLinkStack"));
    current.headings = (current.headings ?? []).concat(heading);
  };

  const exitWikiLinkBlock: Handle = function (token) {
    const block = this.sliceSerialize(token);
    const current = top(this.getData("wikiLinkStack"));
    current.block = block;
  };

  const exitWikiLinkTarget: Handle = function (token) {
    const target = this.sliceSerialize(token);
    const current = top(this.getData("wikiLinkStack"));
    current.value = target;
  };

  const exitWikiLink: Handle = function () {
    const wikiLink = this.getData("wikiLinkStack").pop();

    if (!wikiLink) return;
    if (Object.values(wikiLink).every((v) => !v)) return;

    this.tag(`<a href="${href(wikiLink)}">`);
    this.raw(displayName(wikiLink));
    this.tag("</a>");
  };

  return {
    enter: {
      wikiLink: enterWikiLink,
    },
    exit: {
      wikiLinkTarget: exitWikiLinkTarget,
      wikiLinkAlias: exitWikiLinkAlias,
      wikiLinkHeading: exitWikiLinkHeading,
      wikiLinkBlock: exitWikiLinkBlock,
      wikiLink: exitWikiLink,
    },
  };
}
