import { TokenTypeMap, CompileData } from "micromark-util-types";

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

  interface WikiLinkNode {
    target?: string;
    alias?: string;
    block?: string;
    headings?: string[];
  }

  export interface CompileData extends CompileData {
    wikiLinkStack: WikiLinkNode[];
  }
}
