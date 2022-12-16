import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { noteEntry } from "$lib/validators";

export const GET: RequestHandler = async ({ platform }) => {
  return json(await platform.env.KV_IDs.list({ limit: 100 }))
}

export const POST: RequestHandler = async ({ request, platform }) => {
  const payload = await noteEntry.parseAsync(request.json())
  platform.context.waitUntil(platform.env.KV_IDs.put(payload.id, payload.file, {
    metadata: payload.metadata
  }))

  return new Response('', { status: 202 })
} 
