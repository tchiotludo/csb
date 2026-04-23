const emptyState = document.getElementById('empty-state');
const frame = document.getElementById('frame');
const openTabBtn = document.getElementById('open-tab-btn');

openTabBtn.addEventListener('click', async () => {
    if (frame.src) {
        const {id} = await chrome.windows.getCurrent();
        chrome.tabs.create({url: frame.src});
        chrome.sidePanel.close({windowId: id});
    }
});

function loadUrl(url) {
    emptyState.hidden = true;
    frame.hidden = false;
    openTabBtn.hidden = false;
    frame.src = url;
}

chrome.storage.local.get('sidebarUrl').then(({sidebarUrl}) => {
    if (sidebarUrl) loadUrl(sidebarUrl);
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.sidebarUrl?.newValue) {
        loadUrl(changes.sidebarUrl.newValue);
    }
});
