import { json } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ params, platform }) => {
  return await platform.env.KV_IDs.list({ limit: 100 })
}
