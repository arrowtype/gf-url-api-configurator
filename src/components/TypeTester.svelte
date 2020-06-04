<script>
    import CustomRangeSlider from './CustomRangeSlider.svelte'
    // import RangeSlider from './RangeSlider.svelte'

    export let wghtInput = '700';
    export let wghtMinInput = 300;
    export let wghtMaxInput = 1000;

    // export let slntInput = '0';
    // export let slntMin = -15;
    // export let slntMax = 0;

    import { wght, minWght, maxWght, slnt } from '../stores.js';

    const updateWght = () => { wght.set(wghtInput) }
    const updateMinWght = () => { minWght.set(wghtMinInput) }
    const updateMaxWght = () => { maxWght.set(wghtMaxInput) }

    const updateSlnt = () => { slnt.set(slntInput) }

    function handleWght(event){
        wghtInput = event.detail.number
        wght.set(wghtInput)

        wghtMinInput = event.detail.minNum
        minWght.set(wghtMinInput)

        wghtMaxInput = event.detail.maxNum
        maxWght.set(wghtMaxInput)
    }
</script>

<span contenteditable="true" style="--wght: {wghtInput}">Abc123</span>

<!-- <Slider id="wghtSlider" label="wght" bind:value={wghtInput} min={wghtMin} max={wghtMax} on:change={updateWght} on:input={updateWght}/> -->


<!-- <RangeSlider id="wghtSlider2" label="wght" bind:value={wghtInput} min={wghtMinInput} max={wghtMaxInput} on:change={updateWght} on:input={updateWght}/> -->

<CustomRangeSlider  on:thumbSlide={handleWght} min={wghtMinInput} max={wghtMaxInput} />

<style>
:root {
    --wght: 800;
}
    span {
        font-size: 15vw;
        font-variation-settings: 'wght' var(--wght);
    }
</style>