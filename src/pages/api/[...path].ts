/**
 * Inspired by https://nuro.dev/posts/how_to_use_astro_with_hono/
 */

import { Hono } from "hono";
import type { APIContext, APIRoute } from "astro";
import { bearerAuth } from "hono/bearer-auth";
import { etag } from "hono/etag";

const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

const isValidSha256 = (hashString: string) =>
  /^[a-fA-F0-9]{64}$/.test(hashString);

// Dump cf env in top level of context
type AstroContext = APIContext & APIContext["locals"]["runtime"]["env"];

const app = new Hono<{ Bindings: AstroContext }>()
  .basePath("/api/")
  .use("*", (c, next) => {
    if (process.env.NODE_ENV === "development") {
      return next();
    }
    return bearerAuth({ token: c.env.PUBLISH_KEY })(c, next);
  })
  .use(etag())
  .post("/notes/:id", async (c) => {
    const id = c.req.param("id");
    const props: Record<string, any> = c.req.query();
    // Alises (as stored in obsidian) are treated as slugs for navigation
    if (props.aliases) {
      const slugs: string[] = props.aliases
        .split(",")
        .filter(Boolean)
        .map(slugify);
      await Promise.all(
        slugs.map((slug) =>
          c.env.KV_MAPPINGS.get(slug).then((currentId) => {
            if (currentId) {
              // Mappings are immutable. If a slug is already mapped to a different id, throw an error.
              if (currentId !== id) {
                throw new Error(`Slug ${slug} is mapped to ${currentId}`);
              }
              return;
            }
            return c.env.KV_MAPPINGS.put(slug, id);
          })
        )
      );
    }
    const result = await c.env.R2_BUCKET.put(id, await c.req.blob(), {
      onlyIf: { etagDoesNotMatch: c.req.header("If-None-Match") },
    });
    if (!result) return c.json({ error: "Failed to upload" }, 500);
    const { size, version, httpEtag: etag } = result;
    return c.json({ ok: true, size, version }, 200, { etag });
  })
  .post("/assets/:filePath", async (c) => {
    const filePath = c.req.param("filePath");
    const fileName = filePath.split(".")[0];
    if (!isValidSha256(fileName)) {
      return c.json({ error: "Invalid file name: File must be SHA256" }, 400);
    }
    const result = await c.env.R2_ASSETS.put(filePath, await c.req.blob(), {
      onlyIf: { etagDoesNotMatch: c.req.header("If-None-Match") },
    });
    if (!result) return c.json({ error: "Failed to upload" }, 500);

    if (!("body" in result)) {
      return c.status(304);
    }

    const { size, version, httpEtag: etag } = result;
    return c.json({ ok: true, size, version }, 200, { etag });
  });

export const ALL: APIRoute = (astroContext) => {
  return app.fetch(
    astroContext.request,
    Object.assign(astroContext, astroContext.locals.runtime.env),
    astroContext.locals.runtime.ctx
  );
};
