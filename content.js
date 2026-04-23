const OVERLAY_ID = '__ql_shadow_host__';
const CLOSE_ITEM = {id: '__close__', title: 'Close Sidebar', url: '', isClose: true};
const SETTINGS_ITEM = {id: '__settings__', title: 'Settings', url: '', isSettings: true};

const STYLES = `
  :host {
    all: initial;
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    pointer-events: none;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  [hidden] { display: none !important; }

  .backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 14vh;
    pointer-events: all;
    opacity: 0;
    transition: opacity 0.06s ease;
  }

  .backdrop.visible {
    opacity: 1;
  }

  .modal {
    width: 620px;
    max-width: calc(100vw - 48px);
    background: #1c1c1e;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.08);
    transform: scale(0.96) translateY(-8px);
    transition: transform 0.06s ease;
  }

  .backdrop.visible .modal {
    transform: scale(1) translateY(0);
  }

  .search-bar {
    display: flex;
    align-items: center;
    padding: 14px 16px;
    gap: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .search-icon {
    width: 18px;
    height: 18px;
    color: #8e8e93;
    flex-shrink: 0;
  }

  .search-tag {
    display: flex;
    align-items: center;
    gap: 5px;
    background: rgba(10, 132, 255, 0.15);
    border-radius: 6px;
    padding: 3px 8px;
    flex-shrink: 0;
    max-width: 160px;
  }

  .search-tag-favicon {
    width: 14px;
    height: 14px;
    border-radius: 2px;
    flex-shrink: 0;
    object-fit: contain;
  }

  .search-tag-title {
    color: #0a84ff;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .search-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #f5f5f7;
    font-size: 16px;
    line-height: 1.5;
    font-family: inherit;
    caret-color: #0a84ff;
  }

  .search-input::placeholder {
    color: #48484a;
  }

  .esc-badge {
    font-size: 11px;
    color: #636366;
    background: rgba(255, 255, 255, 0.07);
    padding: 2px 7px;
    border-radius: 5px;
    font-family: inherit;
    letter-spacing: 0.02em;
  }

  .results {
    max-height: 380px;
    overflow-y: auto;
    padding: 6px;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.12) transparent;
  }

  .results::-webkit-scrollbar {
    width: 4px;
  }

  .results::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.12);
    border-radius: 2px;
  }

  .result-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.08s;
  }

  .result-item.selected {
    background: rgba(10, 132, 255, 0.18);
  }

  .result-item:hover:not(.selected) {
    background: rgba(255, 255, 255, 0.06);
  }

  .favicon {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    flex-shrink: 0;
    object-fit: contain;
    background: rgba(255,255,255,0.05);
  }

  .favicon-fallback {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    flex-shrink: 0;
    background: rgba(255,255,255,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .favicon-fallback svg {
    width: 12px;
    height: 12px;
    color: #636366;
  }

  .result-text {
    flex: 1;
    min-width: 0;
  }

  .result-title {
    color: #f5f5f7;
    font-size: 13.5px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
  }

  .result-url {
    color: #636366;
    font-size: 11.5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 1px;
    line-height: 1.4;
  }

  .result-arrow {
    color: #48484a;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    opacity: 0;
    transition: opacity 0.08s;
  }

  .result-item.selected .result-arrow {
    opacity: 1;
    color: #0a84ff;
  }

  .tab-badge {
    font-size: 10px;
    color: #0a84ff;
    background: rgba(10, 132, 255, 0.12);
    padding: 1px 6px;
    border-radius: 4px;
    font-family: inherit;
    flex-shrink: 0;
    letter-spacing: 0.02em;
  }

  .settings-icon-wrap {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    flex-shrink: 0;
    background: rgba(255,255,255,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .settings-icon-wrap svg {
    width: 12px;
    height: 12px;
    color: #636366;
  }

  .settings-divider {
    height: 1px;
    background: rgba(255,255,255,0.06);
    margin: 2px 6px;
  }

  .query-context {
    padding: 20px 16px 12px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .query-context-hint {
    color: #636366;
    font-size: 12px;
  }

  .query-url-preview {
    color: #3a3a3c;
    font-size: 11px;
    word-break: break-all;
    max-width: 100%;
  }

  .empty-state {
    padding: 32px;
    text-align: center;
    color: #48484a;
    font-size: 14px;
    line-height: 1.5;
  }

  .empty-state-sub {
    font-size: 12px;
    color: #3a3a3c;
    margin-top: 4px;
  }

  .footer {
    display: flex;
    gap: 16px;
    padding: 8px 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  .footer-hint {
    color: #48484a;
    font-size: 11px;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .footer-hint kbd {
    background: rgba(255, 255, 255, 0.07);
    color: #636366;
    padding: 1px 5px;
    border-radius: 4px;
    font-family: inherit;
    font-size: 10px;
    border: 1px solid rgba(255,255,255,0.06);
  }
`;

let shadowHost = null;
let shadowRoot = null;
let backdrop = null;
let searchInput = null;
let resultsEl = null;
let footerEl = null;
let searchTagEl = null;
let searchTagFavicon = null;
let searchTagTitle = null;

let allItems = [];
let filtered = [];
let selectedIndex = 0;
let isVisible = false;
let mode = 'selection'; // 'selection' | 'query'
let queryItem = null;

function getDisplayItems() {
    return [...filtered, CLOSE_ITEM, SETTINGS_ITEM];
}

function init() {
    shadowHost = document.createElement('div');
    shadowHost.id = OVERLAY_ID;
    Object.assign(shadowHost.style, {
        position: 'fixed',
        inset: '0',
        zIndex: '2147483647',
        pointerEvents: 'none',
        display: 'none',
    });

    shadowRoot = shadowHost.attachShadow({mode: 'open'});

    const styleEl = document.createElement('style');
    styleEl.textContent = STYLES;
    shadowRoot.appendChild(styleEl);

    backdrop = document.createElement('div');
    backdrop.className = 'backdrop';
    backdrop.innerHTML = `
        <div class="modal">
            <div class="search-bar">
                <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <div class="search-tag" hidden>
                    <img class="search-tag-favicon" alt="" />
                    <span class="search-tag-title"></span>
                </div>
                <input class="search-input" type="text" placeholder="Search your URLs…" autocomplete="off" spellcheck="false" />
                <span class="esc-badge">ESC</span>
            </div>
            <div class="results"></div>
            <div class="footer"></div>
        </div>`;

    searchInput = backdrop.querySelector('.search-input');
    resultsEl = backdrop.querySelector('.results');
    footerEl = backdrop.querySelector('.footer');
    searchTagEl = backdrop.querySelector('.search-tag');
    searchTagFavicon = backdrop.querySelector('.search-tag-favicon');
    searchTagTitle = backdrop.querySelector('.search-tag-title');

    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) hide();
    });

    searchInput.addEventListener('input', onInput);
    searchInput.addEventListener('keydown', onKeydown);

    shadowRoot.appendChild(backdrop);
    document.documentElement.appendChild(shadowHost);
}

async function show() {
    if (!shadowHost) init();

    const data = await chrome.storage.sync.get('urls');
    allItems = data.urls || [];
    filtered = [...allItems];
    selectedIndex = 0;
    mode = 'selection';
    queryItem = null;

    shadowHost.style.display = 'block';
    shadowHost.style.pointerEvents = 'auto';
    isVisible = true;

    searchInput.value = '';
    searchInput.placeholder = 'Search your URLs…';
    searchTagEl.hidden = true;
    renderResults();
    updateFooter();

    requestAnimationFrame(() => {
        backdrop.classList.add('visible');
        searchInput.focus();
    });
}

function hide() {
    isVisible = false;
    mode = 'selection';
    queryItem = null;
    backdrop.classList.remove('visible');
    shadowHost.style.pointerEvents = 'none';
    setTimeout(() => {
        if (!isVisible) shadowHost.style.display = 'none';
    }, 160);
}

function onInput(e) {
    if (mode === 'query') return;
    const q = e.target.value.trim().toLowerCase();
    filtered = q
        ? allItems.filter(
            (item) =>
                item.url.toLowerCase().includes(q) ||
                (item.title || '').toLowerCase().includes(q)
        )
        : [...allItems];
    selectedIndex = 0;
    renderResults();
    updateFooter();
}

function onKeydown(e) {
    const displayItems = getDisplayItems();

    if (mode === 'query') {
        if (e.key === 'Escape') {
            e.preventDefault();
            exitQueryMode();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const query = searchInput.value;
            const url = queryItem.url.replace(/%s/g, encodeURIComponent(query));
            exitQueryMode();
            hide();
            chrome.runtime.sendMessage({action: 'open-in-sidebar', url});
        }
        return;
    }

    if (e.key === 'Escape') {
        if (searchInput.value) {
            exitQueryMode();
        } else {
            hide();
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, displayItems.length - 1);
        renderResults(true);
        updateFooter();
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        renderResults(true);
        updateFooter();
    } else if (e.key === 'Tab') {
        e.preventDefault();
        const item = displayItems[selectedIndex];
        if (item && !item.isSettings && item.url.includes('%s')) {
            enterQueryMode(item);
        }
    } else if (e.key === 'Enter') {
        const item = displayItems[selectedIndex];
        if (item) launch(item);
    }
}

function enterQueryMode(item) {
    mode = 'query';
    queryItem = item;
    searchInput.value = '';
    searchInput.placeholder = 'Type your search…';

    if (item.favicon) {
        searchTagFavicon.src = item.favicon;
        searchTagFavicon.hidden = false;
    } else {
        searchTagFavicon.hidden = true;
    }
    try {
        searchTagTitle.textContent = item.title || new URL(item.url).hostname;
    } catch {
        searchTagTitle.textContent = item.title || item.url;
    }
    searchTagEl.hidden = false;

    renderResults();
    updateFooter();
    searchInput.focus();
}

function exitQueryMode() {
    mode = 'selection';
    queryItem = null;
    searchInput.value = '';
    searchInput.placeholder = 'Search your URLs…';
    searchTagEl.hidden = true;
    filtered = [...allItems];
    selectedIndex = 0;
    renderResults();
    updateFooter();
    searchInput.focus();
}

function renderResults(scrollIntoView = false) {
    if (mode === 'query') {
        const urlPreview = esc(queryItem.url).replace(/%s/g, '<strong style="color:#aeaeb2">%s</strong>');
        resultsEl.innerHTML = `
            <div class="query-context">
                <div class="query-context-hint">Type your search query and press <strong style="color:#f5f5f7">Enter</strong></div>
                <div class="query-url-preview">${urlPreview}</div>
            </div>`;
        return;
    }

    let html = '';

    if (filtered.length === 0) {
        const isEmpty = allItems.length === 0;
        html += `
      <div class="empty-state">
        ${isEmpty ? 'No URLs saved yet' : 'No results found'}
        ${isEmpty ? '<div class="empty-state-sub">Add URLs in the extension options</div>' : ''}
      </div>
    `;
    } else {
        html += filtered.map((item, i) => renderItem(item, i)).join('');
    }

    html += `<div class="settings-divider"></div>`;
    html += renderItem(CLOSE_ITEM, filtered.length);
    html += renderItem(SETTINGS_ITEM, filtered.length + 1);

    resultsEl.innerHTML = html;

    resultsEl.querySelectorAll('.result-item').forEach((el) => {
        el.addEventListener('mouseenter', () => {
            const newIndex = parseInt(el.dataset.index);
            if (newIndex !== selectedIndex) {
                resultsEl.querySelectorAll('.result-item').forEach((item) => {
                    item.classList.toggle('selected', parseInt(item.dataset.index) === newIndex);
                });
                selectedIndex = newIndex;
                updateFooter();
            }
        });
        el.addEventListener('click', () => {
            const item = getDisplayItems()[parseInt(el.dataset.index)];
            if (item) launch(item);
        });
    });

    if (scrollIntoView) {
        const sel = resultsEl.querySelector('.selected');
        if (sel) sel.scrollIntoView({block: 'nearest', behavior: 'smooth'});
    }
}

function renderItem(item, index) {
    const isSelected = index === selectedIndex;

    if (item.isClose) {
        return `
            <div class="result-item${isSelected ? ' selected' : ''}" data-index="${index}">
                <span class="settings-icon-wrap">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </span>
                <div class="result-text">
                    <div class="result-title">${esc(item.title)}</div>
                </div>
                <svg class="result-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </div>`;
    }

    if (item.isSettings) {
        return `
            <div class="result-item${isSelected ? ' selected' : ''}" data-index="${index}">
                <span class="settings-icon-wrap">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </span>
                <div class="result-text">
                    <div class="result-title">${esc(item.title)}</div>
                </div>
                <svg class="result-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </div>`;
    }

    const hasQuery = item.url.includes('%s');

    return `
        <div class="result-item${isSelected ? ' selected' : ''}" data-index="${index}">
            ${
                item.favicon
                    ? `<img class="favicon" src="${item.favicon}" alt="" />`
                    : `<span class="favicon-fallback"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></span>`
            }
            <div class="result-text">
                <div class="result-title">${esc(item.title || item.url)}</div>
                ${item.title ? `<div class="result-url">${esc(item.url)}</div>` : ''}
            </div>
            ${hasQuery ? '<span class="tab-badge">TAB</span>' : ''}
            <svg class="result-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6" />
            </svg>
        </div>`;
}

function updateFooter() {
    if (mode === 'query') {
        footerEl.innerHTML = `
            <span class="footer-hint"><kbd>ESC</kbd> Back to list</span>
            <span class="footer-hint"><kbd>↵</kbd> Search</span>
        `;
        return;
    }

    const displayItems = getDisplayItems();
    const selectedItem = displayItems[selectedIndex];
    const isSearchable = selectedItem && !selectedItem.isSettings && selectedItem.url.includes('%s');

    footerEl.innerHTML = `
        <span class="footer-hint"><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
        ${isSearchable ? '<span class="footer-hint"><kbd>Tab</kbd> Search</span>' : ''}
        <span class="footer-hint"><kbd>↵</kbd> Open in sidebar</span>
        <span class="footer-hint"><kbd>ESC</kbd> Close</span>
    `;
}

function launch(item) {
    if (item.isClose) {
        hide();
        chrome.runtime.sendMessage({action: 'close-sidebar'});
        return;
    }

    if (item.isSettings) {
        hide();
        chrome.runtime.sendMessage({
            action: 'open-in-sidebar',
            url: chrome.runtime.getURL('options/options.html'),
        });
        return;
    }

    if (item.url.includes('%s')) {
        enterQueryMode(item);
        return;
    }

    hide();
    chrome.runtime.sendMessage({action: 'open-in-sidebar', url: item.url});
}

function esc(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'toggle-launcher') {
        isVisible ? hide() : show();
    }
});
