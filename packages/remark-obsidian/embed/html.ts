/// <reference path="../types.d.ts" />

import type { CompileData, Handle, HtmlExtension } from "micromark-util-types";
import { safeTpl } from "../parser-utils";
import mime from "mime";

export function html(): HtmlExtension {
  const enterEmbed: Handle = function () {
    let stack = this.getData("embedStack");
    if (!stack) this.setData("embedStack", (stack = []));

    stack.push({
      type: "embed",
    });
  };

  function top(stack: CompileData["embedStack"]) {
    return stack[stack.length - 1];
  }

  const exitEmbedTarget: Handle = function (token) {
    const target = this.sliceSerialize(token);
    const current = top(this.getData("embedStack"));
    current.value = target;
  };

  const exitEmbedExtension: Handle = function (token) {
    const extension = this.sliceSerialize(token);
    const current = top(this.getData("embedStack"));
    current.extension = extension;
  };

  const exitEmbedDimensionValue: Handle = function (token) {
    const dimensionValue = this.sliceSerialize(token);
    const current = top(this.getData("embedStack"));
    current.dimensions ??= [];
    current.dimensions.push(parseInt(dimensionValue));
  };

  const exitEmbedBlock: Handle = function (token) {
    const block = this.sliceSerialize(token);
    const current = top(this.getData("embedStack"));
    current.block = block;
  };

  const exitEmbedHeading: Handle = function (token) {
    const heading = this.sliceSerialize(token);
    const current = top(this.getData("embedStack"));
    current.headings ??= [];
    current.headings.push(heading);
  };

  const exitEmbedPdfParam: Handle = function (token) {
    const [key, value] = this.sliceSerialize(token).split("=");
    const current = top(this.getData("embedStack"));
    current.pdfParams ??= {};
    current.pdfParams[key] = value;
  };

  const exitEmbed: Handle = function () {
    const embed = this.getData("embedStack").pop();

    if (!embed) return;
    if (Object.values(embed).every((v) => !v)) return;

    if (!embed.extension) {
      const anchor = embed.block
        ? `#${embed.block}`
        : embed.headings?.length
        ? `#${embed.headings.at(-1)}`
        : "";

      this.tag(`<embed inline-content src="${embed.value}${anchor}" />`);
      return;
    }

    if (embed.extension === "pdf") {
      const params =
        embed.pdfParams &&
        Object.entries(embed.pdfParams)
          .map(([key, value]: [string, unknown]) => `${key}="${value}"`)
          .join(" ") + " ";
      this.tag(
        `<embed src="${embed.value}" type="application/pdf" ${params ?? ""}/>`
      );
      return;
    }

    this.tag(
      `<embed src="${embed.value}" type="${mime.getType(embed.extension)}" />`
    );
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
