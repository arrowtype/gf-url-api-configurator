<script>
  export let value = 800;
  export let min = 300;
  export let max = 1000;
  export let step = 10;

  let sliderWidth;
  let thumbWidth;
  let thumbPos;

  let minLimitWidth = 12;
  let minLimitPos;

  let maxLimitWidth = 12;
  let maxLimitPos;

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
        let newpos = e.clientX - t.parentElement.offsetLeft - t.clientWidth / 2;

        if (newpos < 0) {
            newpos = 0;
        } else if (newpos > t.parentElement.offsetWidth - t.clientWidth) {
            newpos = t.parentElement.offsetWidth - t.clientWidth;
        }
        let widthStep = (sliderWidth - t.clientWidth) / ((max - min) / step);
        newpos = Math.round(newpos / widthStep) * widthStep;

        if (t.id === "minLimitThumb") {
            minLimitPos = newpos/sliderWidth * 100
            console.log(minLimitPos)
        } else {
          maxLimitPos = (newpos/sliderWidth) * 100
            console.log(maxLimitPos)
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
</script>

<svelte:window on:resize={resize} />

<div class="custom-slider">
  <div class="custom-slider-track main-track" bind:offsetWidth={sliderWidth}>
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
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {minLimitWidth} 20" height="100%" width="100%"
        >
        <polygon id="lowerLimit" points="0,0 0,20 {minLimitWidth},10"/>
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
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {maxLimitWidth} 20" height="100%" width="100%"
        >
        <polygon id="upperLimit" points="{maxLimitWidth},0  0,10 {maxLimitWidth},20 "/>
    </svg>
  </div>
</div>

<style>
  :root {
    --trackHeight: 2px;
    --controlHeight: 1.5rem;
    --thumbWidth: 3rem;
    --limiterHeight: 20px;
    --limiterWidth: 12px;

    --trackBg: #eee;
    /* --buttonBg: #0050ff; */
    --buttonBg: #5e91ff;
  }
  .custom-slider {
    height: var(--trackHeight);
    margin: 2rem;
  }
  .custom-slider-track {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .main-track {
    background: var(--buttonBg);
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
