let browsertop = document.querySelector('.browsertop');
let menu = document.querySelector('#menu-container');
let totalContainer = document.querySelector('#browsertop-container');
let heldBookmark;
window.addEventListener('resize', sizeBrowsertop);

chrome.runtime.onInstalled.addListener(function(details) {
  if(details.reason == 'install') {
    console.log('Fresh install!')
  } else if (details.reason == 'update') {
    var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
  }
})

window.name = 'browsertop_1';

//if menu container is on bottom, use:
//sizeBrowsertop();
injectBackgroundMenu(menu);
createContextItems();
setAppearanceFormListeners();
fillFolder('1', browsertop);
