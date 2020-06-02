<script>
  export let value = 800;
  export let min = 300;
  export let max = 1000;
  export let step = 10;

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

  function sendValue() {
    dispatch("thumbSlide", {
      number: value
    });
  }

  let currentThumb;

  function sliderdown(e) {

    e.target.tagName === "polygon" ? e.target.parentElement.classList.add("active") : e.target.classList.add("active");
    e.target.tagName === "polygon" ? currentThumb = e.target.parentElement : currentThumb = e.target;

    // bind late
    if (currentThumb.classList.contains("limiter")) {
        console.log("yup")
        document.addEventListener("mousemove", limiterMove, true)
    } else {
        console.log("nope")
        document.addEventListener("mousemove", slidermove, true)
    }
    document.addEventListener("mouseup", sliderup, true);
  }

  function sliderup(e) {
    // document.querySelector(".thumb").classList.remove("active");
    currentThumb.classList.remove("active");
    // unbind
    document.removeEventListener("mouseup", sliderup, true);
    if (currentThumb.classList.contains("limiter")) {
        document.removeEventListener("mousemove", limiterMove, true)
    } else {
        document.removeEventListener("mousemove", slidermove, true);
    }
  }

  // ways to simplify:
    // 1. use CSS to translate the slider left by 50%, so that its width needn’t be caculated in JS
    // 2. calculate and apply position by %, so it can stay constant it window width changes
    // 3. make min/max limiters into divs (and just little circles), rather than SVGs

  function slidermove(e) {

    const t = currentThumb;

    let newpos = e.clientX - t.parentElement.offsetLeft - t.offsetWidth / 2;
    if (newpos < 0) {
        newpos = 0;
    } else if (newpos > t.parentElement.offsetWidth - t.offsetWidth) {
        newpos = t.parentElement.offsetWidth - t.offsetWidth;
    }
    // adjust movement by step precision
    let widthStep = (sliderWidth - t.offsetWidth) / ((max - min) / step);
    newpos = Math.round(newpos / widthStep) * widthStep;

    thumbPos = newpos

    calcValue();
  }

  function limiterMove(e) {
      // console.log("limiter!", e.target)
      const t = currentThumb;
      let id = t.id
      let newpos = e.clientX - t.parentElement.offsetLeft - t.clientWidth / 2;

      if (newpos < 0 && id === "minLimitThumb") {
          newpos = 0;
      } else if (newpos < 0 && id === "maxLimitThumb") {
        newpos = 0
      } else if (newpos > t.parentElement.offsetWidth - t.clientWidth && id === "minLimitThumb") {
          newpos = t.parentElement.offsetWidth - t.clientWidth;
      } 
      
      // // TODO: make maxLimit thumb work better
      // else if (newpos > 0 && id === "minLimitThumb") {
      //   newpos = 100;
      // }
      
      // else if (newpos > t.parentElement.offsetWidth - t.clientWidth && id === "maxLimitThumb") {

      let widthStep = (sliderWidth - t.clientWidth) / ((max - min) / step);
      newpos = Math.round(newpos / widthStep) * widthStep;

      if (t.id === "minLimitThumb") {
          minLimitPos = newpos/sliderWidth * 100
          recalc()
      } else {
        maxLimitPos = (newpos/sliderWidth) * 100
          recalc()
      }

  }


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
    let ratio = thumbPos / (sliderWidth - thumbWidth);
    value = round(min + (max - min) * ratio);
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
        style="left: {thumbPos ? thumbPos : ((value - min) / (max - min)) * (sliderWidth - thumbWidth)}px"
        on:mousedown={sliderdown}
        bind:clientWidth={thumbWidth}>
        {value}
      </div>
    </div>
  </div>
  <div class="custom-slider">
    <div class="custom-slider-track" bind:offsetWidth={sliderWidth}>
      <svg 
          id="minLimitThumb"
          class="thumb limiter" 
          style="left: {minLimitPos ? minLimitPos : 0}%"
          on:mousedown={sliderdown} 
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 32" height="100%" width="100%"
          >
          <polygon id="lowerLimit" points="0,4 0,28 14,16"/>
      </svg>
    </div>
  </div>
  <div class="custom-slider">
    <div class="custom-slider-track" bind:offsetWidth={sliderWidth}>
      <svg
          id="maxLimitThumb"
          class="thumb limiter" 
          style="left: {maxLimitPos ? maxLimitPos : 100}%"
          on:mousedown={sliderdown} 
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {maxLimitWidth} 32" height="100%" width="100%"
          >
          <!-- <polygon id="upperLimit" points="{maxLimitWidth},0  0,10 {maxLimitWidth},20 "/> -->
          <polygon id="upperLimit" points="14,4 0,16 14,28 "/>
      </svg>
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
    --limiterHeight: 32px;
    --limiterWidth: 12px;

    --trackBg: #eee;
    /* --buttonBg: #0050ff; */
    --buttonBg: #5e91ff;
  }

  .combined-slider-container {
    display: grid;
    grid-template-rows: 1fr;
    align-items: center;
    margin: 2rem;
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
    width: var(--thumbWidth);
    height: var(--controlHeight);
    position: absolute;
    top: calc(-1 * var(--controlHeight) / 2 + var(--trackHeight) / 2);
    left: 0;
    user-select: none;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
  }

  .main-thumb {
    display: grid;
    align-items: center;
    background: var(--buttonBg);
    border-radius: 99px;
  }
  .thumb.active {
    background: #ff0097;
  }

  .limiter {
    width: var(--controlHeight);
    height: var(--limiterHeight);
    position: absolute;
    top: calc(-1 * var(--limiterHeight) / 2 + var(--trackHeight) / 2);
    transform: translateX(calc(-1 * var(--limiterWidth)));
  }
  .limiter polygon{
      fill: var(--buttonBg);
  }
</style>
