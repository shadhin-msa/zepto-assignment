/**
 * zepto assignment: Poster Creator script
 *
 */

const API_LINK = 'http://zepto-assignment.test/api.php'

// elements
const headingElement = document.getElementById('headingInput')
const imageElement = document.getElementById('imageInput')
const descriptionElement = document.getElementById('descriptionInput')
const headingPreviewElement = document.getElementById('prevHeading')
const prevImageElement = document.getElementById('prevImage')

// ========= Event Listeners ==========

// heading listener
headingElement.addEventListener('focusout', (event) => {
  const data = { heading: headingElement.value }
  savePoster(data, callbackFunction)
})

// image listener
imageElement.addEventListener('change', function (e) {
  if (e.target.files[0]) {
    savePoster({ image: e.target.files[0] }, getPoster)
  }
})

// description listener
descriptionElement.addEventListener('focusout', (event) => {
  const data = { description: descriptionElement.value }
  savePoster(data, callbackFunction)
})

// Document on load
document.addEventListener('DOMContentLoaded', function () {
  getPoster()
})

// ========= Frontend Actions ==========

// activate item (heading | image | description)
function activateItem(buttonId, editorId) {
  document.getElementById(buttonId).classList.add('hidden')
  document.getElementById(editorId).classList.remove('hidden')
}

// deactivate item (heading | image | description)
function deactivateItem(buttonId, editorId, data) {
  document.getElementById(buttonId).classList.remove('hidden')
  document.getElementById(editorId).classList.add('hidden')
  console.log(data)
  if (data) savePoster(data, getPoster)
}

// change Heading alignment
function headingAlignment(val) {
  savePoster({ headingAlignment: val })
  updateAlignmentClass(val)
}

// change heading color
function headingColor(val) {
  savePoster({ headingColor: val })
  updateColorClass(val)
}

// download poster as image
function downloadPoster() {
  html2canvas(document.querySelector('#poster')).then((canvas) => {
    var downloadLink = document.getElementById('downloadLink')
    downloadLink.setAttribute('download', 'poster.png')
    downloadLink.setAttribute(
      'href',
      canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
    )
    downloadLink.click()
  })
}

// Call Back function for log
function callbackFunction(data) {
  console.log('response from API', data)
}


// ========= implement changes ==========

// updates value locally
function updateView(inputElement, id) {
  document.getElementById(id).innerHTML = inputElement.value
}

function updateAlignmentClass(val) {
  if (val) {
    headingPreviewElement.classList.remove('text-left', 'text-right', 'text-center')
    headingPreviewElement.classList.add(val)
  }
}

function updateColorClass(val) {
  if (val) {
    headingPreviewElement.classList.remove('text-blue-700', 'text-black-700', 'text-green-700')
    headingPreviewElement.classList.add(val)
  }
}

function updatePoster(payload) {
  document.getElementById('prevHeading').innerHTML = payload.heading
  if (payload.heading && payload.heading !== ' ') {
    console.log('activate heading')
    activateItem('button-heading', 'section-heading')
    headingElement.value = payload.heading
  } else {
    console.log('deactivate heading')
    deactivateItem('button-heading', 'section-heading')
    headingElement.value = ''
  }

  prevImageElement.style.backgroundImage = "url('" + payload.image + "')"

  if (payload.image && payload.image !== ' ') {
    console.log({ activate_image: payload.image })
    activateItem('button-image', 'section-image')
    prevImageElement.classList.remove('hidden')
  } else {
    console.log({ activate_image: payload.image })
    deactivateItem('button-image', 'section-image')
    prevImageElement.classList.add('hidden')
  }

  document.getElementById('prevDescription').innerHTML = payload.description
  if (payload.description && payload.description !== ' ') {
    console.log('activate description')
    activateItem('button-description', 'section-description')
    descriptionElement.value = payload.description
  } else {
    console.log('deactivate description')
    deactivateItem('button-description', 'section-description')
    descriptionElement.value = ''
  }

  updateAlignmentClass(payload.heading_alignment)
  updateColorClass(payload.heading_color)
}

// ========= API Calls ==========

// sends data to API for saving/updating
function savePoster(data, callback) {
  const formData = new FormData()
  if (data.heading || data.heading == '') formData.append('heading', data.heading)
  else console.log('no heading found')
  if (data.description || data.description == '') formData.append('description', data.description)
  if (data.image || data.image === null) formData.append('image', data.image)
  if (data.headingAlignment) formData.append('headingAlignment', data.headingAlignment)
  if (data.headingColor) formData.append('headingColor', data.headingColor)

  axios
    .post(API_LINK, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      if (callback) {
        callback(null, response.data)
      }
    })
    .catch((error) => {
      callback(error)
    })
}

// get poster data from db
function getPoster() {
  axios
    .get(API_LINK)
    .then((response) => {
      console.log('Poster data:', response.data)
      updatePoster(response.data)
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}

