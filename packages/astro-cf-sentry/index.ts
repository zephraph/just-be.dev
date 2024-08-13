import type { AstroIntegration } from "astro";
import {
  type SentryVitePluginOptions,
  sentryVitePlugin,
} from "@sentry/vite-plugin";

interface Options extends SentryVitePluginOptions {}

export default function astroCloudflareSentry(
  options: Options
): AstroIntegration {
  return {
    name: "astro:cf-sentry",
    hooks: {
      async "astro:config:setup"({ addMiddleware, updateConfig }) {
        /**
         * This is a little hack to be able to progrmmatically detect
         * if we're pre-rendering or in SSR mode.
         */
        process.env.IS_BUILD = "true";
        addMiddleware({
          entrypoint: "@just-be/astro-cf-sentry/middleware.ts",
          order: "pre",
        });
        updateConfig({
          vite: {
            build: {
              sourcemap: true,
            },
            ssr: {
              external: ["node:async_hooks"],
            },
            plugins: [
              sentryVitePlugin({
                /**
                 * CF_PAGES set by Cloudflare at build time
                 * @see https://developers.cloudflare.com/pages/configuration/build-configuration/#environment-variables
                 */
                disable: !process.env.CF_PAGES,
                authToken: process.env.SENTRY_AUTH_TOKEN,
                ...options,
              }),
            ],
          },
        });
      },
    },
  };
}
