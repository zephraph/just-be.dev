/// <reference types="../types.d.ts" />

import type { Data } from "mdast";
import type {
  Extension as FromMarkdownExtension,
  Handle as FromMarkdownHandle,
  CompileContext,
} from "mdast-util-from-markdown";
import type { EmbedNode as Node } from "micromark-util-types";

interface EmbedNode extends Node {
  data?: Data;
}

export function fromMarkdown() {
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
    const current = top(this.stack);
    current.headings!.push(this.sliceSerialize(token));
  };

  const exitEmbedExtension: FromMarkdownHandle = function (token) {
    const current = top(this.stack);
    current.extension = this.sliceSerialize(token);
  };

  const exitEmbed: FromMarkdownHandle = function (token) {
    const embed = top(this.stack);
    this.exit(token);

    embed.data ??= {};
    embed.data.hName = "embed";
    embed.data.hProperties = {
      src: embed.value,
      type: embed.extension,
      width: embed.dimensions?.[0],
      height: embed.dimensions?.[1],
      ...embed.pdfParams,
    };
  };

  return {
    enter: {
      embed: enterEmbed,
    },
    exit: {
      embed: exitEmbed,
      embedTarget: exitEmbedTarget,
      embedExtension: exitEmbedExtension,
      embedDimensionValue: exitEmbedDimensionValue,
      internalLinkHeading: exitEmbedHeading,
      internalLinkBlock: exitEmbedBlock,
    },
  };
}
