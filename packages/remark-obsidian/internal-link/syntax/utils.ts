import { codeOf, codifyString } from "../../parser-utils";

export const wikiCode = {
  startMarker: codifyString("[["),
  endMarker: codifyString("]]"),

  start: codeOf("["),
  end: codeOf("]"),

  blockMarker: codifyString("#^"),

  aliasMarker: codifyString("|"),
  aliasStart: codeOf("|"),

  headingOrBlockStart: codeOf("#"),
  headingMarker: codifyString("#"),
};
