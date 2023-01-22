<script>
	import GitHubIcon from './icons/GitHubIcon.svelte';
	import LinkedInIcon from './icons/LinkedInIcon.svelte';
	import MastodonIcon from './icons/MastodonIcon.svelte';
	import TwitterIcon from './icons/TwitterIcon.svelte';
</script>

<nav class="flex justify-between items-center pt-3 pb-16 md:pt-4 text-gray-400 ">
	<a
		class="animated-header bastia whitespace-nowrap text-3xl items-center mr-2 hover:text-gray-800 ease-out duration-300 cursor-pointer"
		href="/"
	>
		<span>just</span><span class="fade-in">in</span>
		<span class="last"><span>be</span><span class="fade-in">nnett</span></span>
	</a>
	<div class="flex [&>*>*]:h-7 space-x-2 social-icons">
		<a href="https://pkm.social/@just_be" class="hover:[&>*]:text-[#3088d4]"><MastodonIcon /></a>
		<a href="https://github.com/zephraph" class="hover:[&>*]:text-[#181717]"><GitHubIcon /></a>
		<a href="https://twitter.com/zephraph" class="hover:[&>*]:text-[#1da1f2]"><TwitterIcon /></a>
		<a href="https://www.linkedin.com/in/just-be/" class="hover:[&>*]:text-[#0077b5]"
			><LinkedInIcon /></a
		>
	</div>
</nav>

<style>
	.social-icons > *,
	.social-icons :global(svg) {
		transition: 0.15s all ease-in-out;
	}
	.social-icons > *:hover {
		transform: scale(1.2);
	}

	.fade-in {
		opacity: 0;
	}

	.animated-header .fade-in {
		transition: 0.18s opacity ease-in-out;
	}
	.animated-header:hover .fade-in {
		opacity: 1;
	}
	.last {
		display: inline-block;
		transform: translate(-1.8rem);
	}

	.animated-header .last {
		transition: 0.2s transform ease-in-out;
	}
	.animated-header:hover .last {
		transform: translate(0);
	}
</style>
