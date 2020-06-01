<script>
    import Slider from './Slider.svelte'
    import RangeSlider from './RangeSlider.svelte'
    import RangePointSlider from './RangePointSlider.svelte'

    export let wghtInput = '700';
    export let wghtMin = 300;
    export let wghtMax = 1000;

    export let slntInput = '0';
    export let slntMin = -15;
    export let slntMax = 0;

    import { wght, slnt } from '../stores.js';

    const updateWght = () => { wght.set(wghtInput) }
    const updateSlnt = () => { slnt.set(slntInput) }
</script>

<span contenteditable="true">Abc123</span>

<p>{wghtInput}</p>
<!-- <Slider id="wghtSlider" label="wght" bind:value={wghtInput} min={wghtMin} max={wghtMax} on:change={updateWght} on:input={updateWght}/> -->


<RangeSlider id="wghtSlider2" label="wght" bind:value={wghtInput} min={wghtMin} max={wghtMax} on:change={updateWght} on:input={updateWght}/>
<!-- <RangeSlider id="slntSlider" label="slnt" bind:value={slntInput} min={slntMin} max={slntMax} on:change={updateSlnt} on:input={updateSlnt}/> -->

<RangePointSlider />