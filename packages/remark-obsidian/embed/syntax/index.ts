import { embed } from "./embed";
import { embedCode } from "./utils";

export function syntax() {
  return {
    text: { [embedCode.start[0]]: embed() },
  };
}
