import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, platform }) => {
	if (!platform) {
		throw error(500, "Welp, that's not supposed to happen. I'll look into it.");
	}
	return await platform.env.KV_IDs.list({ limit: 100 });
};
