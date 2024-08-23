/// <reference path="../types.d.ts" />
import type { CompileData, Handle, HtmlExtension } from "micromark-util-types";
import { displayName, href } from "./utils";

export function html(): HtmlExtension {
  const enterInternalLink: Handle = function () {
    let stack = this.getData("internalLinkStack");
    if (!stack) this.setData("internalLinkStack", (stack = []));

    stack.push({
      type: "internalLink",
    });
  };

  function top(stack: CompileData["internalLinkStack"]) {
    return stack[stack.length - 1];
  }

  const exitInternalLinkAlias: Handle = function (token) {
    const alias = this.sliceSerialize(token);
    const current = top(this.getData("internalLinkStack"));
    current.alias = alias;
  };

  const exitInternalLinkHeading: Handle = function (token) {
    const heading = this.sliceSerialize(token);
    const current = top(this.getData("internalLinkStack"));
    current.headings = (current.headings ?? []).concat(heading);
  };

  const exitInternalLinkBlock: Handle = function (token) {
    const block = this.sliceSerialize(token);
    const current = top(this.getData("internalLinkStack"));
    current.block = block;
  };

  const exitInternalLinkTarget: Handle = function (token) {
    const target = this.sliceSerialize(token);
    const current = top(this.getData("internalLinkStack"));
    current.value = target;
  };

  const exitInternalLink: Handle = function () {
    const internalLink = this.getData("internalLinkStack").pop();

    if (!internalLink) return;
    if (Object.values(internalLink).every((v) => !v)) return;

    this.tag(`<a href="${href(internalLink)}">`);
    this.raw(displayName(internalLink));
    this.tag("</a>");
  };

  return {
    enter: {
      internalLink: enterInternalLink,
    },
    exit: {
      internalLinkTarget: exitInternalLinkTarget,
      internalLinkAlias: exitInternalLinkAlias,
      internalLinkHeading: exitInternalLinkHeading,
      internalLinkBlock: exitInternalLinkBlock,
      internalLink: exitInternalLink,
    },
  };
}
