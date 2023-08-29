import { Hono } from "hono";
import { appendContent, rewriteAttribute, rewriteContent } from "./rewriters";
const app = new Hono();

app.get("/_obsidian/assets/*", async (c) => {
  const path = c.req.path.replace(/\/_obsidian\/assets\//, "");
  if (path.includes("app.js")) {
    let app = await fetch(`https://publish.obsidian.md/${path}`).then((res) =>
      res.text()
    );
    app = app
      .replace(
        /this\.customurl=(\w+)\.customurl/,
        "this.customurl=window.location.origin"
      )
      .replace('"https://"+this.customurl', "this.customurl");
    return new Response(app, {
      headers: {
        "content-type": "application/javascript",
        "cache-control": "public, max-age=31536000",
      },
    });
  }
  return fetch(`https://publish.obsidian.md/${path}`);
});

app.get("/_obsidian/:prefix/*", async (c) => {
  const path = c.req.path.replace(/\/_obsidian\/(\d+)\//, "");
  return fetch(`https://publish-${c.req.param("prefix")}.obsidian.md/${path}`);
});

// Redirects from my old posts
app.get("/posts/:slug", async (c) => {
  const slug = c.req.param("slug");
  const redirectMap = {
    "export-import-indexeddb": "/-/01FCSNVWG0WNCZTS9JCMGQE3KS",
  };
  // http://127.0.0.1:8787/-/01FCSNVWG0WNCZTS9JCMGQE3KS
  // http://127.0.0.1:8787/-/01FCSNVWG0WNCZTS9JCMGQE3KS

  const redirect = redirectMap[slug as keyof typeof redirectMap];
  if (redirect) {
    return c.redirect(redirect, 301);
  } else {
    return c.notFound();
  }
});

app.get("/*", async (c) => {
  return fetch(`https://notes.just-be.dev/${c.req.url}`).then((res) => {
    const { origin } = new URL(c.req.url);
    return new HTMLRewriter()
      .on(
        "script",
        rewriteAttribute("src", (src) => {
          if (src.startsWith("/app.js")) {
            return `${origin}/_obsidian/assets${src}`;
          }
        })
      )
      .on(
        "script",
        rewriteContent((content) =>
          content
            .replace(
              /https:\/\/publish-(\d+)\.obsidian\.md/g,
              `${origin}/_obsidian/$1`
            )
            .replace(encodeURI(origin).replace(/:/g, "%3A") + "/", `About%20me`)
        )
      )
      .transform(res);
  });
});

app.options("/*", (c) => {
  console.log("option called");
  if (
    c.req.headers.get("Origin") !== null &&
    c.req.headers.get("Access-Control-Request-Method") !== null &&
    c.req.headers.get("Access-Control-Request-Headers") !== null
  ) {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Headers":
          c.req.headers.get("Access-Control-Request-Headers") || "",
      },
    });
  } else {
    return new Response(null, {
      headers: {
        Allow: "GET, HEAD, POST, OPTIONS",
      },
    });
  }
});

export default app;
