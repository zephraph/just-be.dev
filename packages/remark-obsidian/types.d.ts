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
}
declare module "micromark-util-types" {
  export interface TokenTypeMap extends TokenTypeMap {
    internalLink: "internalLink";
    internalLinkMarker: "internalLinkMarker";
    internalLinkTarget: "internalLinkTarget";
    internalLinkAliasMarker: "internalLinkAliasMarker";
    internalLinkAlias: "internalLinkAlias";
    internalLinkHeadingMarker: "internalLinkHeadingMarker";
    internalLinkHeading: "internalLinkHeading";
    internalLinkBlockMarker: "internalLinkBlockMarker";
    internalLinkBlock: "internalLinkBlock";

    embed: "embed";
    embedMarker: "embedMarker";
  }

  export { InternalLinkNode };

  export interface CompileData extends CompileData {
    internalLinkStack: internalLinkNode[];
  }
}

declare module "mdast" {
  export type Nodes = Root | RootContent | internalLinkNode;
}
