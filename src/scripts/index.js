import list from './modules/list'

console.log(`Hello ${list[2]}`)

let wght = 400
let MONO = 0

function setUrl() {  
    wght = wght_pinned_slider.value
    MONO = MONO_pinned_slider.value
    
    let result = `@import url('https://fonts.sandbox.google.com/css2?family=Recursive:wght,MONO@${wght},${MONO}');`
    
    api_call.innerHTML = result
  }
  
  // wght subset type
  
  const wghtSubsetControls = document.querySelector('#wght-control .subset-controls')
  
  document.getElementById("wght_subset__range").addEventListener('input', (e) => {  
    wghtSubsetControls.dataset.subsetType = "range"
  });
  
  document.getElementById("wght_subset__pinned").addEventListener('input', (e) => {
    wghtSubsetControls.dataset.subsetType = "pinned"
  });
  
  // wght - axis range selector
  
  function toggleSelectionState(e) {
    console.log(e.target)
    console.log(e.target.dataset.selected)
    if (e.target.dataset.selected === "true") {
      console.log("it's true")
      e.target.dataset.selected = "false"
    } else {
      console.log("it's a nope")
      e.target.dataset.selected = "true"
    }
  }
  
  // if a range is selected
    // and if a user clicks any of the selectors, all get set to false 
    // hovers will activate the blue in-between track and nodes between hovers
    // the next click selects the other end of the range (before or after)
  
  const rangeSelectorNodes = document.querySelectorAll(".range-selector")
  
  console.log(rangeSelectorNodes)
  
  for (var selector of rangeSelectorNodes) {
    selector.addEventListener('click', toggleSelectionState)
  }
  
  // wght - pinned slider
  
  const wght_pinned_slider = document.querySelector("#wght--pinned__slider");
  const wght_pinned_val = document.querySelector("#wght--pinned__label");
  wght_pinned_val.innerHTML = wght_pinned_slider.value
  
  wght_pinned_slider.addEventListener('input', (e) => {
    wght_pinned_val.innerHTML = e.target.value;
    setUrl()
  })
  
  
  
  // MONO pinned slider
  
  const MONO_pinned_slider = document.querySelector("#MONO--pinned__slider");
  const MONO_pinned_val = document.querySelector("#MONO--pinned__label");
  MONO_pinned_val.innerHTML = MONO_pinned_slider.value
  
  MONO_pinned_slider.addEventListener('input', (e) => {
    MONO_pinned_val.innerHTML = e.target.value;
    setUrl()
  });
  
  
  
  
  // cue URL
  
  const api_call = document.querySelector("#api-call");
  setUrl()
  
  
  
   
  
  // TODO: make range/pinned radio buttons show/hide slider vs checkboxes