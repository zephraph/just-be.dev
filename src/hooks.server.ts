import { dev } from "$app/environment";
import { error, type Handle } from "@sveltejs/kit";
import { token } from "$env/static/private";

export const handle: Handle = async ({ event, resolve }) => {
  if (dev) {
    const { miniflare } = await import("$lib/miniflare");
    // @ts-expect-error
    event.platform = await miniflare(event.platform);
  }
  if (!dev && event.url.pathname.startsWith("/api/") && event.request.headers.get("Authorization") !== `Bearer ${token}`) {
    throw error(401, "Unauthorized");
  }
  return resolve(event);
}
