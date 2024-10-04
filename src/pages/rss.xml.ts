import rss, { type RSSFeedItem } from "@astrojs/rss";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
  const { objects: pages } = await context.locals.runtime.env.R2_BUCKET.list({
    prefix: "0",
    // @ts-expect-error This is actually supported but the types are wrong
    include: ["customMetadata"],
  });

  const site = context.locals.runtime.env.SITE ?? "https://just-be.dev";

  const items: RSSFeedItem[] = pages
    .filter(
      (page) =>
        page.customMetadata?.stage !== "draft" &&
        page.customMetadata?.title &&
        page.customMetadata?.published &&
        page.customMetadata?.slug
    )
    .map((page) => ({
      title: page.customMetadata?.title,
      pubDate: page.customMetadata?.updated
        ? new Date(page.customMetadata?.updated)
        : new Date(page.customMetadata?.published!),
      link: `${site}/${page.customMetadata?.slug}`,
    }));

  return rss({
    title: "Just Be",
    description: "The personal site of Justin Bennett",
    site,
    items,
  });
};
