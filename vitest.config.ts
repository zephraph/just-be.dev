import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "~/": new URL("./src/", import.meta.url).pathname,
      "@components/": new URL("./src/components/", import.meta.url).pathname,
      "@layouts/": new URL("./src/layouts/", import.meta.url).pathname,
      "@just-be/": new URL("./packages/", import.meta.url).pathname,
    },
  },
  test: {
    // Add any additional test configurations here if needed
  },
});
