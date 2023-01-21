import { Miniflare, Log, LogLevel } from 'miniflare';
import { dev } from '$app/environment';

export const miniflare = async (platform: App.Platform) => {
	if (!dev) return platform;

	if (platform) return platform;
	const mf = new Miniflare({
		log: new Log(LogLevel.INFO),
		compatibilityFlags: ['formdata_parser_supports_files'],
		kvPersist: './.local-data/kv',
		kvNamespaces: ['KV_IDs', 'KV_FILENAMEs', 'KV_URLs', 'KV_NOTEs'],
		r2Persist: './.local-data/r2',
		r2Buckets: ['R2_ATTACHMENTS'],
		globalAsyncIO: true,
		globalTimers: true,
		globalRandom: true,
		script: `
      addEventListener("fetch", (event) => {
        event.waitUntil(Promise.resolve(event.request.url));
        event.respondWith(new Response(event.request.headers.get("X-Message")));
      });
      addEventListener("scheduled", (event) => {
        event.waitUntil(Promise.resolve(event.scheduledTime));
      });
    `
	});

	return { env: await mf.getBindings() };
};
