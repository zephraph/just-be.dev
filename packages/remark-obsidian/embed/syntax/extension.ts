import type { Code, Construct, State } from "micromark-util-types";
import { codeOf, codifyString, createTokenizer } from "../../parser-utils";
import { embedCode } from "./utils";
import { codes } from "micromark-util-symbol";
import { markdownLineEnding } from "micromark-util-character";
import { embedPdfExtension } from "./pdfExtension";
import { embedDimension } from "./dimension";
import { internalLinkAlias } from "../../internal-link/syntax/alias";

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
        effects.exit("embedExtension");
        effects.exit("embedTarget");
        return effects.attempt(embedDimension, ok, (code) =>
          effects.attempt(internalLinkAlias, ok)(code)
        )(code);
      }

      if (code === embedCode.aliasMarker[0]) {
        effects.exit("embedExtension");
        effects.exit("embedTarget");

        return effects.attempt(internalLinkAlias, ok)(code);
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
import type { Code, Construct, State } from "micromark-util-types";
import { codeOf, codifyString, createTokenizer } from "../../parser-utils";
import { embedCode } from "./utils";
import { codes } from "micromark-util-symbol";
import { markdownLineEnding } from "micromark-util-character";
import { embedPdfExtension } from "./pdfExtension";
import { embedDimension } from "./dimension";
import { internalLinkAlias } from "../../internal-link/syntax/alias";

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
        effects.exit("embedExtension");
        effects.exit("embedTarget");
        return effects.attempt(embedDimension, ok, (code) =>
          effects.attempt(internalLinkAlias, ok)(code)
        )(code);
      }

      if (code === embedCode.aliasMarker[0]) {
        effects.exit("embedExtension");
        effects.exit("embedTarget");

        return effects.attempt(internalLinkAlias, ok)(code);
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
