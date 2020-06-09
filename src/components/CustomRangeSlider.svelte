<script>
  export let value = 800;
  export let min = 300;
  export let max = 1000;
  export let step = 10;

  export let currentMin = min;
  export let currentMax = max;

  let sliderWidth;
  let thumbWidth;
  let thumbPos;
  let limiterWidth;

  let minLimitWidth = 16;
  let minLimitPos;

  let maxLimitWidth = 16;
  let maxLimitPos;

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  // TODO: fix min & max stores
  function sendValue() {
    dispatch("thumbSlide", {
      number: value,
      minNum: min,
      maxNum: max
    });
  }

  let currentThumb;

  function sliderdown(e) {

    currentThumb = e.target

    currentThumb.classList.add("active");

    if (currentThumb.classList.contains("limiter")) {
        document.addEventListener("mousemove", limiterMove, true)
    } else {
        document.addEventListener("mousemove", slidermove, true)
    }
    document.addEventListener("mouseup", sliderup, true);
  }

  function sliderup(e) {
    currentThumb.classList.remove("active");

    document.removeEventListener("mouseup", sliderup, true);
    if (currentThumb.classList.contains("limiter")) {
        document.removeEventListener("mousemove", limiterMove, true)
    } else {
        document.removeEventListener("mousemove", slidermove, true);
    }
  }

  function slidermove(e) {

    const t = currentThumb;
    let halfSliderWidth =  t.offsetWidth / 2

    // gets mouse position relative to slider & control widths
    let newpos = e.clientX - t.parentElement.offsetLeft - t.offsetWidth;
    if (newpos < 0) {
        newpos = 0;
    } else if (newpos > sliderWidth - t.offsetWidth) {
        newpos = sliderWidth - t.offsetWidth;
    }
    // adjust movement by step precision
    let widthStep = (sliderWidth - t.offsetWidth) / ((max - min) / step);
    newpos = Math.round(newpos / widthStep) * widthStep;

    thumbPos = newpos / (sliderWidth) * 100 // convert to %

    calcValue();
  }

  // TODO: try to not change the *width* of the main slider, but just the range of it
    // then, set the blue track visual based on that

  function limiterMove(e) {
      // console.log("limiter!", e.target)
      const t = currentThumb;
      let id = t.id
      let newpos = e.clientX - t.parentElement.offsetLeft;

      // calculate extremes, taking into account other controls
      let maxMinPos = t.parentElement.offsetWidth - t.clientWidth - thumbWidth
      let minMaxPos = t.clientWidth + thumbWidth

      // if min limiter & mouse is left of 0
      if (id === "minLimitThumb" && newpos < 0) {
          newpos = 0;
      } // if min limiter & mouse is right of max
      else if (id === "minLimitThumb" && newpos > maxMinPos) {
          newpos = maxMinPos;
      } 
      else if (id === "maxLimitThumb" && newpos < minMaxPos) {
        newpos = minMaxPos
      }
      else if (id === "maxLimitThumb" && newpos > t.parentElement.offsetWidth) {
        newpos = t.parentElement.offsetWidth
      }

      let widthStep = (sliderWidth) / ((max - min) / step);
      newpos = Math.round(newpos / widthStep) * widthStep;

      if (t.id === "minLimitThumb") {
          minLimitPos = newpos/sliderWidth * 100
          currentMin = round(newpos/sliderWidth * (max-min) + min)
      } else {
          maxLimitPos = (newpos/sliderWidth) * 100

          console.log(t)
          console.log(newpos, sliderWidth)
          currentMax = round(newpos/sliderWidth * (max-min) + min)
      }

      // recalc()
      calcValue()

  }

  // round a number to a certain length of decimal points
  // from https://stackoverflow.com/a/27865285/3704306
  function precision(a) {
    if (!isFinite(a)) return 0;
    var e = 1,
      p = 0;
    while (Math.round(a * e) / e !== a) {
      e *= 10;
      p++;
    }
    return p;
  }

  function round(x) {
    return (Math.round(x / step) * step).toFixed(precision(step));
  }

  function calcValue() {
    let percentAvailable = 100 - thumbWidth/sliderWidth * 100
    let thumbAt = thumbPos / percentAvailable

    console.log(thumbAt)

    if (thumbAt === 0) {
      value = currentMin
    } else {
      value = round((currentMax - currentMin)* thumbAt + currentMin); //calc percentage taken of sliderwidth by thumbwidth
    }
    sendValue();
  }
    
  const recalc = () => {
    value < min ? value = min : value;
    value > max ? value = max: value ;
  }

  // TODO: add keyboard handling
    // When thumb is in focus
    // arrow keys will increment it (check behavior of default range inputs)
</script>

<!-- <svelte:window on:resize={resize} /> -->

<div class="combined-slider-container">
  
  <div class="custom-slider">
    <div class="custom-slider-track" bind:offsetWidth={sliderWidth}>
      <div 
          id="minLimitThumb"
          class="thumb limiter" 
          style="left: {minLimitPos ? minLimitPos : 0}%"
          on:mousedown={sliderdown}
          tabindex="0" 
          >
          <span>{currentMin}</span>
      </div>
    </div>
  </div>
  
  <div class="custom-slider">
    <div class="custom-slider-track main-track" bind:offsetWidth={sliderWidth}
      style="
        margin-left: {minLimitPos}%; 
        margin-right: {100 - maxLimitPos}%;
        "
      >
      <div
        id="mainThumb"
        class="thumb main-thumb"
        style="left: {thumbPos? thumbPos : (value - min) / (max - min) * 100}%"
        on:mousedown={sliderdown}
        bind:clientWidth={thumbWidth}
        tabindex="0"
        >
        {value}
      </div>
    </div>
  </div>
  <div class="custom-slider">
    <div class="custom-slider-track transparent">
      <div
          id="maxLimitThumb"
          class="thumb limiter" 
          style="left: {maxLimitPos ? maxLimitPos : 100}%"
          on:mousedown={sliderdown} 
          tabindex="0"
          >
          <span>{currentMax}</span>
      </div>
    </div>
  </div>
</div>

<style>
  :root {
    --minLimitPos: 0;
    --maxLimitPos: 100;
    --trackHeight: 2px;
    --controlHeight: 1.5rem;
    --thumbWidth: 3rem;
    --limiterHeight: 16px;
    --limiterWidth: 16px;

    --trackBg: #eee;
    /* --buttonBg: #0050ff; */
    --buttonBg: #5e91ff;
  }

  .combined-slider-container {
    display: grid;
    grid-template-rows: 1fr;
    align-items: center;
    padding: 2rem;
    border: black 1px solid;
  }
  .custom-slider {
    height: 0; /* allows things to properly overlap */
  }
  .custom-slider-track {
    width: 100%;
    /* height: 100%; */
    height: var(--trackHeight);
    position: relative;
    background: var(--trackBg);
  }

  .transparent {
    background-color: transparent;
    pointer-events: none;
  }

  .main-track {
    background: var(--buttonBg);
    margin-left: 0%;
    /* margin-left: calc(1% * var(--minLimitPos)); */
    width: 100%;
    /* width: calc(1% * (var(--maxLimitPos) - var(--minLimitPos))); */
  }
  .thumb {
    position: absolute;
    top: calc(-1 * var(--controlHeight) / 2 + var(--trackHeight) / 2);
    left: 0;
    background: var(--buttonBg);
    border-radius: 99px;
    user-select: none;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    cursor: ew-resize;
    /* transform: translateX(-50%); */
  }

  #mainThumb {
    width: var(--thumbWidth);
    height: var(--controlHeight);
    display: grid;
    align-items: center;
    cursor: grab;
  }
  #mainThumb:focus {
    cursor: grabbing;
    outline: none;
  }

  .limiter {
    height: var(--limiterHeight);
    width: var(--limiterWidth);
    position: absolute;
    top: calc(-1 * var(--limiterHeight) / 2 + var(--trackHeight) / 2);
    transform: translateX(calc(-0.5 * var(--limiterWidth)));
    display: grid;
    justify-content: center;
    pointer-events: all;
  }

  .limiter span{
    width: 5ch;
    text-align: center;
    font-size: .75em;
    position: absolute;
    top: 125%;
    left: -66%; /* not sure why this isn’t 50% ... */
    opacity: 0.75;
  }

  .limiter:focus {
    outline: none;
  }
  .limiter:focus span {
    opacity: 1;
  }

</style>
