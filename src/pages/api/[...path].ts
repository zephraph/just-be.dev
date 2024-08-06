/**
 * Inspired by https://nuro.dev/posts/how_to_use_astro_with_hono/
 */

import { Hono } from "hono";
import type { APIContext, APIRoute } from "astro";

export const prerender = false;

const app = new Hono<{ Bindings: APIContext }>()
  .basePath("/api/")
  .post("/publish", async (context) => {
    console.log("env", context.env);
  });

export const ALL: APIRoute = (astroContext) => {
  return app.fetch(astroContext.request, astroContext);
};
