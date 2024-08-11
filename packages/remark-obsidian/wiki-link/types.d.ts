import { TokenTypeMap, CompileData } from "micromark-util-types";
import { Root, RootContent } from "mdast";

export interface WikiLinkNode {
  type: "wikiLink";
  value?: string | null;
  alias?: string | null;
  block?: string | null;
  headings?: string[] | null;
}
declare module "micromark-util-types" {
  export interface TokenTypeMap extends TokenTypeMap {
    wikiLink: "wikiLink";
    wikiLinkMarker: "wikiLinkMarker";
    wikiLinkTarget: "wikiLinkTarget";
    wikiLinkAliasMarker: "wikiLinkAliasMarker";
    wikiLinkAlias: "wikiLinkAlias";
    wikiLinkHeadingMarker: "wikiLinkHeadingMarker";
    wikiLinkHeading: "wikiLinkHeading";
    wikiLinkBlockMarker: "wikiLinkBlockMarker";
    wikiLinkBlock: "wikiLinkBlock";
  }

  export { WikiLinkNode };

  export interface CompileData extends CompileData {
    wikiLinkStack: WikiLinkNode[];
  }
}

declare module "mdast" {
  export type Nodes = Root | RootContent | WikiLinkNode;
}
