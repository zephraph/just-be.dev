import type { RequestHandler } from "./$types";
import { error } from '@sveltejs/kit'

export const GET: RequestHandler = async () => {
  throw error(404, 'Not found')
}
