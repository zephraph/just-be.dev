/// <reference types="../../src/env.d.ts" />

import * as Sentry from "@sentry/cloudflare";
import { defineMiddleware } from "astro:middleware";

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware(
  ({ request, locals: { runtime: context } }, next) => {
    if (process.env.IS_BUILD) {
      return next();
    }
    return Sentry.wrapRequestHandler(
      {
        options: {
          dsn: context.env.SENTRY_DSN,
        },
        request,
        context: context.ctx,
      },
      () => next()
    );
  }
);
