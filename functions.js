
function sizeBrowsertop () {
  let menuHeight = menu.clientHeight;
  let totalHeight = totalContainer.clientHeight;
  let browsertopHeight = totalHeight - menuHeight;
  browsertop.style.height = `${browsertopHeight}px`
}

function removeContextItems () {
  chrome.contextMenus.remove('create-bookmark');

  chrome.contextMenus.remove('remove-bookmark');

  chrome.contextMenus.remove('hide-bookmark');
}

function createContextItems () {
  if (!localStorage.getItem('contextCreated')) {
    chrome.contextMenus.create({'id':'create-bookmark', 'title':'Create New Bookmark', 'onclick':function () {
      console.log('lol like I would.')
      }
    });

    chrome.contextMenus.create({'id':'remove-bookmark', 'title':'Remove Bookmark', 'contexts':['link']});

    chrome.contextMenus.create({'id':'hide-bookmark', 'title':'Hide Bookmark', 'contexts':['link']});

    localStorage.setItem('contextCreated', true);
  }
}

function fillFolder (subTreeId, browsertopSpace) {
  chrome.bookmarks.getSubTree(subTreeId, function(mark) {
    for (let i = 0; i < mark[0].children.length; i++) {
      browsertopSpace.innerHTML += createIconFromBookmark(mark[0].children[i]);
    }
  })
}

function createIconFromBookmark (bookmark) {
  let iconHTML = ``;
  let text = bookmark.title;
  let bookmarkID = bookmark.id;
  if (!bookmark.children) {
    let url = bookmark.url;
    let faviconString = `chrome://favicon/${url}`
    iconHTML =
    `<a class="bt-shortcut draggable ${bookmarkID}" href="${url}">
      <div class="icon-pic">
        <img src=${faviconString}>
      </div>
      <div class="shortcut-text">
        <p>${text}</p>
      </div>
    </a>`;
  } else if (Array.isArray(bookmark.children)) {
    let folderIcon = `<img class="icon icons8-Folder" src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjAiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNDAgNDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQwIDQwOyIgZmlsbD0iI2ZhbHNlIiA+PGc+CTxwb2x5Z29uIHN0eWxlPSJmaWxsOiNEQkIwNjU7IiBwb2ludHM9IjEuNSwzNS41IDEuNSw0LjUgMTEuNzkzLDQuNSAxNC43OTMsNy41IDM4LjUsNy41IDM4LjUsMzUuNSAJIj48L3BvbHlnb24+CTxnPgkJPHBhdGggc3R5bGU9ImZpbGw6Izk2N0E0NDsiIGQ9Ik0xMS41ODYsNWwyLjcwNywyLjcwN0wxNC41ODYsOEgxNWgyM3YyN0gyVjVIMTEuNTg2IE0xMiw0SDF2MzJoMzhWN0gxNUwxMiw0TDEyLDR6Ij48L3BhdGg+CTwvZz48L2c+PGc+CTxwb2x5Z29uIHN0eWxlPSJmaWxsOiNGNUNFODU7IiBwb2ludHM9IjEuNSwzNS41IDEuNSw5LjUgMTIuMTUxLDkuNSAxNS4xNTEsNy41IDM4LjUsNy41IDM4LjUsMzUuNSAJIj48L3BvbHlnb24+CTxnPgkJPHBhdGggc3R5bGU9ImZpbGw6Izk2N0E0NDsiIGQ9Ik0zOCw4djI3SDJWMTBoMTBoMC4zMDNsMC4yNTItMC4xNjhMMTUuMzAzLDhIMzggTTM5LDdIMTVsLTMsMkgxdjI3aDM4VjdMMzksN3oiPjwvcGF0aD4JPC9nPjwvZz48L3N2Zz4='/>`
    iconHTML =
    `<a class="bt-shortcut draggable ${bookmarkID}" href="#">
      <div class="icon-pic" style="background: rgba(255,255,255,0)">
        ${folderIcon}
      </div>
      <div class="shortcut-text">
        <p>${text}</p>
      </div>
    </a>`
  }
  return iconHTML;
}

function addBookmarkToFolder (bookmarkId, folderId) {
  chrome.bookmarks.move(bookmarkId, folderId);
}

function getIdFromElement (element) {
  return element.classList[element.classList.length-1];
}

function openFolder (subTreeId) {
  return window.open("new-window.html", `Folder_${subTreeId}`,"width=500,height=300,scrollbar=yes")
}

function populateFolderHTML () {
  let folderNode = window.name.split('_')[1];
  var title = document.querySelector('title');
  var folderSpace = document.querySelector('.folder-container');
  chrome.bookmarks.getSubTree(folderNode, function (tree) {
    title.innerHTML = `${tree[0].title}`;
  });
  fillFolder(folderNode, folderSpace);
}
