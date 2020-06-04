<script>
  export let value = 800;
  export let min = 300;
  export let max = 1000;
  export let step = 10;

  export let currentMin = 300;
  export let currentMax = 1000;

  let sliderWidth;
  let thumbWidth;
  let thumbPos;

  let minLimitWidth = 16;
  let minLimitPos;

  let maxLimitWidth = 16;
  let maxLimitPos;

  let minLimit = 0;
  let maxLimit = 0;
  let minLimitPx = 0;
  let maxLimitPx = 0;

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

  // ways to simplify:
    // 1. use CSS to translate the slider left by 50%, so that its width needn’t be caculated in JS
    // 2. calculate and apply position by %, so it can stay constant it window width changes - DONE
    // 3. make min/max limiters into divs (and just little circles), rather than SVGs

  function slidermove(e) {

    const t = currentThumb;
    let halfSliderWidth =  t.offsetWidth / 2

    

    let newpos = e.clientX - t.parentElement.offsetLeft - halfSliderWidth;
    if (newpos < 0) {
        newpos = 0;
    } else if (newpos > t.parentElement.offsetWidth - halfSliderWidth) {
        newpos = t.parentElement.offsetWidth - halfSliderWidth;
    }
    // adjust movement by step precision
    let widthStep = (sliderWidth - halfSliderWidth) / ((max - min) / step);
    newpos = Math.round(newpos / widthStep) * widthStep;

    thumbPos = newpos / sliderWidth * 100 // convert to %

    calcValue();
  }

  function limiterMove(e) {
      // console.log("limiter!", e.target)
      const t = currentThumb;
      let id = t.id
      let newpos = e.clientX - t.parentElement.offsetLeft;

      let maxMinPos = t.parentElement.offsetWidth - t.clientWidth - thumbWidth
      let minMaxPos = t.clientWidth + thumbWidth

      if (id === "minLimitThumb" && newpos < 0) {
          newpos = 0;
      } 
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
          recalc()
      } else {
        maxLimitPos = (newpos/sliderWidth) * 100
          currentMax = round(newpos/sliderWidth * (max-min) + min)
          recalc()
      }

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
    value = round(min + (max - min) * thumbPos/100);
    sendValue();
  }

  function resize() {
    thumbPos = ((value - min) / (max - min)) * (sliderWidth - thumbWidth);
  }

  const calcLowerLimitPercent = () => { minLimitPx = sliderWidth * ((minLimit - min) / (max - min)) }
  const calcUpperLimitPercent = () => { maxLimitPx = sliderWidth * ((max - maxLimit) / (max - min)) }
    
  const recalc = () => {
      calcLowerLimitPercent()
      calcUpperLimitPercent()
      value < minLimit ? value = minLimit : value;
      value > maxLimit ? value = maxLimit: value ;
  }
</script>

<svelte:window on:resize={resize} />

<div class="combined-slider-container">
  <div class="custom-slider">
    <div class="custom-slider-track main-track" style="--minLimitPx: {minLimitPx}; --maxLimitPx: {maxLimitPx};" bind:offsetWidth={sliderWidth}>
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
    <div class="custom-slider-track" bind:offsetWidth={sliderWidth}>
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
    --minLimitPx: 0px;
    --maxLimitPx: 0px;
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
  }
  .main-track {
    height: var(--trackHeight);
    background: var(--buttonBg);
    margin-left: var(--lowerLimit)px;
    margin-right: var(--upperLimit)px;
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
  .active {
    background: #ff0097;
    cursor: grab;
    border: red 2px solid;
  }

  #mainThumb {
    width: var(--thumbWidth);
    height: var(--controlHeight);
    display: grid;
    align-items: center;
  }

  .limiter {
    height: var(--limiterHeight);
    width: var(--limiterWidth);
    position: absolute;
    top: calc(-1 * var(--limiterHeight) / 2 + var(--trackHeight) / 2);
    transform: translateX(calc(-0.5 * var(--limiterWidth)));
    display: grid;
    justify-content: center;
    
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
