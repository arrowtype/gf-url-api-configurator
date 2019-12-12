// import list from './modules/list'
// console.log(`Hello ${list[2]}`)


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

// similar to a calendar date-range picker: https://fetrarij.github.io/ngx-daterangepicker-material/simple

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

const rangeSelectorControl = document.querySelector('#wght__range') 
console.log(rangeSelectorControl)
const rangeSelectorNodes = document.querySelectorAll(".range-selector")

function selectRange(e) {
  rangeSelectorControl.classList.add("active")
  console.log("first click on selector", e.target)

  // if a user clicks any of the selectors, all get set to false 
  for (var selector of rangeSelectorNodes) {selector.dataset.selected = "false"}
  // and then the clicked selector gets set to true
  e.target.dataset.selected = "true"

  // temporarily removes the click 
  for (var selector of rangeSelectorNodes) {selector.removeEventListener('click', selectRange)}

  // listen for user to click on next target
  document.addEventListener('mousedown', function nextClick(e) {
    console.log("click")
    console.log("closest is ", e.target.closest('#wght__range'))
    // if user clicks outside of controller, reset to previous state
    // if (e.target.closest('#wght__range') === null) {
    if (e.target.matches('.range-selector') === false) {
      console.log("click outside!")
      for (var selector of rangeSelectorNodes) {selector.dataset.selected = "true"}
      rangeSelectorControl.classList.remove("active")
      document.removeEventListener('mousedown',nextClick)
      } 
    else 
      {
      console.log("click on selector!")
      e.target.dataset.selected = "true"
      rangeSelectorControl.classList.remove("active")
      document.removeEventListener('mousedown',nextClick)
    }
    // update URL with selected elements

    let selectedSources = []

    // if 300 and 1000 are selected, also set 800 to "true"
    for (var selector of rangeSelectorNodes) {
      console.log(selector.dataset.selected)
      if (selector.dataset.selected === "true") {
        selectedSources.push(selector.dataset.wghtSrc)
      }
    }
    if (selectedSources.includes("300") && selectedSources.includes("1000")) {
      document.querySelector('[data-wght-src="800"]').dataset.selected = "true"
    }

    console.log(selectedSources)


    window.setTimeout(function() {
      console.log("adding listeners")
      addRangeListeners();
    }, 500);
    // remove listener
    

    
  })

}

function addRangeListeners() {
  for (var selector of rangeSelectorNodes) {
    selector.addEventListener('click', selectRange)
  }
}

addRangeListeners()

// UX QUESTION: do calendar range selections only work well because they must be opened, which makes it clear that a range should be selected?







// -----------------------------------------------------------------------------
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