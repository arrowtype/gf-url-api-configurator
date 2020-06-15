<script>
	import TypeTester from './components/TypeTester.svelte'
	import { wght, minWght, maxWght } from './stores.js';

	

</script>

<main>
	<p>wght is {$wght}</p>
	<!-- <p>minWght is {$minWght}</p> -->
	<!-- <p>maxWght is {$maxWght}</p> -->
	<TypeTester />
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>