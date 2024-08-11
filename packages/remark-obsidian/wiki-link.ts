/// <reference types="./types.d.ts" />

import type { RemarkPlugin } from "@astrojs/markdown-remark";
import type { Data } from "unified";
import type { Node } from "mdast";
import { syntax } from "micromark-extension-wiki-link";

type ExtendedData = Data & { fromMarkdownExtensions?: any[]; syntax?: any[] };

interface WikiLinkNode extends Omit<Node, "data"> {
  type: "wikiLink";
  value: string | null;
  data: Node["data"] & {
    isEmbed: boolean;
    alias: string | null;
    permalink: string | null;
    exists: boolean | null;
  };
}

interface WikiLinkPluginOptions {}

const wikiLinkPlugin: RemarkPlugin<[WikiLinkPluginOptions]> =
  function wikiLinkPlugin(opts = {}) {
    const data = this.data() as ExtendedData;

    function add(field: keyof Omit<ExtendedData, "settings">, value: any) {
      if (data[field]) data[field].push(value);
      else data[field] = [value];
    }

    add("syntax", syntax({ aliasDivider: "|" }));
    add("fromMarkdownExtensions", fromMarkdown(opts));
  };

function fromMarkdown(opts: WikiLinkPluginOptions = {}) {
  let node: WikiLinkNode;

  function enterWikiLink(this: any, token: any) {
    node = {
      type: "wikiLink",
      value: null,
      data: {
        isEmbed: false,
        alias: null,
        permalink: null,
        exists: null,
      },
    };
    this.enter(node, token);
  }

  function top(stack: any) {
    return stack[stack.length - 1];
  }

  function exitWikiLinkAlias(this: any, token: any) {
    const alias = this.sliceSerialize(token);
    const current = top(this.stack);
    current.data.alias = alias;
  }

  function exitWikiLinkTarget(this: any, token: any) {
    const target = this.sliceSerialize(token);
    const current = top(this.stack);
    current.value = target;
  }

  function exitWikiLink(this: any, token: any) {
    this.exit(token);
    const wikiLink = node;

    const pagePermalinks = pageResolver(wikiLink.value);
    const target = pagePermalinks.find((p) => permalinks.indexOf(p) !== -1);
    const exists = target !== undefined;

    let permalink: string;
    if (exists) {
      permalink = target;
    } else {
      permalink = pagePermalinks[0] || "";
    }

    let displayName = wikiLink.value;
    if (wikiLink.data.alias) {
      displayName = wikiLink.data.alias;
    }

    let classNames = wikiLinkClassName;
    if (!exists) {
      classNames += " " + newClassName;
    }

    wikiLink.data.alias = displayName;
    wikiLink.data.permalink = permalink;
    wikiLink.data.exists = exists;

    wikiLink.data.hName = "a";
    wikiLink.data.hProperties = {
      className: classNames,
      href: hrefTemplate(permalink),
    };
    wikiLink.data.hChildren = [
      {
        type: "text",
        value: displayName,
      },
    ];
  }

  return {
    enter: {
      wikiLink: enterWikiLink,
    },
    exit: {
      wikiLinkTarget: exitWikiLinkTarget,
      wikiLinkAlias: exitWikiLinkAlias,
      wikiLink: exitWikiLink,
    },
  };
}
