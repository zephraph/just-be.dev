import { slugify } from "~/utils";
import type { InternalLinkNode } from "../types";

export { slugify } from "~/utils";

export const displayName = (internalLink: InternalLinkNode) => {
  let displayName = internalLink.alias ?? internalLink.value ?? "";
  if (!internalLink.alias && internalLink.block) {
    displayName = displayName.length
      ? `${displayName} > ^${internalLink.block}`
      : `^${internalLink.block}`;
  }
  if (!internalLink.alias && internalLink.headings) {
    displayName = [displayName, ...internalLink.headings]
      .filter((n) => n)
      .join(" > ");
  }
  return displayName;
};

export const href = (
  internalLink: Pick<InternalLinkNode, "value" | "block" | "headings">
) => {
  const blockOrHeadings = internalLink.block
    ? "#^" + internalLink.block
    : internalLink.headings?.length
    ? "#" + internalLink.headings.join("#")
    : "";

  return slugify(
    internalLink.value
      ? `/${internalLink.value}${blockOrHeadings}`
      : `${blockOrHeadings}`
  );
};
