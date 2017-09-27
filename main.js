let browsertop = document.querySelector('.browsertop');
let menu = document.querySelector('#menu-container');
let totalContainer = document.querySelector('#browsertop-container');

function sizeBrowsertop () {
  let menuHeight = menu.clientHeight;
  let totalHeight = totalContainer.clientHeight;
  let browsertopHeight = totalHeight - menuHeight;
  browsertop.style.height = `${browsertopHeight}px`
}

window.addEventListener('resize', sizeBrowsertop);

chrome.runtime.onInstalled.addListener(function(details) {
  if(details.reason == 'install') {
    console.log('This is the first install!')
  } else if (details.reason == 'update') {
    var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
  }
})
//above code inspired by Alvin Wong

function createContextItems () {
  if (!localStorage.getItem('contextCreated')) {
    chrome.contextMenus.create({'id':'create-bookmark', 'title':'Create New Bookmark', 'onclick':function () {
      console.log('lol like I would.')
      }
    });

    chrome.contextMenus.create({'id':'remove-bookmark', 'title':'Remove Bookmark', 'contexts':['link']});

    localStorage.setItem('contextCreated', true);
  }
}
createContextItems();

sizeBrowsertop();

chrome.bookmarks.getRecent(20, function(mark) {
  for (let i = 0; i < mark.length; i++) {
    browsertop.innerHTML += createIconFromBookmark(mark[i]);
  }
})

function createIconFromBookmark (bookmark) {
  let url = bookmark.url;
  let text = bookmark.title;
  let bookmarkID = bookmark.id;
  let faviconString = `chrome://favicon/${url}`
  let iconHTML =
  `<a class="icon ${bookmarkID}" href="${url}">
    <div class="icon-pic">
      <img src=${faviconString}>
    </div>
    <div class="icon-text">
      <p>${text}</p>
    </div>
  </a>`;
  return iconHTML;
}
