import {
  markdownLineEnding,
  markdownLineEndingOrSpace,
} from "micromark-util-character";
import { codes } from "micromark-util-symbol";
import type { Code, Construct } from "micromark-util-types";
import { internalLinkCode } from "./utils";
import { createTokenizer } from "../../parser-utils";

const tokenize = createTokenizer(({ effects, ok, nok, consumeMarker }) => {
  const start = (code: Code) => {
    if (code !== internalLinkCode.headingOrBlockStart) return nok(code);

    effects.enter("internalLinkBlockMarker");

    return consumeMarker(code, internalLinkCode.blockMarker, (code) => {
      effects.exit("internalLinkBlockMarker");
      effects.enter("internalLinkBlock");
      return consumeBlock(code);
    });
  };

  let hasBlockContent = false;
  const consumeBlock = (code: Code) => {
    if (code === codes.eof || markdownLineEnding(code)) {
      return nok(code);
    }

    if (code === internalLinkCode.aliasStart) {
      if (!hasBlockContent) return nok(code);
      effects.exit("internalLinkBlock");
      return ok(code);
    }

    if (code === internalLinkCode.end) {
      if (!hasBlockContent) return nok(code);
      effects.exit("internalLinkBlock");
      return ok(code);
    }

    if (!markdownLineEndingOrSpace(code)) {
      hasBlockContent = true;
    }

    effects.consume(code);
    return consumeBlock;
  };

  return start;
});

export const internalLinkBlock: Construct = {
  tokenize,
};
