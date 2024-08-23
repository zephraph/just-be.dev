import type { Code, Construct, State } from "micromark-util-types";
import { internalLinkCode } from "./utils";
import { createTokenizer } from "../../parser-utils";
import {
  markdownLineEnding,
  markdownLineEndingOrSpace,
} from "micromark-util-character";
import { codes } from "micromark-util-symbol";

const tokenize = createTokenizer(({ effects, ok, nok, consumeMarker }) => {
  const start = (code: Code) => {
    if (code !== internalLinkCode.headingOrBlockStart) return nok(code);

    effects.enter("internalLinkHeadingMarker");

    return consumeMarker(code, internalLinkCode.headingMarker, (code) => {
      effects.exit("internalLinkHeadingMarker");
      effects.enter("internalLinkHeading");
      return consumeHeading(code);
    });
  };

  let hasHeading = false;
  const consumeHeading: State = (code: Code) => {
    if (code === codes.eof || markdownLineEnding(code)) {
      return nok(code);
    }

    if (code === internalLinkCode.aliasStart) {
      if (!hasHeading) return nok(code);
      effects.exit("internalLinkHeading");
      return ok(code);
    }

    if (code === internalLinkCode.end) {
      if (!hasHeading) return nok(code);
      effects.exit("internalLinkHeading");
      return ok(code);
    }

    if (code === internalLinkCode.headingOrBlockStart) {
      if (!hasHeading) return nok(code);
      effects.exit("internalLinkHeading");
      // Reset the heading state for the next one
      hasHeading = false;
      return start(code);
    }

    if (!markdownLineEndingOrSpace(code)) {
      hasHeading = true;
    }

    effects.consume(code);
    return consumeHeading;
  };

  return start;
});

export const internalLinkHeading: Construct = {
  tokenize,
};
