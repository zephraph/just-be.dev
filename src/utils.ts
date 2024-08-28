export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-#\/\.]/g, "");

export const isValidSha256 = (hashString: string) =>
  /^[a-fA-F0-9]{64}$/.test(hashString);
