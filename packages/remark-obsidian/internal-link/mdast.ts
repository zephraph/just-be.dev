/// <reference types="../types.d.ts" />

import type { Data } from "mdast";
import type {
  Extension as FromMarkdownExtension,
  Handle as FromMarkdownHandle,
  CompileContext,
} from "mdast-util-from-markdown";
// import type {
//   Options as ToMarkdownExtension,
//   Handle as ToMarkdownHandle,
// } from "mdast-util-to-markdown";
import type { InternalLinkNode as Node } from "micromark-util-types";
import { displayName, href } from "./utils";

interface InternalLinkNode extends Node {
  data?: Data;
}

export function fromMarkdown(): FromMarkdownExtension {
  const enterInternalLink: FromMarkdownHandle = function (token) {
    let internalLink: InternalLinkNode = {
      type: "internalLink",
      value: null,
      alias: null,
      block: null,
      headings: [],
      data: {},
    };
    // @ts-expect-error: Need to redefine nodes to include internalLinkNode?
    this.enter(internalLink, token);
  };

  function top(stack: CompileContext["stack"]) {
    return stack[stack.length - 1] as unknown as InternalLinkNode;
  }

  const exitInternalLinkAlias: FromMarkdownHandle = function (token) {
    const alias = this.sliceSerialize(token);
    const current = top(this.stack);
    current.alias = alias;
  };

  const exitInternalLinkTarget: FromMarkdownHandle = function (token) {
    const target = this.sliceSerialize(token);
    const current = top(this.stack);
    current.value = target;
  };

  const exitInternalLinkHeading: FromMarkdownHandle = function (token) {
    const heading = this.sliceSerialize(token);
    const current = top(this.stack);
    current.headings!.push(heading);
  };

  const exitInternalLinkBlock: FromMarkdownHandle = function (token) {
    const block = this.sliceSerialize(token);
    const current = top(this.stack);
    current.block = block;
  };

  const exitInternalLink: FromMarkdownHandle = function (token) {
    const internalLink = top(this.stack);
    this.exit(token);

    internalLink.data ??= {};

    internalLink.data.hName = "a";
    internalLink.data.hProperties = {
      href: href(internalLink),
    };
    internalLink.data.hChildren = [
      {
        type: "text",
        value: displayName(internalLink),
      },
    ];
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

// TODO: Finish implementing
// export function toMarkdown(): ToMarkdownExtension {
//   const internalLink: ToMarkdownHandle = function (node: InternalLinkNode, parent, state) {
//     const exit = state.enter("internalLink");

//     const nodeValue = state.safe(node.value, { before: "[", after: "]" });
//     const nodeAlias = state.safe(node.alias, { before: "[", after: "]" });

//     let value;
//     if (nodeAlias !== nodeValue) {
//       value = `[[${nodeValue}${aliasDivider}${nodeAlias}]]`;
//     } else {
//       value = `[[${nodeValue}]]`;
//     }

//     exit();

//     return value;
//   };

//   return {
//     unsafe: [
//       {
//         character: "[",
//         inConstruct: ["phrasing", "label", "reference"],
//       },
//       {
//         character: "]",
//         inConstruct: ["label", "reference"],
//       },
//     ],
//     handlers: {
//       // @ts-expect-error: TODO Need to redefine handlers to include internalLink
//       internalLink,
//     },
//   };
// }
