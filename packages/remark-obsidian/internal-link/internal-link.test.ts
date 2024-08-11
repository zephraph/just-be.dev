import { test, assert } from "vitest";
import { micromark } from "micromark";
import { html, syntax } from ".";

test("[[Wiki Link]]", () => {
  let serialized = micromark("[[Wiki Link]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(serialized, '<p><a href="/wiki_link">Wiki Link</a></p>');
});

test("[[Wiki Link|Alias]]", () => {
  let serialized = micromark("[[Wiki Link|Alias]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(serialized, '<p><a href="/wiki_link">Alias</a></p>');
});

test("[[Wiki Link#Main Section]]", () => {
  let serialized = micromark("[[Wiki Link#Main Section]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><a href="/wiki_link#main_section">Wiki Link > Main Section</a></p>'
  );
});

test("[[Wiki Link#Main Section|Alias]]", () => {
  let serialized = micromark("[[Wiki Link#Main Section|Alias]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><a href="/wiki_link#main_section">Alias</a></p>'
  );
});

test("[[Wiki Link#Main Section#Sub Section]]", () => {
  let serialized = micromark("[[Wiki Link#Main Section#Sub Section]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><a href="/wiki_link#main_section#sub_section">Wiki Link > Main Section > Sub Section</a></p>'
  );
});

test("[[Wiki Link#Main Section#Sub Section|Alias]]", () => {
  let serialized = micromark("[[Wiki Link#Main Section#Sub Section|Alias]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><a href="/wiki_link#main_section#sub_section">Alias</a></p>'
  );
});

test("[[Wiki Link#^Abc123]]", () => {
  let serialized = micromark("[[Wiki Link#^Abc123]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><a href="/wiki_link#^abc123">Wiki Link > ^Abc123</a></p>'
  );
});

test("[[Wiki Link#^Abc123|Alias]]", () => {
  let serialized = micromark("[[Wiki Link#^Abc123|Alias]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(serialized, '<p><a href="/wiki_link#^abc123">Alias</a></p>');
});

test("[[#Main Section]]", () => {
  let serialized = micromark("[[#Main Section]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(serialized, '<p><a href="/#main_section">Main Section</a></p>');
});

test("[[#Main Section|Alias]]", () => {
  let serialized = micromark("[[#Main Section|Alias]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(serialized, '<p><a href="/#main_section">Alias</a></p>');
});

test("[[#Main Section#Sub Section]]", () => {
  let serialized = micromark("[[#Main Section#Sub Section]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><a href="/#main_section#sub_section">Main Section > Sub Section</a></p>'
  );
});

test("[[#Main Section#Sub Section|Alias]]", () => {
  let serialized = micromark("[[#Main Section#Sub Section|Alias]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><a href="/#main_section#sub_section">Alias</a></p>'
  );
});

test("[[#^Abc123]]", () => {
  let serialized = micromark("[[#^Abc123]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(serialized, '<p><a href="/#^abc123">^Abc123</a></p>');
});

test("[[#^Abc123|Alias]]", () => {
  let serialized = micromark("[[#^Abc123|Alias]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(serialized, '<p><a href="/#^abc123">Alias</a></p>');
});
