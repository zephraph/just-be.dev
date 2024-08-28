/// <reference types="../../types.d.ts" />

import type { Code, Construct } from "micromark-util-types";
import { createTokenizer } from "../../parser-utils";
import { embedCode } from "./utils";
import { codes } from "micromark-util-symbol";
import { markdownLineEnding } from "micromark-util-character";
import { internalLinkBlock } from "../../internal-link/syntax/block";
import { internalLinkHeading } from "../../internal-link/syntax/heading";
import { embedExtension } from "./extension";
import { internalLinkAlias } from "../../internal-link/syntax/alias";

// prettier-ignore
const defaultSupportedExtensions = [ 
  // markdown
  "md",
  // images
  "avif", "bmp", "gif", "jpeg", "jpg", "png", "svg", "webp",
  // audio
  "flac", "m4a", "mp3", "ogg", "wav", "webm", "3gp",
  // video
  "mkv", "mov", "mp4", "ogv", "webm",
  // pdf
  "pdf",
] as const;

interface EmbedTokenizerOptions {
  supportedExtensions?: readonly string[];
}

const tokenize = ({
  supportedExtensions = defaultSupportedExtensions,
}: EmbedTokenizerOptions) =>
  createTokenizer(({ effects, ok, nok, consumeMarker }) => {
    function start(code: Code) {
      if (code !== embedCode.start[0]) return nok(code);

      effects.enter("embed");
      effects.enter("embedStartMarker");

      return consumeMarker(code, embedCode.start, (code) => {
        effects.exit("embedStartMarker");
        effects.enter("embedTarget");
        return consumeContents(code);
      });
    }

    function consumeContents(code: Code) {
      if (code === codes.eof || markdownLineEnding(code)) {
        return nok(code);
      }

      if (code === embedCode.extension[0]) {
        return effects.attempt(
          embedExtension({ supportedExtensions }),
          consumeEnd,
          (code) => effects.consume(code) && consumeContents
        )(code);
      }

      if (code === embedCode.headingOrBlockStart) {
        effects.exit("embedTarget");
        return effects.attempt(
          internalLinkBlock,
          consumeAliasOrEnd,
          consumeHeadings
        )(code);
      }

      if (code === embedCode.aliasMarker[0]) {
        effects.exit("embedTarget");
        return effects.attempt(internalLinkAlias, consumeEnd)(code);
      }

      if (code === embedCode.end[0]) {
        effects.exit("embedTarget");
        return consumeEnd(code);
      }

      effects.consume(code);
      return consumeContents;
    }

    function consumeHeadings(code: Code) {
      return effects.attempt(
        internalLinkHeading,
        consumeAliasOrEnd,
        consumeEnd
      )(code);
    }

    function consumeAliasOrEnd(code: Code) {
      return code === embedCode.aliasMarker[0]
        ? effects.attempt(internalLinkAlias, consumeEnd)(code)
        : consumeEnd(code);
    }

    function consumeEnd(code: Code) {
      effects.enter("embedEndMarker");
      return consumeMarker(code, embedCode.end, (code) => {
        effects.exit("embedEndMarker");
        effects.exit("embed");
        return ok(code);
      });
    }

    return start;
  });

export interface EmbedSyntaxOptions {
  /** Specify additional extensions to be supported by embedding */
  supportedExtensions?: string[];
}

export const embed = ({
  supportedExtensions = [],
  ...others
}: EmbedSyntaxOptions = {}): Construct => {
  return {
    tokenize: tokenize({
      supportedExtensions: Array.from(
        new Set(supportedExtensions.concat(defaultSupportedExtensions))
      ),
      ...others,
    }),
  };
};
/// <reference types="../../types.d.ts" />

import type { Code, Construct } from "micromark-util-types";
import { createTokenizer } from "../../parser-utils";
import { embedCode } from "./utils";
import { codes } from "micromark-util-symbol";
import { markdownLineEnding } from "micromark-util-character";
import { internalLinkBlock } from "../../internal-link/syntax/block";
import { internalLinkHeading } from "../../internal-link/syntax/heading";
import { embedExtension } from "./extension";
import { internalLinkAlias } from "../../internal-link/syntax/alias";

// prettier-ignore
const defaultSupportedExtensions = [ 
  // markdown
  "md",
  // images
  "avif", "bmp", "gif", "jpeg", "jpg", "png", "svg", "webp",
  // audio
  "flac", "m4a", "mp3", "ogg", "wav", "webm", "3gp",
  // video
  "mkv", "mov", "mp4", "ogv", "webm",
  // pdf
  "pdf",
] as const;

interface EmbedTokenizerOptions {
  supportedExtensions?: readonly string[];
}

const tokenize = ({
  supportedExtensions = defaultSupportedExtensions,
}: EmbedTokenizerOptions) =>
  createTokenizer(({ effects, ok, nok, consumeMarker }) => {
    function start(code: Code) {
      if (code !== embedCode.start[0]) return nok(code);

      effects.enter("embed");
      effects.enter("embedStartMarker");

      return consumeMarker(code, embedCode.start, (code) => {
        effects.exit("embedStartMarker");
        effects.enter("embedTarget");
        return consumeContents(code);
      });
    }

    function consumeContents(code: Code) {
      if (code === codes.eof || markdownLineEnding(code)) {
        return nok(code);
      }

      if (code === embedCode.extension[0]) {
        return effects.attempt(
          embedExtension({ supportedExtensions }),
          consumeEnd,
          (code) => effects.consume(code) && consumeContents
        )(code);
      }

      if (code === embedCode.headingOrBlockStart) {
        effects.exit("embedTarget");
        return effects.attempt(
          internalLinkBlock,
          consumeAliasOrEnd,
          consumeHeadings
        )(code);
      }

      if (code === embedCode.aliasMarker[0]) {
        effects.exit("embedTarget");
        return effects.attempt(internalLinkAlias, consumeEnd)(code);
      }

      if (code === embedCode.end[0]) {
        effects.exit("embedTarget");
        return consumeEnd(code);
      }

      effects.consume(code);
      return consumeContents;
    }

    function consumeHeadings(code: Code) {
      return effects.attempt(
        internalLinkHeading,
        consumeAliasOrEnd,
        consumeEnd
      )(code);
    }

    function consumeAliasOrEnd(code: Code) {
      return code === embedCode.aliasMarker[0]
        ? effects.attempt(internalLinkAlias, consumeEnd)(code)
        : consumeEnd(code);
    }

    function consumeEnd(code: Code) {
      effects.enter("embedEndMarker");
      return consumeMarker(code, embedCode.end, (code) => {
        effects.exit("embedEndMarker");
        effects.exit("embed");
        return ok(code);
      });
    }

    return start;
  });

export interface EmbedSyntaxOptions {
  /** Specify additional extensions to be supported by embedding */
  supportedExtensions?: string[];
}

export const embed = ({
  supportedExtensions = [],
  ...others
}: EmbedSyntaxOptions = {}): Construct => {
  return {
    tokenize: tokenize({
      supportedExtensions: Array.from(
        new Set(supportedExtensions.concat(defaultSupportedExtensions))
      ),
      ...others,
    }),
  };
};
