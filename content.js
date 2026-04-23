const OVERLAY_ID = '__ql_shadow_host__';

const STYLES = `
  :host {
    all: initial;
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    pointer-events: none;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

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

  .favicon.hidden {
    display: none;
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

let allItems = [];
let filtered = [];
let selectedIndex = 0;
let isVisible = false;

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

  shadowRoot = shadowHost.attachShadow({ mode: 'open' });

  const styleEl = document.createElement('style');
  styleEl.textContent = STYLES;
  shadowRoot.appendChild(styleEl);

  backdrop = document.createElement('div');
  backdrop.className = 'backdrop';
  backdrop.innerHTML = `
    <div class="modal">
      <div class="search-bar">
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input class="search-input" type="text" placeholder="Search your URLs…" autocomplete="off" spellcheck="false" />
        <span class="esc-badge">ESC</span>
      </div>
      <div class="results"></div>
      <div class="footer">
        <span class="footer-hint"><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
        <span class="footer-hint"><kbd>↵</kbd> Open in sidebar</span>
        <span class="footer-hint"><kbd>ESC</kbd> Close</span>
      </div>
    </div>
  `;

  searchInput = backdrop.querySelector('.search-input');
  resultsEl = backdrop.querySelector('.results');

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

  shadowHost.style.display = 'block';
  shadowHost.style.pointerEvents = 'auto';
  isVisible = true;

  searchInput.value = '';
  renderResults();

  requestAnimationFrame(() => {
    backdrop.classList.add('visible');
    searchInput.focus();
  });
}

function hide() {
  isVisible = false;
  backdrop.classList.remove('visible');
  shadowHost.style.pointerEvents = 'none';
  setTimeout(() => {
    if (!isVisible) shadowHost.style.display = 'none';
  }, 160);
}

function onInput(e) {
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
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    hide();
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    selectedIndex = Math.min(selectedIndex + 1, filtered.length - 1);
    renderResults(true);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    selectedIndex = Math.max(selectedIndex - 1, 0);
    renderResults(true);
  } else if (e.key === 'Enter') {
    if (filtered[selectedIndex]) launch(filtered[selectedIndex].url);
  }
}

function renderResults(scrollIntoView = false) {
  if (filtered.length === 0) {
    const isEmpty = allItems.length === 0;
    resultsEl.innerHTML = `
      <div class="empty-state">
        ${isEmpty ? 'No URLs saved yet' : 'No results found'}
        ${isEmpty ? '<div class="empty-state-sub">Add URLs in the extension options</div>' : ''}
      </div>
    `;
    return;
  }

  resultsEl.innerHTML = filtered
    .map(
      (item, i) => `
    <div class="result-item${i === selectedIndex ? ' selected' : ''}" data-index="${i}">
      ${
        item.favicon
          ? `<img class="favicon" src="${item.favicon}" alt="" />`
          : `<span class="favicon-fallback"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></span>`
      }
      <div class="result-text">
        <div class="result-title">${esc(item.title || item.url)}</div>
        ${item.title ? `<div class="result-url">${esc(item.url)}</div>` : ''}
      </div>
      <svg class="result-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </div>
  `
    )
    .join('');

  resultsEl.querySelectorAll('.result-item').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      selectedIndex = parseInt(el.dataset.index);
      renderResults();
    });
    el.addEventListener('click', () => {
      const item = filtered[parseInt(el.dataset.index)];
      if (item) launch(item.url);
    });
  });

  if (scrollIntoView) {
    const sel = resultsEl.querySelector('.selected');
    if (sel) sel.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

function launch(url) {
  hide();
  chrome.runtime.sendMessage({ action: 'open-in-sidebar', url });
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
