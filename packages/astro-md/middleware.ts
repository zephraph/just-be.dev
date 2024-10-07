/// <reference types="./middleware.d.ts" />

import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { defineMiddleware } from "astro:middleware";
import { myRemark } from "../my-remark";
import { remarkObsidian } from "../remark-obsidian";
import remarkFrontmatter from "remark-frontmatter";
import { isLangSupported } from "./syntax-highlighting";

// Cache for 30 days
const syntaxHighlightCacheTtl = 60 * 60 * 24 * 30;

const decode = (str: string) =>
  str.replace(/&#x(\w+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

const theme = "nord";

class SyntaxHighlightRewriter implements HTMLRewriterElementContentHandlers {
  private lang: string = "";
  private code: string = "";
  cache: KVNamespace;
  cacheVersion: string;
  skip: boolean = false;

  constructor(private runtime: Runtime["runtime"]) {
    this.cache = runtime.env.KV_HIGHLIGHT;
    this.cacheVersion = runtime.env.SYNTAX_VERSION;
  }

  element(element: Element) {
    this.lang = element.getAttribute("data-lang") ?? "";
    this.code = "";
    if (!isLangSupported(this.lang)) {
      element.removeAttribute("data-lang");
      element.removeAttribute("class");
      this.skip = true;
      return;
    }
    element.removeAndKeepContent();
  }
  async text(text: Text) {
    if (this.skip) return;
    this.code += decode(text.text);
    if (text.lastInTextNode) {
      const hashBuffer = await crypto.subtle.digest(
        "SHA-1",
        new TextEncoder().encode(`${theme}-${this.lang}-${this.code}`)
      );
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hash = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      const key = `${this.cacheVersion}:${hash}`;

      const cachedResult = await this.cache.get(key, {
        cacheTtl: syntaxHighlightCacheTtl,
      });
      if (cachedResult) {
        text.replace(cachedResult, { html: true });
        return;
      }
      // When setting cacheTtl, even misses are cached. If we've gotten
      // to this point the cache is empty, so let's clear the miss so that
      // the next request has the actual content (after we write it)
      this.runtime.ctx.waitUntil(this.cache.get(key));

      const res = await fetch(
        `https://just_be-highlight.web.val.run?lang=${this.lang}&theme=${theme}`,
        {
          method: "POST",
          body: this.code,
          headers: {
            Accept: "text/html",
          },
        }
      );
      if (!res.ok) {
        // Something went wrong with the request, just return the original code
        text.replace(`<code>${this.code}</code>`, { html: true });
        return;
      }
      const data = await res.text();
      this.runtime.ctx.waitUntil(this.cache.put(key, data));
      text.replace(data, { html: true });
    } else {
      text.remove();
    }
  }
}

export const onRequest = defineMiddleware(async (context, next) => {
  const fileResolver = async (path: string) => {
    return (await context.locals.runtime.env.KV_MAPPINGS.get(path)) ?? path;
  };
  const processor = await createMarkdownProcessor({
    remarkPlugins: [
      remarkFrontmatter,
      myRemark,
      remarkObsidian({ fileResolver }),
    ],
  });
  context.locals.render = processor.render;
  const res = await next();

  try {
    if (import.meta.env.DEV && typeof HTMLRewriter === "undefined") {
      // @ts-expect-error Isn't defined on globalThis, but that's fine
      globalThis.HTMLRewriter = (
        await import("@worker-tools/html-rewriter/base64")
      ).HTMLRewriter;
    }

    return new HTMLRewriter()
      .on(
        "code[data-lang]",
        new SyntaxHighlightRewriter(context.locals.runtime)
      )
      .transform(res);
  } catch (e) {
    console.error(e);
    return res;
  }
});
