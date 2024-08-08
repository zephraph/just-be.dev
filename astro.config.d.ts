declare module "remark-obsidian" {
  import type { RemarkPlugins } from "astro";
  const remarkObsidian: RemarkPlugins[number];
  export default remarkObsidian;
}
