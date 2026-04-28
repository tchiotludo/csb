chrome.runtime.onInstalled.addListener(() => {
    chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: false}).catch(() => {});
    chrome.sidePanel.setOptions({enabled: false}).catch(() => {});
});

chrome.commands.onCommand.addListener((command) => {
    if (command !== 'toggle-launcher') return;
    chrome.tabs.query({active: true, currentWindow: true}, ([tab]) => {
        if (!tab?.id) return;
        chrome.tabs.sendMessage(tab.id, {action: 'toggle-launcher'}).catch(() => {
        });
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'open-in-sidebar') {
        const tabId = sender.tab?.id;
        if (!tabId) {
            sendResponse({ok: false});
            return;
        }
        chrome.sidePanel.setOptions({tabId, enabled: true, path: message.url}).catch(console.error);
        chrome.sidePanel.open({tabId}).catch(console.error);
        chrome.storage.session.set({sidebarOpen: true});
        sendResponse({ok: true});
    }

    if (message.action === 'close-sidebar') {
        const tabId = sender.tab?.id;
        if (tabId) {
            chrome.sidePanel.close({tabId}).catch(() => {});
            chrome.sidePanel.setOptions({tabId, enabled: false}).catch(() => {});
        }
        chrome.storage.session.set({sidebarOpen: false});
        sendResponse({ok: true});
    }

    if (message.action === 'get-sidebar-state') {
        chrome.storage.session.get('sidebarOpen').then(data => {
            sendResponse({sidebarOpen: !!data.sidebarOpen});
        });
        return true;
    }

    if (message.action === 'fetch-favicon') {
        fetchFavicon(message.url)
            .then(dataUrl => sendResponse({dataUrl}))
            .catch(() => sendResponse({dataUrl: null}));
        return true;
    }
});

async function fetchFavicon(url) {
    const domain = new URL(url).hostname;
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    const response = await fetch(faviconUrl);
    if (!response.ok) return null;
    const blob = await response.blob();
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}
