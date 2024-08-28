import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            // h1: {
            //   fontFamily: theme("fontFamily.display"),
            // },
            // h2: {
            //   fontFamily: theme("fontFamily.display"),
            // },
            // h3: {
            //   fontFamily: theme("fontFamily.display"),
            // },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
