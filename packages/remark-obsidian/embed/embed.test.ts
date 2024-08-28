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

  assert.equal(
    serialized,
    '<p><embed inline-content src="Internal Link" /></p>'
  );
});

test("![[Internal Link.pdf]]", () => {
  let serialized = micromark("![[Internal Link.pdf]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><embed src="Internal Link.pdf" type="application/pdf" /></p>'
  );
});

test("![[Internal Link.pdf#width=100&height=200]]", () => {
  let serialized = micromark("![[Internal Link.pdf#width=100&height=200]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><embed src="Internal Link.pdf" type="application/pdf" width="100" height="200" /></p>'
  );
});

test("![[Internal Link.pdf#page=5]]", () => {
  let serialized = micromark("![[Internal Link.pdf#page=5]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><embed src="Internal Link.pdf" type="application/pdf" page="5" /></p>'
  );
});

test("![[Internal Link.pdf#page=5&zoom=2]]", () => {
  let serialized = micromark("![[Internal Link.pdf#page=5&zoom=2]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><embed src="Internal Link.pdf" type="application/pdf" page="5" zoom="2" /></p>'
  );
});

test("![[Internal Link.jpg]]", () => {
  let serialized = micromark("![[Internal Link.jpg]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><embed src="Internal Link.jpg" type="image/jpeg" /></p>'
  );
});

test("![[Internal Link.mp3]]", () => {
  let serialized = micromark("![[Internal Link.mp3]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><embed src="Internal Link.mp3" type="audio/mpeg" /></p>'
  );
});

test("![[Internal Link.mp4]]", () => {
  let serialized = micromark("![[Internal Link.mp4]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><embed src="Internal Link.mp4" type="video/mp4" /></p>'
  );
});

test("![[Internal Link#Section]]", () => {
  let serialized = micromark("![[Internal Link#Section]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><embed inline-content src="Internal Link#Section" /></p>'
  );
});

test("![[Internal Link#^block-id]]", () => {
  let serialized = micromark("![[Internal Link#^block-id]]", {
    extensions: [syntax()],
    htmlExtensions: [html()],
  });

  assert.equal(
    serialized,
    '<p><embed inline-content src="Internal Link#block-id" /></p>'
  );
});
