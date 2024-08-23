import { test, assert } from "vitest";
import { micromark } from "micromark";
import { html, syntax } from ".";

test("[[Internal Link]]", () => {
  let serialized = micromark("[[Internal Link]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(serialized, '<p><a href="/internal-link">Internal Link</a></p>');
});

test("[[Internal Link|Alias]]", () => {
  let serialized = micromark("[[Internal Link|Alias]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(serialized, '<p><a href="/internal-link">Alias</a></p>');
});

test("[[Internal Link#Main Section]]", () => {
  let serialized = micromark("[[Internal Link#Main Section]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><a href="/internal-link#main-section">Internal Link > Main Section</a></p>'
  );
});

test("[[Internal Link#Main Section|Alias]]", () => {
  let serialized = micromark("[[Internal Link#Main Section|Alias]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><a href="/internal-link#main-section">Alias</a></p>'
  );
});

test("[[Internal Link#Main Section#Sub Section]]", () => {
  let serialized = micromark("[[Internal Link#Main Section#Sub Section]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><a href="/internal-link#main-section#sub-section">Internal Link > Main Section > Sub Section</a></p>'
  );
});

test("[[Internal Link#Main Section#Sub Section|Alias]]", () => {
  let serialized = micromark(
    "[[Internal Link#Main Section#Sub Section|Alias]]",
    {
      extensions: [syntax()],
      htmlExtensions: [html()],
    }
  );

  assert.equal(
    serialized,
    '<p><a href="/internal-link#main-section#sub-section">Alias</a></p>'
  );
});

test("[[Internal Link#^Abc123]]", () => {
  let serialized = micromark("[[Internal Link#^Abc123]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><a href="/internal-link#^abc123">Internal Link > ^Abc123</a></p>'
  );
});

test("[[Internal Link#^Abc123|Alias]]", () => {
  let serialized = micromark("[[Internal Link#^Abc123|Alias]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(serialized, '<p><a href="/internal-link#^abc123">Alias</a></p>');
});

test("[[#Main Section]]", () => {
  let serialized = micromark("[[#Main Section]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(serialized, '<p><a href="/#main-section">Main Section</a></p>');
});

test("[[#Main Section|Alias]]", () => {
  let serialized = micromark("[[#Main Section|Alias]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(serialized, '<p><a href="/#main-section">Alias</a></p>');
});

test("[[#Main Section#Sub Section]]", () => {
  let serialized = micromark("[[#Main Section#Sub Section]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><a href="/#main-section#sub-section">Main Section > Sub Section</a></p>'
  );
});

test("[[#Main Section#Sub Section|Alias]]", () => {
  let serialized = micromark("[[#Main Section#Sub Section|Alias]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><a href="/#main-section#sub-section">Alias</a></p>'
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
