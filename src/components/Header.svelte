<nav class="flex justify-between items-center pt-3 pb-16 md:pt-4">
	<a
		class="animated-header bastia whitespace-nowrap text-3xl items-center mr-2 text-gray-400 hover:text-gray-800 ease-out duration-300 cursor-pointer"
		href="/"
	>
		<span>just</span><span class="fade-in">in</span>
		<span class="last"><span>be</span><span class="fade-in">nnett</span></span>
	</a>
</nav>

<style>
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
