import {
  markdownLineEnding,
  markdownLineEndingOrSpace,
} from "micromark-util-character";
import { codes } from "micromark-util-symbol";
import type { Code, Construct } from "micromark-util-types";
import { wikiCode } from "./utils";
import { createTokenizer } from "../../parser-utils";

const tokenize = createTokenizer(({ effects, ok, nok, consumeMarker }) => {
  const start = (code: Code) => {
    if (code !== wikiCode.headingOrBlockStart) return nok(code);

    effects.enter("wikiLinkBlockMarker");

    return consumeMarker(code, wikiCode.blockMarker, (code) => {
      effects.exit("wikiLinkBlockMarker");
      effects.enter("wikiLinkBlock");
      return consumeBlock(code);
    });
  };

  let hasBlockContent = false;
  const consumeBlock = (code: Code) => {
    if (code === codes.eof || markdownLineEnding(code)) {
      return nok(code);
    }

    if (code === wikiCode.aliasStart) {
      if (!hasBlockContent) return nok(code);
      effects.exit("wikiLinkBlock");
      return ok(code);
    }

    if (code === wikiCode.end) {
      if (!hasBlockContent) return nok(code);
      effects.exit("wikiLinkBlock");
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

export const wikiLinkBlock: Construct = {
  tokenize,
};
