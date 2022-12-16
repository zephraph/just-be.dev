import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

async function sha1(buffer: ArrayBuffer) {
  const digest = await crypto.subtle.digest('SHA-1', buffer)
  return Buffer.from(digest).toString('base64').replace(/\//g, '-').replace(/\+/g, '_').replace(/=/g, '')
}

export const POST: RequestHandler = async ({ platform, request }) => {
  const formData = await request.formData()
  console.log(formData)
  const file = formData.get('file') as File;

  if (!file || !(file.name && file.size && file.type)) {
    throw error(400, 'No file provided');
  }

  const hash = await sha1(await file.arrayBuffer());

  return json({
    hash,
    name: `${hash}.${file.name.split('.').pop()}`,
  })
}
