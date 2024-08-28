/// <reference types="../types.d.ts" />

import type { Data } from "mdast";
import type {
  Handle as FromMarkdownHandle,
  CompileContext,
} from "mdast-util-from-markdown";
import type { EmbedNode as Node } from "micromark-util-types";
import mime from "mime";
import { href } from "../internal-link/utils";

interface EmbedNode extends Node {
  data?: Data;
}

interface FromMarkdownOptions {
  unresolvedLinks?: Set<string>;
}

export function fromMarkdown(options: FromMarkdownOptions = {}) {
  const enterEmbed: FromMarkdownHandle = function (token) {
    let embed: EmbedNode = {
      type: "embed",
      value: null,
      block: null,
      extension: null,
      headings: [],
      dimensions: [],
      pdfParams: {},
      data: {},
    };
    // @ts-expect-error: Need to redefine nodes to include embedNode?
    this.enter(embed, token);
  };

  function top(stack: CompileContext["stack"]) {
    return stack[stack.length - 1] as unknown as EmbedNode;
  }

  const exitEmbedTarget: FromMarkdownHandle = function (token) {
    const current = top(this.stack);
    current.value = this.sliceSerialize(token);
  };

  const exitEmbedDimensionValue: FromMarkdownHandle = function (token) {
    const current = top(this.stack);
    current.dimensions ??= [];
    current.dimensions.push(parseInt(this.sliceSerialize(token)));
  };

  const exitEmbedBlock: FromMarkdownHandle = function (token) {
    const current = top(this.stack);
    current.block = this.sliceSerialize(token);
  };

  const exitEmbedHeading: FromMarkdownHandle = function (token) {
    const heading = this.sliceSerialize(token);
    const current = top(this.stack);
    current.headings ??= [];
    current.headings.push(heading);
  };

  const exitEmbedPdfParam: FromMarkdownHandle = function (token) {
    const [key, value] = this.sliceSerialize(token).split("=");
    const current = top(this.stack);
    current.pdfParams ??= {};
    current.pdfParams[key] = value;
  };

  const exitEmbedExtension: FromMarkdownHandle = function (token) {
    const current = top(this.stack);
    current.extension = this.sliceSerialize(token);
  };

  const exitEmbed: FromMarkdownHandle = function (token) {
    const embed = top(this.stack);
    this.exit(token);

    if (embed.value) {
      options.unresolvedLinks?.add(embed.value);
    }

    const width = embed.dimensions?.[0];
    const height = embed.dimensions?.[1];

    embed.data ??= {};
    const type = embed.extension
      ? mime.getType(`.${embed.extension}`) ?? ""
      : "";
    switch (true) {
      case type.startsWith("audio/"):
        embed.data.hName = "audio";
        embed.data.hProperties = {
          controls: true,
        };
        embed.data.hChildren = [
          {
            type: "element",
            tagName: "source",
            properties: {
              src: embed.value,
              type,
            },
            children: [],
          },
        ];
        break;
      case type.startsWith("video/"):
        embed.data.hName = "video";
        embed.data.hProperties = {
          controls: true,
        };
        embed.data.hChildren = [
          {
            type: "element",
            tagName: "source",
            properties: {
              src: embed.value,
              type,
            },
            children: [],
          },
        ];
        break;
      case type.startsWith("image/"):
        embed.data.hName = "img";
        embed.data.hProperties = {
          src: embed.value,
          alt: embed.alias,
          type,
        };
        break;
      case type.startsWith("application/pdf"):
        embed.data.hName = "object";
        embed.data.hProperties = {
          data: embed.value,
          type,
          ...embed.pdfParams,
        };
        break;
      default:
        embed.data.hName = "object";
        embed.data.hProperties = {
          data: href(embed),
          ...embed.pdfParams,
        };
        break;
    }

    embed.data.hProperties ??= {};

    if (embed.alias) {
      embed.data.hProperties.title = embed.alias;
    }

    if (width) {
      embed.data.hProperties.width = width;
    }
    if (height) {
      embed.data.hProperties.height = height;
    }
  };

  return {
    enter: {
      embed: enterEmbed,
    },
    exit: {
      embed: exitEmbed,
      embedTarget: exitEmbedTarget,
      embedExtension: exitEmbedExtension,
      embedPdfParam: exitEmbedPdfParam,
      embedDimensionValue: exitEmbedDimensionValue,
      internalLinkHeading: exitEmbedHeading,
      internalLinkBlock: exitEmbedBlock,
    },
  };
}
