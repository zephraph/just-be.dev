import type { Code, Construct } from "micromark-util-types";
import { internalLinkCode } from "./utils";
import { codes } from "micromark-util-symbol";
import {
  markdownLineEnding,
  markdownLineEndingOrSpace,
} from "micromark-util-character";
import { createTokenizer } from "../../parser-utils";

const tokenize = createTokenizer(({ effects, ok, nok, consumeMarker }) => {
  const start = (code: Code) => {
    if (code !== internalLinkCode.aliasStart) return nok(code);

    effects.enter("internalLinkAliasMarker");

    return consumeMarker(code, internalLinkCode.aliasMarker, (code) => {
      effects.exit("internalLinkAliasMarker");
      effects.enter("internalLinkAlias");
      return consumeAlias(code);
    });
  };

  let hasAlias = false;
  const consumeAlias = (code: Code) => {
    if (code === codes.eof || markdownLineEnding(code)) {
      return nok(code);
    }

    if (code === internalLinkCode.end) {
      if (!hasAlias) return nok(code);
      effects.exit("internalLinkAlias");
      return ok(code);
    }

    if (!markdownLineEndingOrSpace(code)) {
      hasAlias = true;
    }

    effects.consume(code);
    return consumeAlias;
  };

  return start;
});

export const internalLinkAlias: Construct = {
  tokenize,
};
