import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { remarkObsidian } from ".";
import { expect, test } from "vitest";

const md = await createMarkdownProcessor({
  remarkPlugins: [remarkObsidian],
});

test("[[Internal Links]]", async () => {
  const { code } = await md.render("[[Internal Links]]");
  expect(code).toContain('<a href="/internal-links">Internal Links</a>');
});

test("[[Internal Links|Alias]]", async () => {
  const { code } = await md.render("[[Internal Links|Alias]]");
  expect(code).toContain('<a href="/internal-links">Alias</a>');
});

test("[[Internal Links#Main Section]]", async () => {
  const { code } = await md.render("[[Internal Links#Main Section]]");
  expect(code).toContain(
    '<a href="/internal-links#main-section">Internal Links > Main Section</a>'
  );
});

test("[[Internal Links#Main Section|Alias]]", async () => {
  const { code } = await md.render("[[Internal Links#Main Section|Alias]]");
  expect(code).toContain('<a href="/internal-links#main-section">Alias</a>');
});

test("[[Internal Links#Main Section#Sub Section]]", async () => {
  const { code } = await md.render(
    "[[Internal Links#Main Section#Sub Section]]"
  );
  expect(code).toContain(
    '<a href="/internal-links#main-section#sub-section">Internal Links > Main Section > Sub Section</a>'
  );
});

test("[[Internal Links#Main Section#Sub Section|Alias]]", async () => {
  const { code } = await md.render(
    "[[Internal Links#Main Section#Sub Section|Alias]]"
  );
  expect(code).toContain(
    '<a href="/internal-links#main-section#sub-section">Alias</a>'
  );
});

test("[[Internal Links#^Abc-123]]", async () => {
  const { code } = await md.render("[[Internal Links#^Abc-123]]");
  expect(code).toContain(
    '<a href="/internal-links#^abc-123">Internal Links > ^Abc-123</a>'
  );
});

test("[[Internal Links#^Abc-123|Alias]]", async () => {
  const { code } = await md.render("[[Internal Links#^Abc-123|Alias]]");
  expect(code).toContain('<a href="/internal-links#^abc-123">Alias</a>');
});

test("[[#Main Section]]", async () => {
  const { code } = await md.render("[[#Main Section]]");
  expect(code).toContain('<a href="/#main-section">Main Section</a>');
});

test("[[#Main Section|Alias]]", async () => {
  const { code } = await md.render("[[#Main Section|Alias]]");
  expect(code).toContain('<a href="/#main-section">Alias</a>');
});

test("[[#Main Section#Sub Section]]", async () => {
  const { code } = await md.render("[[#Main Section#Sub Section]]");
  expect(code).toContain(
    '<a href="/#main-section#sub-section">Main Section > Sub Section</a>'
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
