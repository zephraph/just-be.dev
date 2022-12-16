import { ulid } from "$lib/ulid";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ params }) => {
  return json({
    id: ulid(parseInt(params.time, 10))
  })
}
