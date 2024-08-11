import { wikiLink } from "./syntax/wiki-link";
import { wikiCode } from "./syntax/utils";

export function syntax() {
  return {
    text: { [wikiCode.start]: wikiLink },
  };
}

export { html } from "./html";
