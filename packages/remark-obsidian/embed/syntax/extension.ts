import type {
  Code,
  Construct,
  State,
  TokenTypeMap,
} from "micromark-util-types";
import { codeOf, codifyString, createTokenizer } from "../../parser-utils";
import { embedCode } from "./utils";
import { codes } from "micromark-util-symbol";
import { markdownLineEnding } from "micromark-util-character";
import { embedPdfExtension } from "./pdfExtension";

const digitCodes = codifyString("0123456789");

interface EmbedTokenizerOptions {
  extensionCodes: number[][];
}
const tokenize = (opts: EmbedTokenizerOptions) =>
  createTokenizer(({ effects, ok, nok, consumeMarker }) => {
    const start = (code: Code) => {
      if (code !== embedCode.extension[0]) return nok(code);

      effects.enter("embedExtensionMarker");

      return consumeMarker(code, embedCode.extension, (code) => {
        effects.exit("embedExtensionMarker");
        effects.enter("embedExtension");
        // Short circuit PDF extension
        if (code === codeOf("p")) {
          return effects.attempt(embedPdfExtension, ok, consumeExtension)(code);
        }
        return consumeExtension(code);
      });
    };

    let extensions = opts.extensionCodes;
    let extensionIndex = 0;
    const consumeExtension: State = (code) => {
      if (code === codes.eof || markdownLineEnding(code)) {
        return nok(code);
      }

      if (code === embedCode.end[0]) {
        if (
          extensions.length === 1 &&
          extensions[0].length === extensionIndex
        ) {
          effects.exit("embedExtension");
          effects.exit("embedTarget");
          return ok(code);
        }
        return nok(code);
      }

      if (
        code === embedCode.dimension[0] &&
        extensions.length === 1 &&
        extensions[0].length === extensionIndex
      ) {
        effects.enter("embedDimensionMarker");
        return consumeMarker(code, embedCode.dimension, (code) => {
          effects.exit("embedDimensionMarker");
          return consumeDimension(code);
        });
      }

      if (code === embedCode.pdfParams[0]) {
        // Should never happen because PDFs should be handled above
        return nok(code);
      }

      extensions = extensions.filter(
        (extension) => extension[extensionIndex] === code
      );

      if (extensions.length === 0) {
        return nok(code);
      }

      effects.consume(code);
      extensionIndex++;
      return consumeExtension;
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

interface EmbedExtensionOptions {
  supportedExtensions: readonly string[];
}

export const embedExtension = (opts: EmbedExtensionOptions): Construct => {
  const extensionCodes = Array.from(new Set(opts.supportedExtensions)).map(
    codifyString
  );
  return {
    tokenize: tokenize({ extensionCodes }),
  };
};
