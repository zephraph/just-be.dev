import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { remarkObsidian } from ".";
import { expect, test } from "vitest";

const md = await createMarkdownProcessor({
  remarkPlugins: [remarkObsidian],
});

test("[[Wiki Links]]", async () => {
  const { code } = await md.render("[[Wiki Links]]");
  expect(code).toContain('<a href="/wiki_links">Wiki Links</a>');
});

test("[[Wiki Links|Alias]]", async () => {
  const { code } = await md.render("[[Wiki Links|Alias]]");
  expect(code).toContain('<a href="/wiki_links">Alias</a>');
});

test("[[Wiki Links#Main Section]]", async () => {
  const { code } = await md.render("[[Wiki Links#Main Section]]");
  expect(code).toContain(
    '<a href="/wiki_links#main_section">Wiki Links > Main Section</a>'
  );
});

test("[[Wiki Links#Main Section|Alias]]", async () => {
  const { code } = await md.render("[[Wiki Links#Main Section|Alias]]");
  expect(code).toContain('<a href="/wiki_links#main_section">Alias</a>');
});

test("[[Wiki Links#Main Section#Sub Section]]", async () => {
  const { code } = await md.render("[[Wiki Links#Main Section#Sub Section]]");
  expect(code).toContain(
    '<a href="/wiki_links#main_section#sub_section">Wiki Links > Main Section > Sub Section</a>'
  );
});

test("[[Wiki Links#Main Section#Sub Section|Alias]]", async () => {
  const { code } = await md.render(
    "[[Wiki Links#Main Section#Sub Section|Alias]]"
  );
  expect(code).toContain(
    '<a href="/wiki_links#main_section#sub_section">Alias</a>'
  );
});

test("[[Wiki Links#^Abc-123]]", async () => {
  const { code } = await md.render("[[Wiki Links#^Abc-123]]");
  expect(code).toContain(
    '<a href="/wiki_links#^abc-123">Wiki Links > ^Abc-123</a>'
  );
});

test("[[Wiki Links#^Abc-123|Alias]]", async () => {
  const { code } = await md.render("[[Wiki Links#^Abc-123|Alias]]");
  expect(code).toContain('<a href="/wiki_links#^abc-123">Alias</a>');
});

test("[[#Main Section]]", async () => {
  const { code } = await md.render("[[#Main Section]]");
  expect(code).toContain('<a href="/#main_section">Main Section</a>');
});

test("[[#Main Section|Alias]]", async () => {
  const { code } = await md.render("[[#Main Section|Alias]]");
  expect(code).toContain('<a href="/#main_section">Alias</a>');
});

test("[[#Main Section#Sub Section]]", async () => {
  const { code } = await md.render("[[#Main Section#Sub Section]]");
  expect(code).toContain(
    '<a href="/#main_section#sub_section">Main Section > Sub Section</a>'
  );
});

test("[[#^Abc-123]]", async () => {
  const { code } = await md.render("[[#^Abc-123]]");
  expect(code).toContain('<a href="/#^abc-123">^Abc-123</a>');
});

test("[[#^Abc-123|Alias]]", async () => {
  const { code } = await md.render("[[#^Abc-123|Alias]]");
  expect(code).toContain('<a href="/#^abc-123">Alias</a>');
});
