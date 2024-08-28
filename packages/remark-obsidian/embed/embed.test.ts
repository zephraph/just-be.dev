import { test, assert } from "vitest";
import { micromark } from "micromark";
import { html, syntax } from ".";

// uncomment this to see the parser debug info
// import { vi } from "vitest";
// vi.stubEnv("DEBUG_PARSER", "1");

test("![[Internal Link]]", () => {
  let serialized = micromark("![[Internal Link]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(serialized, '<p><object data="/internal-link"></object></p>');
});

test("![[Internal Link.pdf]]", () => {
  let serialized = micromark("![[Internal Link.pdf]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><object data="/assets/internal-link.pdf" type="application/pdf"></object></p>'
  );
});

test("![[Internal Link.pdf#width=100&height=200]]", () => {
  let serialized = micromark("![[Internal Link.pdf#width=100&height=200]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><object data="/assets/internal-link.pdf" type="application/pdf" width="100" height="200"></object></p>'
  );
});

test("![[Internal Link.pdf#page=5]]", () => {
  let serialized = micromark("![[Internal Link.pdf#page=5]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><object data="/assets/internal-link.pdf" type="application/pdf" page="5"></object></p>'
  );
});

test("![[Internal Link.pdf#page=5&zoom=2]]", () => {
  let serialized = micromark("![[Internal Link.pdf#page=5&zoom=2]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><object data="/assets/internal-link.pdf" type="application/pdf" page="5" zoom="2"></object></p>'
  );
});

test("![[Internal Link.jpg]]", () => {
  let serialized = micromark("![[Internal Link.jpg]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><object data="/assets/internal-link.jpg" type="image/jpeg"></object></p>'
  );
});

test("![[Internal Link.mp3]]", () => {
  let serialized = micromark("![[Internal Link.mp3]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><object data="/assets/internal-link.mp3" type="audio/mpeg"></object></p>'
  );
});

test("![[Internal Link.mp4]]", () => {
  let serialized = micromark("![[Internal Link.mp4]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><object data="/assets/internal-link.mp4" type="video/mp4"></object></p>'
  );
});

test("![[Internal Link#Section]]", () => {
  let serialized = micromark("![[Internal Link#Section]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><object data="/internal-link#section"></object></p>'
  );
});

test("![[Internal Link#^block-id]]", () => {
  let serialized = micromark("![[Internal Link#^block-id]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><object data="/internal-link#block-id"></object></p>'
  );
});
