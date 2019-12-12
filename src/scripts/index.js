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

const rangeSelectorNodes = document.querySelectorAll(".range-selector")

console.log(rangeSelectorNodes)

// for (var selector of rangeSelectorNodes) {
//   selector.addEventListener('click', toggleSelectionState)
// }

// if a range is selected
// hovers will activate the blue in-between track and nodes between hovers
// the next click selects the other end of the range (before or after)

// let rangeCurrentlySelected = true

function selectRange(e) {
  console.log("first click on selector", e.target)
  // if a user clicks any of the selectors, all get set to false 
  for (var selector of rangeSelectorNodes) {selector.dataset.selected = "false"}
  // rangeCurrentlySelected = false
  // if (rangeCurrentlySelected === false) {
  //   for (var selector of rangeSelectorNodes) {selector.removeEventListener('click', selectRange)}
  // }
  for (var selector of rangeSelectorNodes) {selector.removeEventListener('click', selectRange)}
  // set clicked selector true
  e.target.dataset.selected = "true"

  // wait for user to click on next target
  function nextClick(e) {
    console.log("click")
    console.log("closest is ", e.target.closest('#wght__range'))
    if (e.target.closest('#wght__range') === null) {
      console.log("click outside!")
      } else {
      console.log("click on selector!")
      e.target.dataset.selected = "true"
      // rangeCurrentlySelected = true
      // addRangeListeners()
    }
    document.removeEventListener('mousedown',nextClick)
  }
  document.addEventListener('mousedown', nextClick)

  // if user clicks outside, set all selectors to true

  // return listeners to selectors
  // for (var selector of rangeSelectorNodes) {
  //   selector.addEventListener('click', selectRange)
  // }


  // UX QUESTION: do calendar range selections only work well because they must be opened, which makes it clear that a range should be selected?
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