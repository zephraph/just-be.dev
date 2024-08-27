import { TokenTypeMap, CompileData } from "micromark-util-types";
import { Root, RootContent } from "mdast";

declare module "micromark-extension-internal-link" {
  export function syntax(options?: { aliasDivider?: string }): any;
}

export interface InternalLinkNode {
  type: "internalLink";
  value?: string | null;
  alias?: string | null;
  block?: string | null;
  headings?: string[] | null;
  data?: Record<string, any>;
}

export interface EmbedNode {
  type: "embed";
  value?: string | null;
  block?: string | null;
  headings?: string[] | null;
  extension?: string | null;
  pdfParams?: Record<string, string>;
  dimensions?: number[] | null;
  data?: Record<string, any>;
}

declare module "micromark-util-types" {
  export interface TokenTypeMap extends TokenTypeMap {
    internalLink: "internalLink";
    internalLinkStartMarker: "internalLinkStartMarker";
    internalLinkEndMarker: "internalLinkEndMarker";
    internalLinkTarget: "internalLinkTarget";
    internalLinkAliasMarker: "internalLinkAliasMarker";
    internalLinkAlias: "internalLinkAlias";
    internalLinkHeadingMarker: "internalLinkHeadingMarker";
    internalLinkHeading: "internalLinkHeading";
    internalLinkBlockMarker: "internalLinkBlockMarker";
    internalLinkBlock: "internalLinkBlock";

    embed: "embed";
    embedStartMarker: "embedStartMarker";
    embedEndMarker: "embedEndMarker";
    embedTarget: "embedTarget";
    embedExtensionMarker: "embedExtensionMarker";
    embedExtension: "embedExtension";
    embedDimensionMarker: "embedDimensionMarker";
    embedDimensionValue: "embedDimensionValue";
    embedDimensionSeparator: "embedDimensionSeparator";
    embedPdfExtension: "embedPdfExtension";

    embedPdfParamsMarker: "embedPdfParamsMarker";
    embedPdfParam: "embedPdfParam";
    embedPdfParams: "embedPdfParams";
    embedPdfParamKey: "embedPdfParamKey";
    embedPdfParamValue: "embedPdfParamValue";
    embedPdfKVSeparator: "embedPdfKVSeparator";
    embedPdfParamSeparator: "embedPdfParamSeparator";
  }

  export { InternalLinkNode, EmbedNode };

  export interface CompileData extends CompileData {
    internalLinkStack: internalLinkNode[];
    embedStack: embedNode[];
  }
}

declare module "mdast" {
  export type Nodes = Root | RootContent | internalLinkNode;
}
