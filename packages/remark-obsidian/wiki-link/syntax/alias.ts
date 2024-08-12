import type { Code, Construct } from "micromark-util-types";
import { wikiCode } from "./utils";
import { codes } from "micromark-util-symbol";
import {
  markdownLineEnding,
  markdownLineEndingOrSpace,
} from "micromark-util-character";
import { createTokenizer } from "../../parser-utils";

const tokenize = createTokenizer(({ effects, ok, nok, consumeMarker }) => {
  const start = (code: Code) => {
    if (code !== wikiCode.aliasStart) return nok(code);

    effects.enter("wikiLinkAliasMarker");

    return consumeMarker(code, wikiCode.aliasMarker, (code) => {
      effects.exit("wikiLinkAliasMarker");
      effects.enter("wikiLinkAlias");
      return consumeAlias(code);
    });
  };

  let hasAlias = false;
  const consumeAlias = (code: Code) => {
    if (code === codes.eof || markdownLineEnding(code)) {
      return nok(code);
    }

    if (code === wikiCode.end) {
      if (!hasAlias) return nok(code);
      effects.exit("wikiLinkAlias");
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

export const wikiLinkAlias: Construct = {
  tokenize,
};
