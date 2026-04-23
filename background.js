chrome.runtime.onInstalled.addListener(() => {
    chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: false}).catch(() => {
    });
    chrome.sidePanel.setOptions({enabled: true, path: 'sidebar/sidebar.html'}).catch(() => {
    });
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1],
        addRules: [{
            id: 1,
            priority: 1,
            action: {
                type: 'modifyHeaders',
                responseHeaders: [
                    {header: 'x-frame-options', operation: 'remove'},
                    {header: 'content-security-policy', operation: 'remove'},
                ]
            },
            condition: {resourceTypes: ['sub_frame']}
        }]
    }).catch(console.error);
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
        chrome.storage.local.set({sidebarUrl: message.url});
        chrome.sidePanel.open({tabId}).catch(console.error);
        sendResponse({ok: true});
    }

    if (message.action === 'close-sidebar') {
        const tabId = sender.tab?.id;
        if (tabId) chrome.sidePanel.close({tabId}).catch(console.error);
        sendResponse({ok: true});
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
