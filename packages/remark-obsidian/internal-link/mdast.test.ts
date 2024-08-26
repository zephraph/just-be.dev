import { test, expect } from "vitest";
import { fromMarkdown } from "mdast-util-from-markdown";
import { fromMarkdown as internalLinkFromMarkdown } from "./mdast";
import { syntax } from "./syntax";

function parse(markdown: string) {
  return fromMarkdown(markdown, {
    extensions: [syntax()],
    mdastExtensions: [internalLinkFromMarkdown()],
  });
}

test("[[Internal Link]]", () => {
  expect(parse("[[Internal Link]]")).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "alias": null,
              "block": null,
              "data": {
                "hChildren": [
                  {
                    "type": "text",
                    "value": "Internal Link",
                  },
                ],
                "hName": "a",
                "hProperties": {
                  "href": "/internal-link",
                },
              },
              "headings": [],
              "position": {
                "end": {
                  "column": 18,
                  "line": 1,
                  "offset": 17,
                },
                "start": {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "type": "internalLink",
              "value": "Internal Link",
            },
          ],
          "position": {
            "end": {
              "column": 18,
              "line": 1,
              "offset": 17,
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
          "column": 18,
          "line": 1,
          "offset": 17,
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

test("[[Internal Link|Alias]]", () => {
  expect(parse("[[Internal Link|Alias]]")).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "alias": "Alias",
              "block": null,
              "data": {
                "hChildren": [
                  {
                    "type": "text",
                    "value": "Alias",
                  },
                ],
                "hName": "a",
                "hProperties": {
                  "href": "/internal-link",
                },
              },
              "headings": [],
              "position": {
                "end": {
                  "column": 24,
                  "line": 1,
                  "offset": 23,
                },
                "start": {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "type": "internalLink",
              "value": "Internal Link",
            },
          ],
          "position": {
            "end": {
              "column": 24,
              "line": 1,
              "offset": 23,
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
          "column": 24,
          "line": 1,
          "offset": 23,
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

test("[[Internal Link#Main Section]]", () => {
  expect(parse("[[Internal Link#Main Section]]")).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "alias": null,
              "block": null,
              "data": {
                "hChildren": [
                  {
                    "type": "text",
                    "value": "Internal Link > Main Section",
                  },
                ],
                "hName": "a",
                "hProperties": {
                  "href": "/internal-link#main-section",
                },
              },
              "headings": [
                "Main Section",
              ],
              "position": {
                "end": {
                  "column": 31,
                  "line": 1,
                  "offset": 30,
                },
                "start": {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "type": "internalLink",
              "value": "Internal Link",
            },
          ],
          "position": {
            "end": {
              "column": 31,
              "line": 1,
              "offset": 30,
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
          "column": 31,
          "line": 1,
          "offset": 30,
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

test("[[Internal Link#Main Section|Alias]]", () => {
  expect(parse("[[Internal Link#Main Section|Alias]]")).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "alias": "Alias",
              "block": null,
              "data": {
                "hChildren": [
                  {
                    "type": "text",
                    "value": "Alias",
                  },
                ],
                "hName": "a",
                "hProperties": {
                  "href": "/internal-link#main-section",
                },
              },
              "headings": [
                "Main Section",
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
              "type": "internalLink",
              "value": "Internal Link",
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

test("[[Internal Link#Main Section#Sub Section]]", () => {
  expect(
    parse("[[Internal Link#Main Section#Sub Section]]")
  ).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "alias": null,
              "block": null,
              "data": {
                "hChildren": [
                  {
                    "type": "text",
                    "value": "Internal Link > Main Section > Sub Section",
                  },
                ],
                "hName": "a",
                "hProperties": {
                  "href": "/internal-link#main-section#sub-section",
                },
              },
              "headings": [
                "Main Section",
                "Sub Section",
              ],
              "position": {
                "end": {
                  "column": 43,
                  "line": 1,
                  "offset": 42,
                },
                "start": {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "type": "internalLink",
              "value": "Internal Link",
            },
          ],
          "position": {
            "end": {
              "column": 43,
              "line": 1,
              "offset": 42,
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
          "column": 43,
          "line": 1,
          "offset": 42,
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

test("[[Internal Link#Main Section#Sub Section|Alias]]", () => {
  expect(
    parse("[[Internal Link#Main Section#Sub Section|Alias]]")
  ).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "alias": "Alias",
              "block": null,
              "data": {
                "hChildren": [
                  {
                    "type": "text",
                    "value": "Alias",
                  },
                ],
                "hName": "a",
                "hProperties": {
                  "href": "/internal-link#main-section#sub-section",
                },
              },
              "headings": [
                "Main Section",
                "Sub Section",
              ],
              "position": {
                "end": {
                  "column": 49,
                  "line": 1,
                  "offset": 48,
                },
                "start": {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "type": "internalLink",
              "value": "Internal Link",
            },
          ],
          "position": {
            "end": {
              "column": 49,
              "line": 1,
              "offset": 48,
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
          "column": 49,
          "line": 1,
          "offset": 48,
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

test("[[Internal Link#^Abc123]]", () => {
  expect(parse("[[Internal Link#^Abc123]]")).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "alias": null,
              "block": "Abc123",
              "data": {
                "hChildren": [
                  {
                    "type": "text",
                    "value": "Internal Link > ^Abc123",
                  },
                ],
                "hName": "a",
                "hProperties": {
                  "href": "/internal-link#^abc123",
                },
              },
              "headings": [],
              "position": {
                "end": {
                  "column": 26,
                  "line": 1,
                  "offset": 25,
                },
                "start": {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "type": "internalLink",
              "value": "Internal Link",
            },
          ],
          "position": {
            "end": {
              "column": 26,
              "line": 1,
              "offset": 25,
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
          "column": 26,
          "line": 1,
          "offset": 25,
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

test("[[Internal Link#^Abc123|Alias]]", () => {
  expect(parse("[[Internal Link#^Abc123|Alias]]")).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "alias": "Alias",
              "block": "Abc123",
              "data": {
                "hChildren": [
                  {
                    "type": "text",
                    "value": "Alias",
                  },
                ],
                "hName": "a",
                "hProperties": {
                  "href": "/internal-link#^abc123",
                },
              },
              "headings": [],
              "position": {
                "end": {
                  "column": 32,
                  "line": 1,
                  "offset": 31,
                },
                "start": {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "type": "internalLink",
              "value": "Internal Link",
            },
          ],
          "position": {
            "end": {
              "column": 32,
              "line": 1,
              "offset": 31,
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
          "column": 32,
          "line": 1,
          "offset": 31,
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

test("[[#Main Section]]", () => {
  expect(parse("[[#Main Section]]")).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "alias": null,
              "block": null,
              "data": {
                "hChildren": [
                  {
                    "type": "text",
                    "value": "Main Section",
                  },
                ],
                "hName": "a",
                "hProperties": {
                  "href": "/#main-section",
                },
              },
              "headings": [
                "Main Section",
              ],
              "position": {
                "end": {
                  "column": 18,
                  "line": 1,
                  "offset": 17,
                },
                "start": {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "type": "internalLink",
              "value": null,
            },
          ],
          "position": {
            "end": {
              "column": 18,
              "line": 1,
              "offset": 17,
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
          "column": 18,
          "line": 1,
          "offset": 17,
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

test("[[#Main Section|Alias]]", () => {
  expect(parse("[[#Main Section|Alias]]")).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "alias": "Alias",
              "block": null,
              "data": {
                "hChildren": [
                  {
                    "type": "text",
                    "value": "Alias",
                  },
                ],
                "hName": "a",
                "hProperties": {
                  "href": "/#main-section",
                },
              },
              "headings": [
                "Main Section",
              ],
              "position": {
                "end": {
                  "column": 24,
                  "line": 1,
                  "offset": 23,
                },
                "start": {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "type": "internalLink",
              "value": null,
            },
          ],
          "position": {
            "end": {
              "column": 24,
              "line": 1,
              "offset": 23,
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
          "column": 24,
          "line": 1,
          "offset": 23,
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

test("[[#Main Section#Sub Section]]", () => {
  expect(parse("[[#Main Section#Sub Section]]")).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "alias": null,
              "block": null,
              "data": {
                "hChildren": [
                  {
                    "type": "text",
                    "value": "Main Section > Sub Section",
                  },
                ],
                "hName": "a",
                "hProperties": {
                  "href": "/#main-section#sub-section",
                },
              },
              "headings": [
                "Main Section",
                "Sub Section",
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
              "type": "internalLink",
              "value": null,
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

test("[[#Main Section#Sub Section|Alias]]", () => {
  expect(parse("[[#Main Section#Sub Section|Alias]]")).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "alias": "Alias",
              "block": null,
              "data": {
                "hChildren": [
                  {
                    "type": "text",
                    "value": "Alias",
                  },
                ],
                "hName": "a",
                "hProperties": {
                  "href": "/#main-section#sub-section",
                },
              },
              "headings": [
                "Main Section",
                "Sub Section",
              ],
              "position": {
                "end": {
                  "column": 36,
                  "line": 1,
                  "offset": 35,
                },
                "start": {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "type": "internalLink",
              "value": null,
            },
          ],
          "position": {
            "end": {
              "column": 36,
              "line": 1,
              "offset": 35,
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
          "column": 36,
          "line": 1,
          "offset": 35,
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

test("[[#^Abc123]]", () => {
  expect(parse("[[#^Abc123]]")).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "alias": null,
              "block": "Abc123",
              "data": {
                "hChildren": [
                  {
                    "type": "text",
                    "value": "^Abc123",
                  },
                ],
                "hName": "a",
                "hProperties": {
                  "href": "/#^abc123",
                },
              },
              "headings": [],
              "position": {
                "end": {
                  "column": 13,
                  "line": 1,
                  "offset": 12,
                },
                "start": {
                  "column": 1,
                  "line": 1,
                  "offset": 0,
                },
              },
              "type": "internalLink",
              "value": null,
            },
          ],
          "position": {
            "end": {
              "column": 13,
              "line": 1,
              "offset": 12,
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
          "column": 13,
          "line": 1,
          "offset": 12,
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

test("[[#^Abc123|Alias]]", () => {
  expect(parse("[[#^Abc123|Alias]]")).toMatchInlineSnapshot(`
    {
      "children": [
        {
          "children": [
            {
              "alias": "Alias",
              "block": "Abc123",
              "data": {
                "hChildren": [
                  {
                    "type": "text",
                    "value": "Alias",
                  },
                ],
                "hName": "a",
                "hProperties": {
                  "href": "/#^abc123",
                },
              },
              "headings": [],
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
              "type": "internalLink",
              "value": null,
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
