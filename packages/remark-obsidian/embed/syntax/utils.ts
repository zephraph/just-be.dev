import { codifyString, codeOf } from "../../parser-utils";

import { internalLinkCode } from "../../internal-link/syntax/utils";

const { blockMarker, headingMarker, headingOrBlockStart } = internalLinkCode;

export const embedCode = {
  start: codifyString("![["),
  end: codifyString("]]"),

  extension: codifyString("."),

  dimension: codifyString("|"),
  dimensionSeparator: codifyString("x"),

  pdfParams: codifyString("#"),

  pdfParamSeparator: codifyString("&"),
  pdfKVSeparator: codifyString("="),

  blockMarker,
  headingMarker,
  headingOrBlockStart,
};
