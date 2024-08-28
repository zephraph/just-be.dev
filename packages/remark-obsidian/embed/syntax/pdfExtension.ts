import type { Code, Construct, State } from "micromark-util-types";
import { codifyString, createTokenizer } from "../../parser-utils";
import { codes } from "micromark-util-symbol";
import { markdownLineEnding } from "micromark-util-character";
import { embedCode } from "./utils";
import { internalLinkAlias } from "../../internal-link/syntax/alias";

const pdfMarker = codifyString("pdf");

const tokenize = createTokenizer(({ effects, ok, nok, consumeMarker }) => {
  const start = (code: Code) => {
    if (code !== pdfMarker[0]) return nok(code);

    effects.enter("embedPdfExtension");

    return consumeMarker(code, pdfMarker, (code) => {
      effects.exit("embedPdfExtension");
      // Note: This scope is left open by extension parser
      // and has to be closed here given this is a special case
      effects.exit("embedExtension");
      effects.exit("embedTarget");
      return consumePdfParams(code);
    });
  };

  const consumePdfParams = (code: Code) => {
    if (code === codes.eof || markdownLineEnding(code)) {
      return nok(code);
    }

    if (code === embedCode.end[0]) {
      return ok(code);
    }

    if (code === embedCode.aliasMarker[0]) {
      return effects.attempt(internalLinkAlias, ok)(code);
    }

    if (code === embedCode.pdfParams[0]) {
      effects.enter("embedPdfParamsMarker");
      return consumeMarker(code, embedCode.pdfParams, (code) => {
        effects.exit("embedPdfParamsMarker");
        effects.enter("embedPdfParams");
        return consumePdfParamKey(code);
      });
    }

    return nok(code);
  };

  let keyLen = 0;
  const consumePdfParamKey: State = (code) => {
    if (code === codes.eof || markdownLineEnding(code)) {
      return nok(code);
    }

    if (code === embedCode.pdfKVSeparator[0]) {
      if (keyLen === 0) {
        return nok(code);
      }

      keyLen = 0;
      effects.exit("embedPdfParamKey");
      effects.enter("embedPdfKVSeparator");
      return consumeMarker(code, embedCode.pdfKVSeparator, (code) => {
        effects.exit("embedPdfKVSeparator");
        effects.enter("embedPdfParamValue");
        return consumePdfParamValue(code);
      });
    }

    if (code === embedCode.pdfParamSeparator[0]) {
      return nok(code);
    }

    if (code === embedCode.end[0]) {
      return nok(code);
    }

    if (keyLen === 0) {
      effects.enter("embedPdfParam");
      effects.enter("embedPdfParamKey");
    }
    effects.consume(code);
    keyLen++;

    return consumePdfParamKey;
  };

  let valueLen = 0;
  const consumePdfParamValue: State = (code) => {
    if (code === codes.eof || markdownLineEnding(code)) {
      return nok(code);
    }

    if (code === embedCode.pdfParamSeparator[0]) {
      effects.exit("embedPdfParamValue");
      effects.exit("embedPdfParam");
      effects.enter("embedPdfParamSeparator");
      return consumeMarker(code, embedCode.pdfParamSeparator, (code) => {
        effects.exit("embedPdfParamSeparator");
        valueLen = 0;
        return consumePdfParamKey(code);
      });
    }

    if (code === embedCode.aliasMarker[0]) {
      effects.exit("embedPdfParamValue");
      effects.exit("embedPdfParam");
      effects.exit("embedPdfParams");
      return effects.attempt(internalLinkAlias, ok)(code);
    }

    if (code === embedCode.end[0]) {
      effects.exit("embedPdfParamValue");
      effects.exit("embedPdfParam");
      effects.exit("embedPdfParams");
      return ok(code);
    }

    effects.consume(code);
    valueLen++;
    return consumePdfParamValue;
  };

  return start;
});

export const embedPdfExtension: Construct = {
  tokenize,
};
