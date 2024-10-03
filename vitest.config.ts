import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  // @ts-ignore This is failing for astro check, but not otherwise causing issues.
  plugins: [tsconfigPaths()],
  test: {
    // Add any additional test configurations here if needed
  },
});
