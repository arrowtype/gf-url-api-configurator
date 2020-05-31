<script>
    import Slider from './Slider.svelte'

    export let wghtInput = '700';
    export let wghtMin = 10;
    export let wghtMax = 1000;
</script>

<span contenteditable="true">Abc123</span>

<p>{wghtInput}</p>
<Slider id="wghtSlider" label="wght" bind:value={wghtInput} min={wghtMin} max={wghtMax} />
