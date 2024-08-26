import { test, expect } from "vitest";
import { fromMarkdown } from "mdast-util-from-markdown";
import { fromMarkdown as embedFromMarkdown } from "./mdast";
import { syntax } from "./syntax";

function parse(markdown: string) {
  return fromMarkdown(markdown, {
    extensions: [syntax()],
    mdastExtensions: [embedFromMarkdown()],
  });
}

test("![[Internal Link]]", () => {
  expect(parse("![[Internal Link]]")).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "block": null,
              "data": {
                "hName": "embed",
                "hProperties": {
                  "src": "Internal Link",
                  "type": null,
                },
              },
              "dimensions": [],
              "extension": null,
              "headings": [],
              "pdfParams": {},
              "position": {
                "end": {
                  "column": 19,
                  "line": 1,
                  "offset": 18,
                },
                "start": {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "type": "embed",
              "value": "Internal Link",
            },
          ],
          "position": {
            "end": {
              "column": 19,
              "line": 1,
              "offset": 18,
            },
            "start": {
              "column": 1,
              "line": 1,
              "offset": 0,
            },
          },
          "type": "paragraph",
        },
      ],
      "position": {
        "end": {
          "column": 19,
          "line": 1,
          "offset": 18,
        },
        "start": {
          "column": 1,
          "line": 1,
          "offset": 0,
        },
      },
      "type": "root",
    }
  `);
});

test("![[Internal Link.pdf]]", () => {
  expect(parse("![[Internal Link.pdf]]")).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "block": null,
              "data": {
                "hName": "embed",
                "hProperties": {
                  "src": "Internal Link.pdf",
                  "type": "pdf",
                },
              },
              "dimensions": [],
              "extension": "pdf",
              "headings": [],
              "pdfParams": {},
              "position": {
                "end": {
                  "column": 23,
                  "line": 1,
                  "offset": 22,
                },
                "start": {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "type": "embed",
              "value": "Internal Link.pdf",
            },
          ],
          "position": {
            "end": {
              "column": 23,
              "line": 1,
              "offset": 22,
            },
            "start": {
              "column": 1,
              "line": 1,
              "offset": 0,
            },
          },
          "type": "paragraph",
        },
      ],
      "position": {
        "end": {
          "column": 23,
          "line": 1,
          "offset": 22,
        },
        "start": {
          "column": 1,
          "line": 1,
          "offset": 0,
        },
      },
      "type": "root",
    }
  `);
});

test("![[Internal Link.pdf#width=100&height=200]]", () => {
  expect(
    parse("![[Internal Link.pdf#width=100&height=200]]")
  ).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "block": null,
              "data": {
                "hName": "embed",
                "hProperties": {
                  "height": "200",
                  "src": "Internal Link.pdf",
                  "type": "pdf",
                  "width": "100",
                },
              },
              "dimensions": [],
              "extension": "pdf",
              "headings": [],
              "pdfParams": {
                "height": "200",
                "width": "100",
              },
              "position": {
                "end": {
                  "column": 44,
                  "line": 1,
                  "offset": 43,
                },
                "start": {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "type": "embed",
              "value": "Internal Link.pdf",
            },
          ],
          "position": {
            "end": {
              "column": 44,
              "line": 1,
              "offset": 43,
            },
            "start": {
              "column": 1,
              "line": 1,
              "offset": 0,
            },
          },
          "type": "paragraph",
        },
      ],
      "position": {
        "end": {
          "column": 44,
          "line": 1,
          "offset": 43,
        },
        "start": {
          "column": 1,
          "line": 1,
          "offset": 0,
        },
      },
      "type": "root",
    }
  `);
});

test("![[Internal Link.pdf#page=5]]", () => {
  expect(parse("![[Internal Link.pdf#page=5]]")).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "block": null,
              "data": {
                "hName": "embed",
                "hProperties": {
                  "page": "5",
                  "src": "Internal Link.pdf",
                  "type": "pdf",
                },
              },
              "dimensions": [],
              "extension": "pdf",
              "headings": [],
              "pdfParams": {
                "page": "5",
              },
              "position": {
                "end": {
                  "column": 30,
                  "line": 1,
                  "offset": 29,
                },
                "start": {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "type": "embed",
              "value": "Internal Link.pdf",
            },
          ],
          "position": {
            "end": {
              "column": 30,
              "line": 1,
              "offset": 29,
            },
            "start": {
              "column": 1,
              "line": 1,
              "offset": 0,
            },
          },
          "type": "paragraph",
        },
      ],
      "position": {
        "end": {
          "column": 30,
          "line": 1,
          "offset": 29,
        },
        "start": {
          "column": 1,
          "line": 1,
          "offset": 0,
        },
      },
      "type": "root",
    }
  `);
});

test("![[Internal Link.pdf#page=5&zoom=2]]", () => {
  expect(parse("![[Internal Link.pdf#page=5&zoom=2]]")).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "block": null,
              "data": {
                "hName": "embed",
                "hProperties": {
                  "page": "5",
                  "src": "Internal Link.pdf",
                  "type": "pdf",
                  "zoom": "2",
                },
              },
              "dimensions": [],
              "extension": "pdf",
              "headings": [],
              "pdfParams": {
                "page": "5",
                "zoom": "2",
              },
              "position": {
                "end": {
                  "column": 37,
                  "line": 1,
                  "offset": 36,
                },
                "start": {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "type": "embed",
              "value": "Internal Link.pdf",
            },
          ],
          "position": {
            "end": {
              "column": 37,
              "line": 1,
              "offset": 36,
            },
            "start": {
              "column": 1,
              "line": 1,
              "offset": 0,
            },
          },
          "type": "paragraph",
        },
      ],
      "position": {
        "end": {
          "column": 37,
          "line": 1,
          "offset": 36,
        },
        "start": {
          "column": 1,
          "line": 1,
          "offset": 0,
        },
      },
      "type": "root",
    }
  `);
});

test("![[Internal Link.jpg]]", () => {
  expect(parse("![[Internal Link.jpg]]")).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "block": null,
              "data": {
                "hName": "embed",
                "hProperties": {
                  "src": "Internal Link.jpg",
                  "type": "jpg",
                },
              },
              "dimensions": [],
              "extension": "jpg",
              "headings": [],
              "pdfParams": {},
              "position": {
                "end": {
                  "column": 23,
                  "line": 1,
                  "offset": 22,
                },
                "start": {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "type": "embed",
              "value": "Internal Link.jpg",
            },
          ],
          "position": {
            "end": {
              "column": 23,
              "line": 1,
              "offset": 22,
            },
            "start": {
              "column": 1,
              "line": 1,
              "offset": 0,
            },
          },
          "type": "paragraph",
        },
      ],
      "position": {
        "end": {
          "column": 23,
          "line": 1,
          "offset": 22,
        },
        "start": {
          "column": 1,
          "line": 1,
          "offset": 0,
        },
      },
      "type": "root",
    }
  `);
});

test("![[Internal Link.mp3]]", () => {
  expect(parse("![[Internal Link.mp3]]")).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "block": null,
              "data": {
                "hName": "embed",
                "hProperties": {
                  "src": "Internal Link.mp3",
                  "type": "mp3",
                },
              },
              "dimensions": [],
              "extension": "mp3",
              "headings": [],
              "pdfParams": {},
              "position": {
                "end": {
                  "column": 23,
                  "line": 1,
                  "offset": 22,
                },
                "start": {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "type": "embed",
              "value": "Internal Link.mp3",
            },
          ],
          "position": {
            "end": {
              "column": 23,
              "line": 1,
              "offset": 22,
            },
            "start": {
              "column": 1,
              "line": 1,
              "offset": 0,
            },
          },
          "type": "paragraph",
        },
      ],
      "position": {
        "end": {
          "column": 23,
          "line": 1,
          "offset": 22,
        },
        "start": {
          "column": 1,
          "line": 1,
          "offset": 0,
        },
      },
      "type": "root",
    }
  `);
});

test("![[Internal Link.mp4]]", () => {
  expect(parse("![[Internal Link.mp4]]")).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "block": null,
              "data": {
                "hName": "embed",
                "hProperties": {
                  "src": "Internal Link.mp4",
                  "type": "mp4",
                },
              },
              "dimensions": [],
              "extension": "mp4",
              "headings": [],
              "pdfParams": {},
              "position": {
                "end": {
                  "column": 23,
                  "line": 1,
                  "offset": 22,
                },
                "start": {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "type": "embed",
              "value": "Internal Link.mp4",
            },
          ],
          "position": {
            "end": {
              "column": 23,
              "line": 1,
              "offset": 22,
            },
            "start": {
              "column": 1,
              "line": 1,
              "offset": 0,
            },
          },
          "type": "paragraph",
        },
      ],
      "position": {
        "end": {
          "column": 23,
          "line": 1,
          "offset": 22,
        },
        "start": {
          "column": 1,
          "line": 1,
          "offset": 0,
        },
      },
      "type": "root",
    }
  `);
});

test("![[Internal Link#Section]]", () => {
  expect(parse("![[Internal Link#Section]]")).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "block": null,
              "data": {
                "hName": "embed",
                "hProperties": {
                  "src": "Internal Link",
                  "type": null,
                },
              },
              "dimensions": [],
              "extension": null,
              "headings": [
                "Section",
              ],
              "pdfParams": {},
              "position": {
                "end": {
                  "column": 27,
                  "line": 1,
                  "offset": 26,
                },
                "start": {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "type": "embed",
              "value": "Internal Link",
            },
          ],
          "position": {
            "end": {
              "column": 27,
              "line": 1,
              "offset": 26,
            },
            "start": {
              "column": 1,
              "line": 1,
              "offset": 0,
            },
          },
          "type": "paragraph",
        },
      ],
      "position": {
        "end": {
          "column": 27,
          "line": 1,
          "offset": 26,
        },
        "start": {
          "column": 1,
          "line": 1,
          "offset": 0,
        },
      },
      "type": "root",
    }
  `);
});

test("![[Internal Link#^block-id]]", () => {
  expect(parse("![[Internal Link#^block-id]]")).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "block": "block-id",
              "data": {
                "hName": "embed",
                "hProperties": {
                  "src": "Internal Link",
                  "type": null,
                },
              },
              "dimensions": [],
              "extension": null,
              "headings": [],
              "pdfParams": {},
              "position": {
                "end": {
                  "column": 29,
                  "line": 1,
                  "offset": 28,
                },
                "start": {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "type": "embed",
              "value": "Internal Link",
            },
          ],
          "position": {
            "end": {
              "column": 29,
              "line": 1,
              "offset": 28,
            },
            "start": {
              "column": 1,
              "line": 1,
              "offset": 0,
            },
          },
          "type": "paragraph",
        },
      ],
      "position": {
        "end": {
          "column": 29,
          "line": 1,
          "offset": 28,
        },
        "start": {
          "column": 1,
          "line": 1,
          "offset": 0,
        },
      },
      "type": "root",
    }
  `);
});
