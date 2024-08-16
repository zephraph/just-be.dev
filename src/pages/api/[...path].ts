/**
 * Inspired by https://nuro.dev/posts/how_to_use_astro_with_hono/
 */

import { Hono } from "hono";
import type { APIContext, APIRoute } from "astro";
import { bearerAuth } from "hono/bearer-auth";
import { etag } from "hono/etag";

export const prerender = false;

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
  .use("/publish/*", etag())
  .post("/publish/:id", async (c) => {
    const id = c.req.param("id");
    const props: Record<string, any> = c.req.query();
    if (props.slugs) {
      const slugs = props.slugs.split(/[\s,]+/).filter(Boolean);
      await Promise.all(
        slugs.map((slug: string) =>
          c.env.KV_MAPPINGS.get(slug).then((currentId) => {
            if (currentId) {
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
  });

export const ALL: APIRoute = (astroContext) => {
  return app.fetch(
    astroContext.request,
    Object.assign(astroContext, astroContext.locals.runtime.env),
    astroContext.locals.runtime.ctx
  );
};
