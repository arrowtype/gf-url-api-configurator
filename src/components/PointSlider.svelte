<script>
  export let value = 800;
  export let min = 300;
  export let max = 1000;
  export let step = 1;

  let sliderWidth;
  let buttonWidth;
  let buttonPos;

  // TODO: define custom event for "input"
  // TODO: start thumb position at value

  function sliderdown(e) {
    e.target.classList.add("active");
    // bind late
    document.addEventListener("mouseup", sliderup, true);
    document.addEventListener("mousemove", slidermove, true);
  }

  function sliderup(e) {
    document.querySelector("#thumb").classList.remove("active");
    // unbind
    document.removeEventListener("mousemove", slidermove, true);
    document.removeEventListener("mouseup", sliderup, true);
  }

    // adjust movement by step precision
  function slidermove(e) {
    const t = document.querySelector("#thumb");

    let newpos = e.clientX - t.parentElement.offsetLeft - t.offsetWidth / 2;
    if (newpos < 0) {
      newpos = 0;
    } else if (newpos > t.parentElement.offsetWidth - t.offsetWidth) {
      newpos = t.parentElement.offsetWidth - t.offsetWidth;
    }
    t.style.left = newpos + "px";
    buttonPos = newpos;
    calcValue();
  }

  // from https://stackoverflow.com/a/27865285/3704306
  function precision(a) {
    if (!isFinite(a)) return 0;
    var e = 1,p = 0;
    while (Math.round(a * e) / e !== a) {e *= 10;p++;}
    return p;
  }

  function round(x) {
    return (Math.round(x / step) * step).toFixed(precision(step));
  }

  function calcValue() {
    let ratio = buttonPos / (sliderWidth - buttonWidth);
    value = round(min + (max - min) * ratio);
  }

  function resize() {
      buttonPos = (value - min) / (max-min) * (sliderWidth-buttonWidth)
  }

</script>

<svelte:window on:resize={resize}/>

<style>
  :root {
    --trackHeight: 2px;
    --controlHeight: 1.5rem;
    --trackBg: #eee;
    --buttonBg: #0050ff;
  }
  .custom-slider {
    height: var(--trackHeight);
    margin: 2rem;
  }
  .custom-slider-track {
    width: 100%;
    height: 100%;
    background: var(--trackBg);
    position: relative;
  }
  #thumb {
    width: 3rem;
    height: var(--controlHeight);
    border-radius: 99px;
    background: var(--buttonBg);
    position: absolute;
    top: calc(-1 * var(--controlHeight) / 2 + var(--trackHeight) / 2);
    left: 0;
    display: grid;
    align-items: center;
  }
  #thumb.active {
    background: #ff0097;
  }

  #thumb {
    user-select: none;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
  }

  .fullwidth {
      height: 1rem;
      background: red;
      margin: 1rem;
  }
</style>


<div class="custom-slider">
  <div
    class="custom-slider-track"
    bind:offsetWidth={sliderWidth}
    >
    <!-- //TODO: should this be positioned in the middle of the button? -->
    <div 
        id="thumb" 
        style="left: {buttonPos ? buttonPos : (value - min) / (max-min) * (sliderWidth-buttonWidth)}px" 
        on:mousedown={sliderdown} 
        bind:offsetWidth={buttonWidth}
        >
        {value}
    </div>
  </div>
</div>