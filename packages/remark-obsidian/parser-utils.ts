import type { Code, Effects, State, TokenTypeMap } from "micromark-util-types";

export const codeOf = (char: string) => char.charCodeAt(0);
export const codifyString = (str: string) => str.split("").map(codeOf);

interface TokenizerArgs {
  effects: Effects;
  ok: State;
  nok: State;
}

const consumeMarker =
  ({ effects, nok }: TokenizerArgs) =>
  (code: Code, marker: number[], done: State) => {
    let markerCursor = 0;
    function markerConsumer(code: Code) {
      if (markerCursor === marker.length) {
        return done(code);
      }

      if (code !== marker[markerCursor]) {
        return nok(code);
      }

      markerCursor++;
      effects.consume(code);
      return markerConsumer;
    }
    return markerConsumer(code);
  };

interface CustomTokenizerArgs extends TokenizerArgs {
  consumeMarker: (
    code: Code,
    marker: number[],
    done: State
  ) => State | undefined;
}
export function createTokenizer(
  tokenizer: (arg: CustomTokenizerArgs) => State
) {
  return function (effects: Effects, ok: State, nok: State) {
    if (
      process.env.NODE_ENV === "test" &&
      process.env.DEBUG_PARSER &&
      !(effects.enter as any)._isPatched
    ) {
      let stackDepth = 0;
      const oldEnter = effects.enter;
      const oldExit = effects.exit;
      const oldConsume = effects.consume;
      const buffer: string[] = [];
      const flush = () => {
        console.log(buffer.join(""));
        buffer.length = 0;
      };
      effects.enter = (name: keyof TokenTypeMap) => {
        flush();
        buffer.push(`${" ".repeat(stackDepth)}enter ${name} `);
        stackDepth++;
        return oldEnter(name);
      };
      // @ts-ignore
      effects.enter._isPatched = true;
      effects.exit = (name: keyof TokenTypeMap) => {
        flush();
        stackDepth--;
        buffer.push(`${" ".repeat(stackDepth)}exit  ${name} `);
        return oldExit(name);
      };
      effects.consume = (code: Code) => {
        buffer.push(`\x1b[90m${String.fromCharCode(code ?? -1)}\x1b[0m`);
        return oldConsume(code);
      };
    }
    return tokenizer({
      effects,
      ok,
      nok,
      consumeMarker: consumeMarker({ effects, nok, ok }),
    });
  };
}

/**
 * Safely interpolates values into a template string.
 * If any of the values are null or undefined, it returns an empty string.
 * Otherwise, it combines the strings and values, replacing undefined values with empty strings.
 *
 * @param {TemplateStringsArray} strings - The array of string literals in the template
 * @param {...any} values - The expressions to be interpolated
 * @returns {string} The resulting interpolated string, or an empty string if any value is null or undefined
 */
export function safeTpl(
  strings: TemplateStringsArray,
  ...values: any[]
): string {
  if (values.some((value) => value === null || value === undefined)) {
    return "";
  }
  return strings.reduce((result, string, i) => {
    return result + string + (values[i] || "");
  }, "");
}
