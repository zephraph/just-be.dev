import type { Code, Effects, State } from "micromark-util-types";

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
    return tokenizer({
      effects,
      ok,
      nok,
      consumeMarker: consumeMarker({ effects, nok, ok }),
    });
  };
}
