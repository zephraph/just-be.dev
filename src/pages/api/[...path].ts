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
  .use("*", (c, next) => bearerAuth({ token: c.env.PUBLISH_KEY })(c, next))
  .use("/publish/*", etag())
  .post("/publish/:id", async (c) => {
    const result = await c.env.R2_BUCKET.put(
      c.req.param("id"),
      await c.req.blob()
    );
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
