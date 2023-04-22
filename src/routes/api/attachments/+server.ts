import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

async function sha1(buffer: ArrayBuffer) {
	let binary = '';
	const bytes = new Uint8Array(await crypto.subtle.digest('SHA-1', buffer));
	for (let byte of bytes) {
		binary += String.fromCharCode(byte);
	}
	return btoa(binary).replace(/\//g, '-').replace(/\+/g, '_').replace(/=/g, '');
}

export const POST: RequestHandler = async ({ platform, request }) => {
	if (!platform) {
		throw error(500, "Welp, that's not supposed to happen. I'll look into it.");
	}
	const formData = await request.formData();
	const file = formData.get('file') as File;

	if (!file || !(file.name && file.size && file.type)) {
		throw error(400, 'No file provided');
	}

	const hash = await sha1(await file.arrayBuffer());
	const bucket = platform.env.R2_ATTACHMENTS;

	if (!(await bucket.head(hash))) {
		await bucket.put(hash, file.stream());
	}

	return json({
		hash,
		name: `${hash}.${file.name.split('.').pop()}`
	});
};
