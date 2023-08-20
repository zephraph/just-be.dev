<script>
	import '../app.css';
	import Header from '../components/Header.svelte';
</script>

<main class="lg-:container mx-auto px-6 py-2 max-w-screen-lg">
	<Header />
	<article class="prose lg:prose-xl">
		<slot />
	</article>
</main>
