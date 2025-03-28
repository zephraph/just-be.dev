/**
 * Inspired by https://nuro.dev/posts/how_to_use_astro_with_hono/
 */

import { Hono } from "hono";
import type { APIContext, APIRoute } from "astro";
import { bearerAuth } from "hono/bearer-auth";
import { isULID, isValidSha256, slugify } from "~/utils";

// A way to alias tags to different slugs
const tagMap = {
  recurse: "rc",
};

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
  .post("/notes/:id", async (c) => {
    const id = c.req.param("id");
    const props: Record<string, any> = c.req.query();
    const draft = props.stage === "draft";

    // Construct the slug
    let slug = props.slug || slugify(props.title);
    if (isULID(slug)) {
      throw new Error("Title and H1s should not be a ULID");
    }

    const tags = props.tags?.split(",").filter(Boolean) ?? [];
    const primaryTag = tags[0];
    // Set the prefix URL to the first tag (or its mapped value) if it exists
    if (primaryTag && primaryTag !== slug) {
      slug = `${
        tagMap[primaryTag as keyof typeof tagMap] ?? primaryTag
      }/${slug}`;
    }

    if (!draft && !props.homepage) {
      await c.env.KV_MAPPINGS.get(slug).then((mappedID) => {
        if (mappedID && mappedID !== id) {
          throw new Error(`Slug ${slug} is already mapped to ${mappedID}`);
        }
        return Promise.all([
          c.env.KV_MAPPINGS.put(slug, id),
          c.env.KV_MAPPINGS.put(id, slug),
        ]);
      });
    }

    // This is pulled out because cf will included undefined values as a string
    // in the metadata which I don't want.
    const customMetadata: Record<string, string> = {
      slug,
    };
    ["stage", "title", "published", "updated", "tags"].forEach((key) => {
      if (props[key]) {
        customMetadata[key] = props[key];
      }
    });

    const result = await c.env.R2_BUCKET.put(id, await c.req.blob(), {
      onlyIf: { etagDoesNotMatch: c.req.header("If-None-Match") },
      customMetadata,
    });
    if (!result) return c.json({ error: "Failed to upload" }, 500);
    const { size, version, httpEtag: etag } = result;
    return c.json({ ok: true, size, version }, 200, { etag });
  })
  .post("/assets/:filePath", async (c) => {
    const originalPath = c.req.query("path");
    const filePath = c.req.param("filePath");
    const fileName = filePath.split(".")[0];

    if (!isValidSha256(fileName)) {
      return c.json({ error: "Invalid file name: File must be SHA256" }, 400);
    }
    const result = await c.env.R2_ASSETS.put(filePath, await c.req.blob(), {
      onlyIf: { etagDoesNotMatch: c.req.header("If-None-Match") },
    });
    if (!result) return c.json({ error: "Failed to upload" }, 500);

    if (originalPath) {
      c.executionCtx.waitUntil(c.env.KV_MAPPINGS.put(originalPath, filePath));
    }

    if (!("body" in result)) {
      // Note to self: 304s MUST have a null body
      // see https://github.com/honojs/hono/issues/2971#issuecomment-2167437708
      return new Response(null, {
        status: 304,
        headers: { ETag: result.etag },
      });
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
