import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { noteEntry } from '$lib/validators';
import { verifyMarkdown } from '$lib/markdown';
import matter from 'gray-matter';

export const GET: RequestHandler = async ({ platform }) => {
	return json(await platform?.env.KV_IDs.list({ limit: 100 }));
};

export const POST: RequestHandler = async ({ request, platform }) => {
	const formData = await request.formData();
	const file = formData.get('file') as File;

	if (!platform) {
		throw error(500, 'No platform provided');
	}

	if (!file || !(file.name && file.size && file.type)) {
		throw error(400, 'No file provided');
	}

	const fileNameParts = file.name.split('.');
	const fileExt = fileNameParts.pop();
	const title = fileNameParts.join('.');

	if (fileExt !== 'md') {
		throw error(400, 'unsupported file type');
	}

	const content = await file.text();
	const [{ data }] = await Promise.all([matter(content), verifyMarkdown(platform, content)]);

	const id: string = data.id;

	if (!id) {
		throw error(400, 'No ID provided');
	}

	await platform.env.KV_NOTEs.put(id, file.stream(), {
		metadata: {
			title
		}
	});

	return new Response('', { status: 200 });
};
