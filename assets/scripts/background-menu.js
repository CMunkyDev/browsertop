var useBGImage = false;
var currentImageDisplay = 'contain';
var bgOrigHeight;
var bgOrigWidth;
var widthPercent;
var heightPercent;
var finalWidthInPx;
var finalHeightInPx;
var bgSizeSlider = document.getElementById('pic-percent');
var savedAppearance;
var folderColor;

function getAppearance () {
  chrome.storage.sync.get('appearance', function (bagOfHolding) {
    if (chrome.runtime.lastError || bagOfHolding['appearance'] === undefined) {
      //default appearance
      savedAppearance = {
       useImage: false,
       bgURL: '',
       bgDisplay: 'bg-cover',
       bgSize: '',
       bgNaturalWidth: '',
       bgNaturalHeight: '',
       sliderValue: '100',
       bgColor: '#222222',
       folderColor: '#2d2d2d',
       radioValue: '',
       radioId: 'bg-contain'
      }
      //console.log('Failed to find saved appearance.')
    } else {
      savedAppearance = bagOfHolding['appearance'];
      //console.log('Successfully retrieved saved appearance.')
    }
    renderAppearance();
  })
}

function saveAppearance () {
  chrome.storage.sync.set({'appearance': savedAppearance})
}

var backgroundSizeStyleObj = {
  cover: 'cover',
  contain: 'contain',
  stretch: '100% 100%',
  original: 'none'
}

function convertPercentsToPixels (percentH, percentW, sliderPercent, parentElement) {
  let parentWidth = parentElement.clientWidth;
  let parentHeight = parentElement.clientHeight;
  finalWidthInPx = percentW * (sliderPercent/100) * parentWidth;
  finalHeightInPx = percentH * (sliderPercent/100) * parentHeight;
  //console.log('finalWPx: ', finalWidthInPx);
  //console.log('finalHPx: ', finalWidthInPx);
}

function calculateStartingPercent (origHeight, origWidth, parentElement) {
  let parentWidth = parentElement.clientWidth;
  let parentHeight = parentElement.clientHeight;
  widthPercent = (origWidth / parentWidth);
  heightPercent = (origHeight / parentHeight);
  //console.log('cal width: ', widthPercent);
  //console.log('cal height: ', heightPercent);
}

let menuHTML = `<label for='appearance-form'><h2>Customize Appearance</h2></label>
<form class='inframe-form' id='appearance-form'>
  <fieldset>
    <legend><h3>Background Image</h3></legend>
    <label for='use-image'>Use Background Image?</label>
    <input type='checkbox' id='use-image'>
    <fieldset class='background-image-settings'>
      <legend><h4><!--Choose or -->Link Image</h4></legend>
      <!--<label for='background-image'>Choose</label>
      <input type='file' id='background-image' accept='image/*'>-->
      <label for='image-link'>Link</label>
      <input type='url' id='image-link'>
    </fieldset>
    <fieldset class='background-image-settings'>
      <radiogroup id='display-type'>
        <legend><h4>Image Display</h4></legend>
        <input type='radio' id='bg-cover' name='image-manipulation' value='bg-cover'>
        <label for='bg-cover'>Cover Background</label>
        <input type='radio' id='bg-contain' name='image-manipulation' value='bg-contain' checked='checked'>
        <label for='bg-contain'>Contain Image</label>
        <input type='radio' id='bg-sized' name='image-manipulation' value='bg-sized'>
        <label for='bg-sized'>Custom Size</label>
        <input type='radio' id='bg-repeat' name='image-manipulation' value='bg-repeat'>
        <label for='bg-repeat'>Repeat</label>
      </radiogroup>
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

function extractImageDimensions(url) {
  let image = document.createElement('img');
  image.src = url;
  //console.log('image: ', image);
  bgOrigHeight = image.naturalHeight;
  bgOrigWidth = image.naturalWidth;
  savedAppearance.bgNaturalWidth = image.naturalWidth;
  savedAppearance.bgNaturalHeight = image.naturalHeight;
  //console.log('natHeight: ', bgOrigHeight);
  //console.log('natWidth: ', bgOrigWidth);
  //remove image?
}

function toggleDisplayBlockNone (element) {
  if (element.style.display == 'none' || element.style.display == '') {
    element.style.display = 'block';
  } else {
    element.style.display = 'none';
  }
}

function returnRadioValue (radioParent) {
  let buttons = radioParent.querySelectorAll('input');
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].checked) {
      return buttons[i].value;
    }
  }
  //console.log('returnRadioValue couldn\'t find a checked radio button');
  return null;
}

function killBackground (element) {
  element.style.backgroundImage = '';
  element.style.backgroundPosition = '';
  element.style.backgroundSize = '';
  element.style.backgroundRepeat = '';
  element.style.backgroundOrigin = '';
  element.style.backgroundClip = '';
  element.style.backgroundAttachment = '';
  element.style.backgroundColor = '#ffffff';
}

function killBackgroundStyle (element) {
  element.style.backgroundPosition = '';
  element.style.backgroundSize = '';
  element.style.backgroundRepeat = '';
  element.style.backgroundOrigin = '';
  element.style.backgroundClip = '';
  element.style.backgroundAttachment = '';
}

function handleDisplayType (radioValue, targetElement = browsertop, sliderValue = bgSizeSlider.value) {
  killBackgroundStyle(targetElement);
  switch (radioValue) {
    case 'bg-cover':
    currentImageDisplay = 'cover';
    targetElement.style.backgroundSize = 'cover';
    targetElement.style.backgroundPosition = '50% 50%';
    break;
    case 'bg-contain':
    currentImageDisplay = 'contain';
    targetElement.style.backgroundSize = 'contain';
    targetElement.style.backgroundPosition = '50% 50%';
    break;
    case 'bg-sized':
    currentImageDisplay = 'percent';
    convertPercentsToPixels(heightPercent, widthPercent,sliderValue,browsertop);
    browsertop.style.backgroundSize = `${finalWidthInPx}px ${finalHeightInPx}px`;
    break;
    case 'bg-repeat':
    currentImageDisplay = 'repeat';
    targetElement.style.backgroundSize = '';
    targetElement.style.backgroundRepeat = 'repeat';
    break;
    default:
    break;
  }
}

function setRadioListeners (radioParent) {
  let buttons = radioParent.querySelectorAll('input');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('change', function () {
      let currentValue = returnRadioValue(radioParent);
      savedAppearance.radioValue = currentValue;
      savedAppearance.radioId = buttons[i].id;
      handleDisplayType(currentValue);
    })
  }
}

function setAppearanceFormListeners () {
  var bgForm = document.getElementById('appearance-form');
  bgSizeSlider = document.getElementById('pic-percent');
  var defSizeButton = document.getElementById('def-percent');
  var imageCheck = document.getElementById('use-image');
  var bgImageSettings = document.getElementsByClassName('background-image-settings');
  var bgColorPick = document.getElementById('background-color');
  var bgURL = document.getElementById('image-link');
  var displayType = document.getElementById('display-type');


  setRadioListeners(displayType);

  bgForm.addEventListener('submit', function (event) {
    event.preventDefault();
    saveAppearance();
  })

  // bgRadioRepeat.addEventListener('change', function (event) {
  //   if (event.target.isChecked)
  // })

  bgSizeSlider.addEventListener('change', function (event) {
    if (currentImageDisplay == 'percent') {
      convertPercentsToPixels(heightPercent, widthPercent,bgSizeSlider.value,browsertop);
      browsertop.style.backgroundSize = `${finalWidthInPx}px ${finalHeightInPx}px`;
      savedAppearance.bgSize = `${finalWidthInPx}px ${finalHeightInPx}px`;
      savedAppearance.sliderValue = bgSizeSlider.value;
      //renderAppearance();
    }
  })

  defSizeButton.addEventListener('click', function () {
    bgSizeSlider.value = '100';
    if (currentImageDisplay == 'percent') {
      convertPercentsToPixels(heightPercent, widthPercent,bgSizeSlider.value,browsertop);
      browsertop.style.backgroundSize = `${finalWidthInPx}px ${finalHeightInPx}px`;
      savedAppearance.bgSize = `${finalWidthInPx}px ${finalHeightInPx}px`;
      //renderAppearance();
    }
  })

  imageCheck.addEventListener('change', function () {
    for (let i = 0; i < bgImageSettings.length; i++) {
      if (bgImageSettings[i].style.display == 'none' || bgImageSettings[i].style.display == '') {
        bgImageSettings[i].style.display = 'block';
        useBGImage = true;
        savedAppearance.useImage = true;
      } else {
        bgImageSettings[i].style.display = 'none';
        useBGImage = false;
        savedAppearance.useImage = false;
      }
    }
    //renderAppearance();
  })

  bgColorPick.addEventListener('change', function (event) {
    savedAppearance.bgColor = event.target.value;
    browsertop.style.backgroundColor = event.target.value;
    //renderAppearance();
  })

  bgURL.addEventListener('blur', function (event) {
    extractImageDimensions(bgURL.value);
    calculateStartingPercent(bgOrigHeight, bgOrigWidth, browsertop);
    browsertop.style.backgroundImage = `url(${bgURL.value})`
    savedAppearance.bgURL = bgURL.value;
    savedAppearance.bgSize = `${finalWidthInPx}px ${finalHeightInPx}px`;
    if (currentImageDisplay == 'percent') {
      convertPercentsToPixels(heightPercent, widthPercent,bgSizeSlider.value,browsertop);
      browsertop.style.backgroundSize = `${finalWidthInPx}px ${finalHeightInPx}px`;
      //renderAppearance();
    } else {
      //renderAppearance();
    }
  })
}

function renderAppearance(appearanceObject = savedAppearance, parentElement = browsertop) {
  killBackground(parentElement);
  var bgColorPick = document.getElementById('background-color');
  var imageCheck = document.getElementById('use-image');
  var bgImageSettings = document.getElementsByClassName('background-image-settings');
  //console.log(bgImageSettings);
  var bgURL = document.getElementById('image-link');
  var currentRadio = document.getElementById(appearanceObject.radioId);
  if (appearanceObject.useImage) {
    calculateStartingPercent(savedAppearance.bgNaturalHeight, savedAppearance.bgNaturalWidth, parentElement);
    parentElement.style.backgroundImage = `url(${appearanceObject.bgURL})`;
    handleDisplayType(appearanceObject.radioValue, parentElement, appearanceObject.sliderValue);
    bgSizeSlider.value = appearanceObject.sliderValue;
    imageCheck.checked = appearanceObject.useImage;
    bgURL.value = appearanceObject.bgURL;
    for (let i = 0; i < bgImageSettings.length; i++) {
        bgImageSettings[i].style.display = 'block';
    }
    currentRadio.checked = true;
  } else {
    for (let i = 0; i < bgImageSettings.length; i++) {
        bgImageSettings[i].style.display = 'none';
    }
  }
  parentElement.style.backgroundColor = appearanceObject.bgColor;
  bgColorPick.value = appearanceObject.bgColor;
}
