import type { APIRoute } from "astro";
import type { ReadStream } from "node:fs";

/**
 * Node's ReadStream is different than the ReadableStream used in the browser.
 * This function converts between the two without loading the entire file into memory.
 */
function readStreamToReadableStream(stream: ReadStream) {
  // Convert the ReadStream into an async iterator
  const iterator = (async function* nodeStreamToIterator() {
    for await (const chunk of stream) {
      yield chunk;
    }
  })();

  // Construct a ReadableStream from the async iterator
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(new Uint8Array(value as any));
      }
    },
  });
}

/**
 * For development only, stream static files from the file system
 */
async function staticFileResponse(filePath: string) {
  // This is wrapped in this if block so that it's removed from the production build
  if (process.env.NODE_ENV === "development") {
    const fs = await import("node:fs");
    const { default: mime } = await import("mime");
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const fileStream = fs.createReadStream(filePath);
    const readableStream = readStreamToReadableStream(fileStream);
    return new Response(readableStream, {
      status: 200,
      headers: {
        "X-Location": "static file",
        "Content-Type": mime.getType(filePath) || "application/octet-stream",
      },
    });
  }
  // This code path should never be reached, but if it does something definitely went wrong
  return new Response("Something went wrong", { status: 500 });
}

export const GET: APIRoute = async (ctx) => {
  // If we're in development let's just skip the lookup
  // and stream the file directly
  if (process.env.NODE_ENV === "development") {
    const localPath = "./notes" + ctx.url.pathname;
    let res = await staticFileResponse(localPath);
    if (res) return res;
  }

  const BUCKET = ctx.locals.runtime.env.R2_ASSETS;
  const KV = ctx.locals.runtime.env.KV_MAPPINGS;

  const filename = await KV.get(ctx.url.pathname);
  if (!filename) {
    return new Response("File not found", { status: 404 });
  }
  const res = await BUCKET.get(filename, {
    onlyIf: {
      // If the provided ETag matches the current ETag, we don't really want to fetch from the bucket
      etagDoesNotMatch: ctx.request.headers.get("If-None-Match") || "xxx",
    },
  });

  if (!res) {
    return new Response("File not found", { status: 404 });
  }

  // ETag hasn't changed so the file is cached for the user
  if (!("body" in res)) {
    return new Response("Not Modified", { status: 304 });
  }

  return new Response(res.body, {
    headers: {
      "Cache-Control":
        process.env.NODE_ENV === "development"
          ? "max-age=0, no-cache, must-revalidate"
          : "public, max-age=31536000, immutable",
      "Content-Length": res.size.toString(),
      "Content-Type":
        res.httpMetadata?.contentType || "application/octet-stream",
      ETag: res.etag,
    },
  });
};
