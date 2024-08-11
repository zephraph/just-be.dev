/// <reference types="../types.d.ts" />

import type { Code, Construct, Tokenizer } from "micromark-util-types";
import { codes } from "micromark-util-symbol";
import {
  markdownLineEndingOrSpace,
  markdownLineEnding,
} from "micromark-util-character";
import { wikiCode } from "./utils";
import { createTokenizer } from "../../parser-utils";
import { wikiLinkBlock } from "./block";
import { wikiLinkAlias } from "./alias";
import { wikiLinkHeading } from "./heading";

const tokenize = createTokenizer(({ effects, ok, nok, consumeMarker }) => {
  function start(code: Code) {
    if (code !== wikiCode.start) return nok(code);

    effects.enter("wikiLink");
    effects.enter("wikiLinkMarker");

    return consumeMarker(code, wikiCode.startMarker, (code) => {
      effects.exit("wikiLinkMarker");
      return consumeContents(code);
    });
  }

  function consumeContents(code: Code) {
    if (code === codes.eof || markdownLineEnding(code)) {
      return nok(code);
    }

    if (code === wikiCode.headingOrBlockStart) {
      return effects.attempt(
        wikiLinkBlock,
        consumeAliasOrEnd,
        consumeHeadings
      )(code);
    }

    effects.enter("wikiLinkTarget");
    return consumeTarget(code);
  }

  function consumeAliasOrEnd(code: Code) {
    return code === wikiCode.aliasStart
      ? effects.attempt(wikiLinkAlias, consumeEnd)(code)
      : consumeEnd(code);
  }

  function consumeHeadings(code: Code) {
    return effects.attempt(wikiLinkHeading, consumeAliasOrEnd)(code);
  }

  let hasTarget = false;
  function consumeTarget(code: Code) {
    if (code === wikiCode.end) {
      if (!hasTarget) return nok(code);
      effects.exit("wikiLinkTarget");
      return consumeEnd(code);
    }

    if (code === wikiCode.headingOrBlockStart) {
      if (!hasTarget) return nok(code);
      effects.exit("wikiLinkTarget");
      return effects.attempt(
        wikiLinkBlock,
        consumeAliasOrEnd,
        consumeHeadings
      )(code);
    }

    if (code === wikiCode.aliasStart) {
      if (!hasTarget) return nok(code);
      effects.exit("wikiLinkTarget");
      return effects.attempt(wikiLinkAlias, consumeEnd)(code);
    }

    if (code === codes.eof || markdownLineEnding(code)) {
      return nok(code);
    }

    if (!markdownLineEndingOrSpace(code)) {
      hasTarget = true;
    }

    effects.consume(code);

    return consumeTarget;
  }

  function consumeEnd(code: Code) {
    effects.enter("wikiLinkMarker");
    return consumeMarker(code, wikiCode.endMarker, (code) => {
      effects.exit("wikiLinkMarker");
      effects.exit("wikiLink");
      return ok(code);
    });
  }

  return start;
});

export const wikiLink: Construct = {
  tokenize,
};
