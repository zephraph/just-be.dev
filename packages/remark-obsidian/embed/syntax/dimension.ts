import type { Construct, State } from "micromark-util-types";
import { embedCode } from "./utils";
import { createTokenizer, codifyString } from "../../parser-utils";
import { codes } from "micromark-util-symbol";
import { markdownLineEnding } from "micromark-util-character";

const digitCodes = codifyString("0123456789");

const tokenize = createTokenizer(({ effects, ok, nok, consumeMarker }) => {
  const start: State = (code) => {
    if (code !== embedCode.dimension[0]) return nok(code);

    effects.enter("embedDimensionMarker");

    return consumeMarker(code, embedCode.dimension, (code) => {
      effects.exit("embedDimensionMarker");
      return consumeDimension(code);
    });
  };

  // In the form 100 or 100x200
  let dimensionValues = 0;
  const consumeDimension: State = (code) => {
    if (code === codes.eof || markdownLineEnding(code)) {
      return nok(code);
    }

    if (embedCode.dimensionSeparator[0] === code) {
      return nok(code);
    }

    effects.enter("embedDimensionValue");
    dimensionValues++;
    return consumeDimensionValue(code);
  };

  const consumeDimensionValue: State = (code) => {
    if (code === codes.eof || markdownLineEnding(code)) {
      return nok(code);
    }

    if (code === embedCode.end[0]) {
      effects.exit("embedDimensionValue");
      return ok(code);
    }

    if (code === embedCode.dimensionSeparator[0] && dimensionValues === 1) {
      effects.enter("embedDimensionSeparator");
      return consumeMarker(code, embedCode.dimensionSeparator, (code) => {
        effects.exit("embedDimensionSeparator");
        return consumeDimension(code);
      });
    }

    if (digitCodes.includes(code)) {
      effects.consume(code);
      return consumeDimensionValue;
    }

    return nok(code);
  };

  return start;
});

export const embedDimension: Construct = {
  tokenize,
};
