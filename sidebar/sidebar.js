const emptyState = document.getElementById('empty-state');
const frame = document.getElementById('frame');
const openTabBtn = document.getElementById('open-tab-btn');

let currentUrl = null;

openTabBtn.addEventListener('click', async () => {
    if (currentUrl) {
        const {id} = await chrome.windows.getCurrent();
        chrome.tabs.create({url: currentUrl});
        chrome.sidePanel.close({windowId: id});
    }
});

function loadUrl(url) {
    emptyState.hidden = true;
    frame.hidden = false;
    openTabBtn.hidden = false;
    currentUrl = url;
    const u = new URL(url);
    u.searchParams.set('_r', Math.random().toString(36).slice(2));
    frame.src = u.toString();
}

chrome.storage.local.get('sidebarUrl').then(({sidebarUrl}) => {
    if (sidebarUrl) loadUrl(sidebarUrl);
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.sidebarUrl?.newValue) {
        loadUrl(changes.sidebarUrl.newValue);
    }
});
