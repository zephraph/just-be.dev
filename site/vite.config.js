import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.test.ts'],
		includeSource: ['src/**/*.ts']
	}
};

export default config;
