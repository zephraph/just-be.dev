<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<h1>Welcome</h1>

<p>You're viewing {JSON.stringify(data)}</p>
