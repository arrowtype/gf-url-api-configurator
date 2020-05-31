<script>
    import Slider from './Slider.svelte'
    import RangeSlider from './RangeSlider.svelte'

    export let wghtInput = '700';
    export let wghtMin = 300;
    export let wghtMax = 1000;

    import { wght } from '../stores.js';

    function updateWght() {
        wght.set(wghtInput)
    }
</script>

<span contenteditable="true">Abc123</span>

<p>{wghtInput}</p>
<!-- <Slider id="wghtSlider" label="wght" bind:value={wghtInput} min={wghtMin} max={wghtMax} on:change={updateWght} on:input={updateWght}/> -->


<RangeSlider id="wghtSlider2" label="wght" bind:value={wghtInput} min={wghtMin} max={wghtMax} on:change={updateWght} on:input={updateWght}/>
