/// <reference types="../../types.d.ts" />

import type { Code, Construct } from "micromark-util-types";
import { codes } from "micromark-util-symbol";
import {
  markdownLineEndingOrSpace,
  markdownLineEnding,
} from "micromark-util-character";
import { internalLinkCode } from "./utils";
import { createTokenizer } from "../../parser-utils";
import { internalLinkBlock } from "./block";
import { internalLinkAlias } from "./alias";
import { internalLinkHeading } from "./heading";

const tokenize = createTokenizer(({ effects, ok, nok, consumeMarker }) => {
  function start(code: Code) {
    if (code !== internalLinkCode.start) return nok(code);

    effects.enter("internalLink");
    effects.enter("internalLinkMarker");

    return consumeMarker(code, internalLinkCode.startMarker, (code) => {
      effects.exit("internalLinkMarker");
      return consumeContents(code);
    });
  }

  function consumeContents(code: Code) {
    if (code === codes.eof || markdownLineEnding(code)) {
      return nok(code);
    }

    if (code === internalLinkCode.headingOrBlockStart) {
      return effects.attempt(
        internalLinkBlock,
        consumeAliasOrEnd,
        consumeHeadings
      )(code);
    }

    effects.enter("internalLinkTarget");
    return consumeTarget(code);
  }

  function consumeAliasOrEnd(code: Code) {
    return code === internalLinkCode.aliasStart
      ? effects.attempt(internalLinkAlias, consumeEnd)(code)
      : consumeEnd(code);
  }

  function consumeHeadings(code: Code) {
    return effects.attempt(internalLinkHeading, consumeAliasOrEnd)(code);
  }

  let hasTarget = false;
  function consumeTarget(code: Code) {
    if (code === internalLinkCode.end) {
      if (!hasTarget) return nok(code);
      effects.exit("internalLinkTarget");
      return consumeEnd(code);
    }

    if (code === internalLinkCode.headingOrBlockStart) {
      if (!hasTarget) return nok(code);
      effects.exit("internalLinkTarget");
      return effects.attempt(
        internalLinkBlock,
        consumeAliasOrEnd,
        consumeHeadings
      )(code);
    }

    if (code === internalLinkCode.aliasStart) {
      if (!hasTarget) return nok(code);
      effects.exit("internalLinkTarget");
      return effects.attempt(internalLinkAlias, consumeEnd)(code);
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
    effects.enter("internalLinkMarker");
    return consumeMarker(code, internalLinkCode.endMarker, (code) => {
      effects.exit("internalLinkMarker");
      effects.exit("internalLink");
      return ok(code);
    });
  }

  return start;
});

export const internalLink: Construct = {
  tokenize,
};
