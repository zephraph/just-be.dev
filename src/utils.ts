export const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

export const isValidSha256 = (hashString: string) =>
  /^[a-fA-F0-9]{64}$/.test(hashString);
