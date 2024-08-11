import type { Code, Construct, State } from "micromark-util-types";
import { wikiCode } from "./utils";
import { createTokenizer } from "../../parser-utils";
import {
  markdownLineEnding,
  markdownLineEndingOrSpace,
} from "micromark-util-character";
import { codes } from "micromark-util-symbol";

const tokenize = createTokenizer(({ effects, ok, nok, consumeMarker }) => {
  const start = (code: Code) => {
    if (code !== wikiCode.headingOrBlockStart) return nok(code);

    effects.enter("wikiLinkHeadingMarker");

    return consumeMarker(code, wikiCode.headingMarker, (code) => {
      effects.exit("wikiLinkHeadingMarker");
      effects.enter("wikiLinkHeading");
      return consumeHeading(code);
    });
  };

  let hasHeading = false;
  const consumeHeading: State = (code: Code) => {
    if (code === codes.eof || markdownLineEnding(code)) {
      return nok(code);
    }

    if (code === wikiCode.aliasStart) {
      if (!hasHeading) return nok(code);
      effects.exit("wikiLinkHeading");
      return ok(code);
    }

    if (code === wikiCode.end) {
      if (!hasHeading) return nok(code);
      effects.exit("wikiLinkHeading");
      return ok(code);
    }

    if (code === wikiCode.headingOrBlockStart) {
      if (!hasHeading) return nok(code);
      effects.exit("wikiLinkHeading");
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

export const wikiLinkHeading: Construct = {
  tokenize,
};
