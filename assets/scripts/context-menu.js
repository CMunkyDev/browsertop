function removeContextItems () {
  chrome.contextMenus.remove('create-bookmark');

  chrome.contextMenus.remove('customize-appearance');

  chrome.contextMenus.remove('remove-bookmark');

  chrome.contextMenus.remove('hide-bookmark');

  chrome.contextMenus.remove('show-hidden');

  chrome.contextMenus.remove('unhide');

  localStorage.setItem('contextCreated', JSON.stringify(false));
}

function createContextItems () {
  let extensionURL = chrome.runtime.getURL('index.html');
  let urlPatterns = ['chrome://newtab/',`${extensionURL}/*`];
  if (!JSON.parse(localStorage.getItem('contextCreated'))) {
    /*chrome.contextMenus.create({'id':'create-bookmark', 'title':'Create New Bookmark', 'documentUrlPatterns':urlPatterns});*/

    chrome.contextMenus.create({'id':'customize-appearance', 'title':'Customize Appearance', 'documentUrlPatterns':urlPatterns});

    chrome.contextMenus.create({'id':'remove-bookmark', 'title':'Remove Bookmark', 'contexts':['link'], 'documentUrlPatterns':urlPatterns});

    /*chrome.contextMenus.create({'id':'hide', 'title':'Hide', 'contexts':['link'], 'documentUrlPatterns':urlPatterns});

    chrome.contextMenus.create({'id':'show-hidden', 'title':'Show Hidden Items', 'contexts':['link'], 'documentUrlPatterns':urlPatterns});

    chrome.contextMenus.create({'id':'unhide', 'title':'Un-hide', 'contexts':['link'], 'documentUrlPatterns':urlPatterns});*/

    localStorage.setItem('contextCreated', JSON.stringify(true));
  }
}

chrome.contextMenus.onClicked.addListener(function (event) {
  switch (event.menuItemId) {
    case 'create-bookmark':
    break;
    case 'remove-bookmark':
    handleDelete(currentMark);
    currentMark = '';
    break;
    case 'hide':
    currentMark = '';
    break;
    case 'show-hidden':
    break;
    case 'unhide':
    currentMark = '';
    break;
    case 'customize-appearance':
    toggleDisplayBlockNone(menu);
    break;
    default:
    currentMark = '';
    break;
  }
})
