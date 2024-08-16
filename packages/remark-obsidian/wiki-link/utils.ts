import type { WikiLinkNode } from "./types";

export const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

export const displayName = (wikiLink: WikiLinkNode) => {
  let displayName = wikiLink.alias ?? wikiLink.value ?? "";
  if (!wikiLink.alias && wikiLink.block) {
    displayName = displayName.length
      ? `${displayName} > ^${wikiLink.block}`
      : `^${wikiLink.block}`;
  }
  if (!wikiLink.alias && wikiLink.headings) {
    displayName = [displayName, ...wikiLink.headings]
      .filter((n) => n)
      .join(" > ");
  }
  return displayName;
};

export const href = (wikiLink: WikiLinkNode) => {
  const blockOrHeadings = wikiLink.block
    ? "#^" + wikiLink.block
    : wikiLink.headings?.length
    ? "#" + wikiLink.headings.join("#")
    : "";

  return slugify(
    wikiLink.value
      ? `/${wikiLink.value}${blockOrHeadings}`
      : `/${blockOrHeadings}`
  );
};
