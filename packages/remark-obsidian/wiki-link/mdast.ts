/// <reference types="./types.d.ts" />

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
import type { WikiLinkNode as Node } from "micromark-util-types";
import { displayName, href } from "./utils";

interface WikiLinkNode extends Node {
  data?: Data;
}

export function fromMarkdown(): FromMarkdownExtension {
  const enterWikiLink: FromMarkdownHandle = function (token) {
    let wikiLink: WikiLinkNode = {
      type: "wikiLink",
      value: null,
      alias: null,
      block: null,
      headings: [],
      data: {},
    };
    // @ts-expect-error: Need to redefine nodes to include wikiLinkNode?
    this.enter(wikiLink, token);
  };

  function top(stack: CompileContext["stack"]) {
    return stack[stack.length - 1] as unknown as WikiLinkNode;
  }

  const exitWikiLinkAlias: FromMarkdownHandle = function (token) {
    const alias = this.sliceSerialize(token);
    const current = top(this.stack);
    current.alias = alias;
  };

  const exitWikiLinkTarget: FromMarkdownHandle = function (token) {
    const target = this.sliceSerialize(token);
    const current = top(this.stack);
    current.value = target;
  };

  const exitWikiLinkHeading: FromMarkdownHandle = function (token) {
    const heading = this.sliceSerialize(token);
    const current = top(this.stack);
    current.headings!.push(heading);
  };

  const exitWikiLinkBlock: FromMarkdownHandle = function (token) {
    const block = this.sliceSerialize(token);
    const current = top(this.stack);
    current.block = block;
  };

  const exitWikiLink: FromMarkdownHandle = function (token) {
    const wikiLink = top(this.stack);
    this.exit(token);

    wikiLink.data ??= {};

    wikiLink.data.hName = "a";
    wikiLink.data.hProperties = {
      href: href(wikiLink),
    };
    wikiLink.data.hChildren = [
      {
        type: "text",
        value: displayName(wikiLink),
      },
    ];
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

// TODO: Finish implementing
// export function toMarkdown(): ToMarkdownExtension {
//   const wikiLink: ToMarkdownHandle = function (node: WikiLinkNode, parent, state) {
//     const exit = state.enter("wikiLink");

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
//       // @ts-expect-error: TODO Need to redefine handlers to include wikiLink
//       wikiLink,
//     },
//   };
// }
