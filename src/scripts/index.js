//// import list from './modules/list'
//// console.log(`Hello ${list[2]}`)

let selectedSources = [300, 1000]
let wght = 400
let MONO = 0

function setUrl() {  

  let result = `@import url('https://fonts.sandbox.google.com/css2?family=Recursive:wght,MONO@300..1000,0');`

  function getResult() {
    if (wghtSubsetControls.dataset.subsetType === "range") {
      // console.log(selectedSources)
      selectedSources = checkSelectedSources()
      console.log(selectedSources)
      let wghtMin = selectedSources[0]
      let wghtMax = selectedSources[selectedSources.length - 1]
      console.log(wghtMax)
      result = `@import url('https://fonts.sandbox.google.com/css2?family=Recursive:wght,MONO@${wghtMin}..${wghtMax},${MONO}');`
      console.log(result)
    } else {
      wght = wght_pinned_slider.value
      result = `@import url('https://fonts.sandbox.google.com/css2?family=Recursive:wght,MONO@${wght},${MONO}');`
    }
  
    if (MONOSubsetControls.dataset.subsetType === "range") {
      result = `@import url('https://fonts.sandbox.google.com/css2?family=Recursive:wght,MONO@${selectedSources[0]}..${selectedSources[1]},0..1');`
    } else {
      MONO = MONO_pinned_slider.value
      result = `@import url('https://fonts.sandbox.google.com/css2?family=Recursive:wght,MONO@${wght},${MONO}');`
    }
    return result
  }
  
  
  api_call.innerHTML = getResult()
}

// wght subset type

const wghtSubsetControls = document.querySelector('#wght-control .subset-controls')

document.getElementById("wght_subset__range").addEventListener('input', () => {  
  wghtSubsetControls.dataset.subsetType = "range"
});

document.getElementById("wght_subset__pinned").addEventListener('input', () => {
  wghtSubsetControls.dataset.subsetType = "pinned"
});

// wght - axis range selector

// similar to a calendar date-range picker: https://fetrarij.github.io/ngx-daterangepicker-material/simple

function toggleSelectionState(e) {
  // console.log(e.target)
  // console.log(e.target.dataset.selected)
  if (e.target.dataset.selected === "true") {
    // console.log("it's true")
    e.target.dataset.selected = "false"
  } else {
    // console.log("it's a nope")
    e.target.dataset.selected = "true"
  }
}

const rangeSelectorControl = document.querySelector('#wght__range') 
// console.log(rangeSelectorControl)
const rangeSelectorNodes = document.querySelectorAll("#wght__range .range-selector")

function checkSelectedSources() {
  selectedSources = []
  // check what sources are selected
  for (var selector of rangeSelectorNodes) {if (selector.dataset.selected === "true") {selectedSources.push(parseInt(selector.dataset.wghtSrc))}}

  return selectedSources
}

function selectRange(e) {
  rangeSelectorControl.classList.add("active")
  // console.log("first click on selector", e.target)

  // if a user clicks any of the selectors, all get set to false 
  for (var selector of rangeSelectorNodes) {selector.dataset.selected = "false"}
  // and then the clicked selector gets set to true
  e.target.dataset.selected = "true"

  // temporarily removes the click 
  for (var selector of rangeSelectorNodes) {selector.removeEventListener('click', selectRange)}

  // listen for user to click on next target
  document.addEventListener('mousedown', function nextClick(e) {
    function resetControls() {
      for (var selector of rangeSelectorNodes) {selector.dataset.selected = "true"}
      rangeSelectorControl.classList.remove("active")
      document.removeEventListener('mousedown',nextClick)
    }
    // console.log("click")
    // console.log("closest is ", e.target.closest('#wght__range'))
    // if user clicks outside of controller, reset to previous state
    if (e.target.matches('.range-selector') === false) {
      // console.log("click outside!")
      resetControls()
      }
    // if user clicks the same selector a second time
    else if (e.target.dataset.selected === "true") {
      // console.log("click on same selector!")
      resetControls()
    }
    // if user clicks a different selector 
    else {
      // console.log("click on selector!")
      e.target.dataset.selected = "true"
      rangeSelectorControl.classList.remove("active")
      document.removeEventListener('mousedown',nextClick)
    }
    
    // check what sources are selected
    // selectedSources = []
    // for (var selector of rangeSelectorNodes) {if (selector.dataset.selected === "true") {selectedSources.push(parseInt(selector.dataset.wghtSrc))}}
    selectedSources = checkSelectedSources()

    // if 300 and 1000 are selected, also set 800 to "true"
    if (selectedSources.includes(300) && selectedSources.includes(1000)) {
      document.querySelector('[data-wght-src="800"]').dataset.selected = "true"
    }

    setUrl()

    // re-add listeners after delay, or the setting won't stick
    window.setTimeout(function() {
      // console.log("adding listeners")
      addRangeListeners();
    }, 500);
  })

}

function addRangeListeners() {
  for (var selector of rangeSelectorNodes) {
    selector.addEventListener('click', selectRange)
  }
}

addRangeListeners()


// -----------------------------------------------------------------------------
// wght - pinned slider

const wght_pinned_slider = document.querySelector("#wght--pinned__slider");
const wght_pinned_val = document.querySelector("#wght--pinned__label");
wght_pinned_val.innerHTML = wght_pinned_slider.value

wght_pinned_slider.addEventListener('input', (e) => {
  wght_pinned_val.innerHTML = e.target.value;
  setUrl()
})



// -----------------------------------------------------------------------------
// MONO subset type

const MONOSubsetControls = document.querySelector('#MONO-control .subset-controls')

document.getElementById("MONO_subset__range").addEventListener('input', () => {  
  MONOSubsetControls.dataset.subsetType = "range"
  setUrl()
});

document.getElementById("MONO_subset__pinned").addEventListener('input', () => {
  MONOSubsetControls.dataset.subsetType = "pinned"
  setUrl()
});

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