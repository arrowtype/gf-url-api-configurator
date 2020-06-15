<script>

  // PASS STATE TO GLOBAL STORE
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  // TODO: fix min & max stores
  function sendValue() {
    dispatch("thumbSlide", {
      number: currentValue,
      minNum: currentMin,
      maxNum: currentMax
    });
  }
  


  // absolute / global / initial values
  export let value = 800;
  export const min = 300;
  export const max = 1000;
  export let step = 10;

  // relative / local / updateable values
  // TODO: are these being mutated somehere?
  let currentValue = value;
  let currentMin = min;
  let currentMax = max;



  let valueThumbWidth = 48;
  let limiterThumbWidth = 16; 

  // percentages for current location
  let valuePos = (currentValue-currentMin) / (currentMax-currentMin) * 100
  let minLimitPos = 0;
  let maxLimitPos = 100;

  let sliderWidth; // overall width of full slider component; set by bind:offsetWidth in element

  let widthStep;
  function setWidthStep() { widthStep = (sliderWidth - limiterThumbWidth) / ((max - min) / step) }

  let sliderOffsetLeft;
  let currentsliderWidth;

  function sliderDimensions() {
    sliderOffsetLeft = document.querySelector("#main-track").offsetLeft
    currentsliderWidth = document.querySelector("#main-track").offsetWidth
  }


  // ACTUAL SLIDER FUNCTIONALITY

  let currentThumb;

  function sliderdown(e) {

    sliderDimensions()
    setWidthStep()

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
    let halfSliderWidth =  valueThumbWidth / 2

    let newpos = e.clientX - sliderOffsetLeft - valueThumbWidth; // gets mouse position relative to slider & control widths

    if (newpos < 0) {
        newpos = 0;
    } else if (newpos > currentsliderWidth - valueThumbWidth) {
        newpos = currentsliderWidth - valueThumbWidth;
    }
    
    newpos = Math.round(newpos /  widthStep) * widthStep; // adjust movement by step precision

    valuePos = newpos / (currentsliderWidth) * 100 // convert to %

    calcValue();
  }

  // TODO: try to not change the *width* of the main slider, but just the range of it
    // then, set the blue track visual based on that

  function limiterMove(e) {
      // console.log("limiter!", e.target)
      const t = currentThumb;
      let id = t.id
      // let limiterSliderWidth = t.parentElement.offsetWidth;
      let limiterSliderWidth = sliderWidth;
      let newpos = e.clientX - sliderOffsetLeft;

      // calculate extremes, taking into account other controls
      let maxMinPos = limiterSliderWidth - limiterThumbWidth - valueThumbWidth
      let minMaxPos = limiterThumbWidth + valueThumbWidth

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
      else if (id === "maxLimitThumb" && newpos > limiterSliderWidth) {
        newpos = limiterSliderWidth
      }

       // TODO: is there a way we can remove the sliderWidth check from here? Might be causing issues.
      newpos = Math.round(newpos / widthStep) * widthStep;

      // console.log("newpos " + newpos)
      // console.log("sliderWidth " + sliderWidth)

      // !!! TODO TODO TODO find out why min & max are’t staying constant
      console.log("max " + max)
      console.log("min " + min)

      if (t.id === "minLimitThumb") {
          minLimitPos = newpos/sliderWidth * 100
          currentMin = round(newpos/sliderWidth * (max-min) + min)

      } else {
          maxLimitPos = (newpos/sliderWidth) * 100
          currentMax = round(newpos/sliderWidth * (max-min) + min)
      }

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
    let currentsliderWidth = document.querySelector("#main-track").offsetWidth
    let percentAvailable = 100 - valueThumbWidth/currentsliderWidth * 100
    let thumbAt = valuePos / percentAvailable

    if (thumbAt === 0) {
      currentValue = currentMin
    } else {
      currentValue = round((currentMax - currentMin)* thumbAt + currentMin); //calc percentage taken of sliderwidth by valueThumbwidth
    }
    sendValue();
  }

  function resize() {
    sliderDimensions()
  }
    
  // const recalc = () => {
  //   currentValue < min ? currentValue = min : currentValue;
  //   currentValue > max ? currentValue = max: currentValue ;
  // }

  // TODO: add keyboard handling
    // When thumb is in focus
    // arrow keys will increment it (check behavior of default range inputs)
</script>

<svelte:window on:resize={resize} />

<div class="combined-slider-container" 
  bind:offsetWidth={sliderWidth}
  style="--valueThumbWidth: {valueThumbWidth}px; --limiterThumbWidth: {limiterThumbWidth}px">
  
  <div class="custom-slider">
    <div class="custom-slider-track">
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
    <div class="custom-slider-track main-track" 
      id="main-track"
      style="
        margin-left: {minLimitPos}%; width: {maxLimitPos - minLimitPos}%;
        "
      >
      <div
        id="mainThumb"
        class="thumb main-thumb"
        style="left: {valuePos}%"
        on:mousedown={sliderdown}
        tabindex="0"
        >
        {currentValue}
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
    --valueThumbWidth: 48px;
    --limiterThumbWidth: 16px;

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
    /* margin-left: 0%; */
    /* width: 100%; */
    /* margin-left: calc(1% * var(--minLimitPos));
    width: calc(1% * (var(--maxLimitPos) - var(--minLimitPos))); */
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
    width: var(--valueThumbWidth);
    height: var(--controlHeight);
    display: grid;
    align-items: center;
    /* cursor: grab; */
    cursor: ew-resize;
  }
   /* #mainThumb.active {
    cursor: grabbing;
   } */
  #mainThumb:focus {
    outline: none;
  }

  .limiter {
    height: var(--limiterThumbWidth);
    width: var(--limiterThumbWidth);
    position: absolute;
    top: calc(-1 * var(--limiterThumbWidth) / 2 + var(--trackHeight) / 2);
    transform: translateX(calc(-0.5 * var(--limiterThumbWidth)));
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
