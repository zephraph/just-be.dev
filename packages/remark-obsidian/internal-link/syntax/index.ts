import { internalLinkCode } from "./utils";
import { internalLink } from "./internal-link";

export function syntax() {
  return {
    text: { [internalLinkCode.start]: internalLink },
  };
}
