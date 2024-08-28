import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { remarkObsidian } from ".";
import { expect, test } from "vitest";

const md = await createMarkdownProcessor({
  remarkPlugins: [remarkObsidian()],
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
    '<a href="/internal-links#abc-123">Internal Links > ^Abc-123</a>'
  );
});

test("[[Internal Links#^Abc-123|Alias]]", async () => {
  const { code } = await md.render("[[Internal Links#^Abc-123|Alias]]");
  expect(code).toContain('<a href="/internal-links#abc-123">Alias</a>');
});

test("[[#Main Section]]", async () => {
  const { code } = await md.render("[[#Main Section]]");
  expect(code).toContain('<a href="#main-section">Main Section</a>');
});

test("[[#Main Section|Alias]]", async () => {
  const { code } = await md.render("[[#Main Section|Alias]]");
  expect(code).toContain('<a href="#main-section">Alias</a>');
});

test("[[#Main Section#Sub Section]]", async () => {
  const { code } = await md.render("[[#Main Section#Sub Section]]");
  expect(code).toContain(
    '<a href="#main-section#sub-section">Main Section > Sub Section</a>'
  );
});

test("[[#^Abc-123]]", async () => {
  const { code } = await md.render("[[#^Abc-123]]");
  expect(code).toContain('<a href="#abc-123">^Abc-123</a>');
});

test("[[#^Abc-123|Alias]]", async () => {
  const { code } = await md.render("[[#^Abc-123|Alias]]");
  expect(code).toContain('<a href="#abc-123">Alias</a>');
});

// New embed tests
test("![[Internal Link]]", async () => {
  const { code } = await md.render("![[Internal Link]]");
  expect(code).toContain('<p><object data="/internal-link"></object></p>');
});

test("![[Internal Link|Alias]]", async () => {
  const { code } = await md.render("![[Internal Link|Alias]]");
  expect(code).toContain(
    '<p><object data="/internal-link" title="Alias"></object></p>'
  );
});

test("![[Internal Link.pdf]]", async () => {
  const { code } = await md.render("![[Internal Link.pdf]]");
  expect(code).toContain(
    '<p><object data="/assets/internal-link.pdf" type="application/pdf"></object></p>'
  );
});

test("![[Internal Link.pdf|Alias]]", async () => {
  const { code } = await md.render("![[Internal Link.pdf|Alias]]");
  expect(code).toContain(
    '<p><object data="/assets/internal-link.pdf" type="application/pdf" title="Alias"></object></p>'
  );
});

test("![[Internal Link.pdf#width=100&height=200]]", async () => {
  const { code } = await md.render(
    "![[Internal Link.pdf#width=100&height=200]]"
  );
  expect(code).toContain(
    '<p><object data="/assets/internal-link.pdf" type="application/pdf" width="100" height="200"></object></p>'
  );
});

test("![[Internal Link.pdf#width=100&height=200|Alias]]", async () => {
  const { code } = await md.render(
    "![[Internal Link.pdf#width=100&height=200|Alias]]"
  );
  expect(code).toContain(
    '<p><object data="/assets/internal-link.pdf" type="application/pdf" width="100" height="200" title="Alias"></object></p>'
  );
});

test("![[Internal Link.pdf#page=5]]", async () => {
  const { code } = await md.render("![[Internal Link.pdf#page=5]]");
  expect(code).toContain(
    '<p><object data="/assets/internal-link.pdf" type="application/pdf" page="5"></object></p>'
  );
});

test("![[Internal Link.pdf#page=5|Alias]]", async () => {
  const { code } = await md.render("![[Internal Link.pdf#page=5|Alias]]");
  expect(code).toContain(
    '<p><object data="/assets/internal-link.pdf" type="application/pdf" page="5" title="Alias"></object></p>'
  );
});

test("![[Internal Link.pdf#page=5&zoom=2]]", async () => {
  const { code } = await md.render("![[Internal Link.pdf#page=5&zoom=2]]");
  expect(code).toContain(
    '<p><object data="/assets/internal-link.pdf" type="application/pdf" page="5" zoom="2"></object></p>'
  );
});

test("![[Internal Link.pdf#page=5&zoom=2|Alias]]", async () => {
  const { code } = await md.render(
    "![[Internal Link.pdf#page=5&zoom=2|Alias]]"
  );
  expect(code).toContain(
    '<p><object data="/assets/internal-link.pdf" type="application/pdf" page="5" zoom="2" title="Alias"></object></p>'
  );
});

test("![[Internal Link.jpg]]", async () => {
  const { code } = await md.render("![[Internal Link.jpg]]");
  expect(code).toContain(
    '<p><img src="/assets/internal-link.jpg" type="image/jpeg"></p>'
  );
});

test("![[Internal Link.jpg|Alias]]", async () => {
  const { code } = await md.render("![[Internal Link.jpg|Alias]]");
  expect(code).toContain(
    '<p><img src="/assets/internal-link.jpg" alt="Alias" type="image/jpeg" title="Alias"></p>'
  );
});

test("![[Internal Link.mp3]]", async () => {
  const { code } = await md.render("![[Internal Link.mp3]]");
  expect(code).toContain(
    '<p><audio controls><source src="/assets/internal-link.mp3" type="audio/mpeg"></audio></p>'
  );
});

test("![[Internal Link.mp3|Alias]]", async () => {
  const { code } = await md.render("![[Internal Link.mp3|Alias]]");
  expect(code).toContain(
    '<p><audio controls title="Alias"><source src="/assets/internal-link.mp3" type="audio/mpeg"></audio></p>'
  );
});

test("![[Internal Link.mp4]]", async () => {
  const { code } = await md.render("![[Internal Link.mp4]]");
  expect(code).toContain(
    '<p><video controls><source src="/assets/internal-link.mp4" type="video/mp4"></video></p>'
  );
});

test("![[Internal Link.mp4|Alias]]", async () => {
  const { code } = await md.render("![[Internal Link.mp4|Alias]]");
  expect(code).toContain(
    '<p><video controls title="Alias"><source src="/assets/internal-link.mp4" type="video/mp4"></video></p>'
  );
});

test("![[Internal Link#Section]]", async () => {
  const { code } = await md.render("![[Internal Link#Section]]");
  expect(code).toContain(
    '<p><object data="/internal-link#section"></object></p>'
  );
});

test("![[Internal Link#Section|Alias]]", async () => {
  const { code } = await md.render("![[Internal Link#Section|Alias]]");
  expect(code).toContain(
    '<p><object data="/internal-link#section" title="Alias"></object></p>'
  );
});

test("![[Internal Link#^block-id]]", async () => {
  const { code } = await md.render("![[Internal Link#^block-id]]");
  expect(code).toContain(
    '<p><object data="/internal-link#block-id"></object></p>'
  );
});

test("![[Internal Link#^block-id|Alias]]", async () => {
  const { code } = await md.render("![[Internal Link#^block-id|Alias]]");
  expect(code).toContain(
    '<p><object data="/internal-link#block-id" title="Alias"></object></p>'
  );
});
