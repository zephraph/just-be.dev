import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { remarkObsidian } from ".";
import { expect, test } from "vitest";

const md = await createMarkdownProcessor({
  remarkPlugins: [remarkObsidian],
});

test("Renders [[Wiki Links]]", async () => {
  const { code } = await md.render("[[Wiki Links]]");
  expect(code).toContain('<a href="/wiki-links">Wiki Links</a>');
});
