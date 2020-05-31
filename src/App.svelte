<script>
	import TypeTester from './components/TypeTester.svelte'
	import { wght } from './stores.js';

	let wghtVal;
</script>

<main>
	<p>wght is {$wght}</p>
	<TypeTester />
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>