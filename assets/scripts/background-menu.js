var useBGImage = false;
var currentImageDisplay = 'contain';


var appearanceObject = {
  bgColor: '#008080',
  folderColor: 'pink',
  bgURL: '',
  bgSetting: ''
}

var backgroundSizeStyleObj = {
  cover: 'cover',
  contain: 'contain',
  stretch: '100% 100%',
  original: 'none'
}

let menuHTML = `<label for='appearance-form'><h2>Customize Appearance</h2></label>
<form class='inframe-form' id='appearance-form'>
  <fieldset>
    <legend><h3>Background Image</h3></legend>
    <label for='use-image'>Use Background Image?</label>
    <input type='checkbox' id='use-image'>
    <fieldset class='background-image-settings'>
      <legend><h4>Choose or Link Image</h4></legend>
      <label for='background-image'>Choose</label>
      <input type='file' id='background-image' accept='image/*'>
      <label for='image-link'>Link</label>
      <input type='url' id='image-link'>
    </fieldset>
    <fieldset class='background-image-settings'>
      <legend><h4>Image Display</h4></legend>
      <input type='radio' id='bg-cover' name='image-manipulation' value='bg-cover'>
      <label for='bg-cover'>Cover Background</label>
      <input type='radio' id='bg-contain' name='image-manipulation' value='bg-contain' checked='checked'>
      <label for='bg-contain'>Contain Image</label>
      <input type='radio' id='bg-original-size' name='image-manipulation' value='bg-original-size'>
      <label for='bg-original-size'>Original Size</label>
      <input type='radio' id='bg-repeat' name='image-manipulation' value='bg-repeat'>
      <label for='bg-repeat'>Repeat</label>
      <input type='radio' id='bg-percent' name='image-manipulation' value='bg-percent'>
      <label for='bg-percent'>Percent</label>
    </fieldset>
    <fieldset class='background-image-settings image-percent-picker'>
      <legend><h4>Image Size</h4></legend>
      <input type='range' id='pic-percent' min='0' max='400' value='100' list='percents'>
      <datalist id="percents">
        <option value='0'>
        <option value='25'>
        <option value='50'>
        <option value='75'>
        <option value='100'>
        <option value='125'>
        <option value='150'>
        <option value='175'>
        <option value='200'>
        <option value='225'>
        <option value='250'>
        <option value='275'>
        <option value='300'>
        <option value='325'>
        <option value='350'>
        <option value='375'>
        <option value='400'>
      </datalist>
      <button id='def-percent' value='default-size' onClick='this.parentNode.children[1].value = 100'>Default Size</button>
    </fieldset>
  </fieldset>
  <fieldset>
    <legend><h4>Background Color</h4></legend>
    <input type=color id='background-color' value='#008080'>
  </fieldset>
  <input type='submit' value='Save Changes'>
</form>`

function injectBackgroundMenu(container) {
  container.innerHTML = menuHTML;
}

function toggleDisplayBlockNone (element) {
  if (element.style.display == 'none' || element.style.display == '') {
    element.style.display = 'block';
  } else {
    element.style.display = 'none';
  }
}

function setAppearanceFormListeners () {
  var bgForm = document.getElementById('appearance-form');
  var bgSizeSlider = document.getElementById('pic-percent');
  var defSizeButton = document.getElementById('def-percent');
  var imageCheck = document.getElementById('use-image');
  var bgImageSettings = document.getElementsByClassName('background-image-settings');
  var bgColorPick = document.getElementById('background-color');
  var bgURL = document.getElementById('image-link');

  bgForm.addEventListener('submit', function (event) {
    event.preventDefault();
  })

  bgSizeSlider.addEventListener('change', function (event) {
    if (currentImageDisplay = 'percent') {
      
      renderAppearance();
    }
  })

  defSizeButton.addEventListener('click', function () {
    bgSizeSlider.value = '100';
    if (currentImageDisplay = 'percent') {
      renderAppearance();
    }
  })

  imageCheck.addEventListener('change', function () {
    for (let i = 0; i < bgImageSettings.length; i++) {
      if (bgImageSettings[i].style.display == 'none' || bgImageSettings[i].style.display == '') {
        bgImageSettings[i].style.display = 'block';
        useBGImage = true;
      } else {
        bgImageSettings[i].style.display = 'none';
        useBGImage = false;
      }
    }
    renderAppearance();
  })

  bgColorPick.addEventListener('change', function (event) {
    appearanceObject.bgColor = event.target.value;
    renderAppearance();
  })

  bgURL.addEventListener('blur', function (event) {
    appearanceObject.bgURL = `url(${bgURL.value})`
    renderAppearance();
  })
}

function renderAppearance() {

}
