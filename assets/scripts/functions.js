var currentMark = '';
var dragSource = null;
var bookmarkStateObject = JSON.parse(localStorage.getItem('bookmarkState')) || {};
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

  localStorage.setItem('contextCreated', JSON.stringify(false));
}

function createContextItems () {
  let urlPatterns = ['chrome://newtab/','chrome-extension://gidieppmajpbcdipahgchfpedgihomki/*'];
  if (!JSON.parse(localStorage.getItem('contextCreated'))) {
    chrome.contextMenus.create({'id':'create-bookmark', 'title':'Create New Bookmark', 'documentUrlPatterns':urlPatterns});

    chrome.contextMenus.create({'id':'remove-bookmark', 'title':'Remove Bookmark', 'contexts':['link'], 'documentUrlPatterns':urlPatterns});

    chrome.contextMenus.create({'id':'hide', 'title':'Hide', 'contexts':['link'], 'documentUrlPatterns':urlPatterns});

    chrome.contextMenus.create({'id':'show-hidden', 'title':'Show Hidden Items', 'contexts':['link'], 'documentUrlPatterns':urlPatterns});

    chrome.contextMenus.create({'id':'unhide', 'title':'Un-hide', 'contexts':['link'], 'documentUrlPatterns':urlPatterns});

    localStorage.setItem('contextCreated', JSON.stringify(true));
  }
}

function createIconFromBookmark (bookmark) {
  let iconHTML = ``;
  let text = bookmark.title;
  let bookmarkID = bookmark.id;
  if (!bookmark.children) {
    let url = bookmark.url;
    let faviconString = `chrome://favicon/${url}`
    iconHTML =
    `<a class="bt-shortcut _${bookmarkID}" draggable="true" target="_blank" href="${url}">
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
    `<a class="bt-shortcut folder _${bookmarkID}" href="#">
      <div class="icon-pic" draggable="true" style="background: rgba(255,255,255,0)">
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

function convertMarkClass (markClass) {
  return markClass.slice(1);
}

function getIdFromElement (element) {
  return element.classList[element.classList.length-1].slice(1);
}

function openFolder (subTreeId) {
  return window.open("new-window.html", `Folder${subTreeId}`,"width=500,height=300,scrollbar=yes")
}

function createFolderLinks () {
  var allFolders = document.querySelectorAll('.folder');
  for (let i = 0; i < allFolders.length; i++) {
    allFolders[i].addEventListener('click', function (event) {
      let bookmarkId = allFolders[i].classList[allFolders[i].classList.length - 1];
      openFolder(bookmarkId);
    });
  }
}

function fillFolder (subTreeId, browsertopSpace, linkCreationFunction = createFolderLinks) {
  chrome.bookmarks.getSubTree(subTreeId, function(mark) {
    for (let i = 0; i < mark[0].children.length; i++) {
      browsertopSpace.innerHTML += createIconFromBookmark(mark[0].children[i]);
    }
    linkCreationFunction();
    setShortcutListeners();
    setFolderOnlyListeners();
    setFolderSpaceListener();

  })
}

function populateFolderHTML () {
  let folderNode = window.name.split('_')[1];
  var title = document.querySelector('title');
  var folderContain = document.querySelector('.folder-container');
  var folderSpace = document.querySelector('.folder-container');
  chrome.bookmarks.getSubTree(folderNode, function (tree) {
    title.innerHTML = `${tree[0].title}`;
    folderContain.classList.add(`_${folderNode}`)
  });
  fillFolder(folderNode, folderSpace);
}

function setShortcutListeners () {
  let shortcuts = document.getElementsByClassName('bt-shortcut');
  for (let i = 0; i < shortcuts.length; i++) {
    shortcuts[i].addEventListener('dragstart', handleDragStart);
    shortcuts[i].addEventListener('dragend', handleDragEnd);
    shortcuts[i].addEventListener('contextmenu', function (event) {
      currentMark = getIdFromElement(event.currentTarget);
      console.log(currentMark);
    })
  }
}

function setFolderOnlyListeners () {
  let folders = document.getElementsByClassName('folder');
  for (let i = 0; i < folders.length; i++) {
    folders[i].addEventListener('drop', handleDrop);
  }
}

function setFolderSpaceListener () {
  let backdrop = document.querySelector('.folder-container');
  backdrop.addEventListener('drop', handleDrop);
}

function handleDrop(event) {
  console.log('lol im in boss')
  // if (event.stopPropagation) {
  //   event.stopPropagation();
  // }
  if (dragSource !== event.target) {
    let draggedNode = event.transferData.getData('markNode');
    let targetFolder = getIdFromElement(event.target);
    console.log('dragNode:', draggedNode);
    console.log('targetFolderNode:', targetFolder);
  }
}

function handleDragEnd (event) {
  event.target.style.opacity = '1';
}

function handleDragOver(event) {
  if (event.preventDefault) {
    event.preventDefault();
  }
}

function handleDrag (event) {

}

function handleDragStart (event) {
  dragSource = event.target;
  event.target.style.opacity = '0.4';
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('markNode', getIdFromElement(event.target));
  //console.log(event.dataTransfer.getData('markNode'));
}

function handleDelete (nodeToKill) {
  let elementTarget = document.querySelector(`._${nodeToKill}`);
  chrome.bookmarks.remove(nodeToKill);
  elementTarget.parentNode.removeChild(elementTarget);
}

chrome.contextMenus.onClicked.addListener(function (event) {
  switch (event.menuItemId) {
    case 'create-bookmark':
    break;
    case 'hide-bookmark':
    break;
    case 'remove-bookmark':
    handleDelete(currentMark);
    currentMark = '';
    break;
    default:
    currentMark = '';
    break;
  }
})
