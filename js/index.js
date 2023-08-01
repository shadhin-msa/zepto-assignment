/**
 * zepto assignment: Poster Creator script
 *
 */
// updates value locally
function updateView(inputElement, id) {
  document.getElementById(id).innerHTML = inputElement.value
}

// activate item
function activateItem(buttonId, editorId) {
  document.getElementById(buttonId).classList.add("hidden")
  document.getElementById(editorId).classList.remove("hidden")
}

// deactivate item
function deactivateItem(buttonId, editorId, data) {
  document.getElementById(buttonId).classList.remove("hidden")
  document.getElementById(editorId).classList.add("hidden")
  savePoster(data);

}

const API_LINK = 'http://zepto-assignment.test/api.php'

// elements
const headingElement = document.getElementById('headingInput')
const imageElement = document.getElementById('imageInput')
const descriptionElement = document.getElementById('descriptionInput')

// heading listener
headingElement.addEventListener('focusout', (event) => {
  event.target.style.background = 'red'
  const data = { heading: headingElement.value }
  savePoster(data, callbackFunction)
})

// image listener
imageElement.addEventListener('change', function(e) {
  if (e.target.files[0]) {
    document.body.append('You selected ' + e.target.files[0].name);
    savePoster({image:e.target.files[0]}, callbackFunction)
  }
});

// description listener
descriptionElement.addEventListener('focusout', (event) => {
  event.target.style.background = 'red'
  const data = { description: descriptionElement.value }
  savePoster(data, callbackFunction)
})

// Call Back function for frontend
function callbackFunction(data) {
  console.log('response from API', data)
}


/**
 * ----------------------------------------
 * API Calls
 */

// Function to send data to API for saving/updating
function savePoster(data, callback) {

}


