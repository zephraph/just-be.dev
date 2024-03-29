// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Error {}
	// interface Locals {}
	// interface PageData {}
	interface Platform {
		env: {
			KV_IDs: KVNamespace;
			KV_FILENAMEs: KVNamespace;
			KV_URLs: KVNamespace;
			KV_NOTEs: KVNamespace;
			R2_ATTACHMENTS: R2Bucket;
		};
		context: {
			waitUntil(promise: Promise<any>): void;
		};
		caches: CacheStorage & { default: Cache };
	}
}
