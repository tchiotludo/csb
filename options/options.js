const form = document.getElementById('add-form');
const inputUrl = document.getElementById('input-url');
const inputTitle = document.getElementById('input-title');
const btnAdd = document.getElementById('btn-add');
const statusMsg = document.getElementById('status-msg');
const urlListEl = document.getElementById('url-list');
const countBadge = document.getElementById('count-badge');

let items = [];

async function load() {
  const data = await chrome.storage.sync.get('urls');
  items = data.urls || [];
  render();
}

function render() {
  countBadge.textContent = items.length;

  if (items.length === 0) {
    urlListEl.innerHTML = `
      <div class="empty-list">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
        <p>No URLs yet. Add your first one above.</p>
      </div>
    `;
    return;
  }

  urlListEl.innerHTML = items
    .map(
      (item, i) => `
    <div class="url-entry" data-id="${item.id}">
      ${faviconHtml(item)}
      <div class="entry-text">
        <div class="entry-title">${esc(item.title || item.url)}</div>
        ${item.title ? `<div class="entry-url">${esc(item.url)}</div>` : ''}
      </div>
      <div class="entry-actions">
        <button class="btn-icon delete" title="Delete" data-index="${i}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
            <path d="M9 6V4h6v2"/>
          </svg>
        </button>
      </div>
    </div>
  `
    )
    .join('');

  urlListEl.querySelectorAll('.btn-icon.delete').forEach((btn) => {
    btn.addEventListener('click', () => deleteItem(parseInt(btn.dataset.index)));
  });
}

function faviconHtml(item) {
  if (item.faviconLoading) {
    return `<span class="entry-favicon-spinner"><span class="spinner"></span></span>`;
  }
  if (item.favicon) {
    return `<img class="entry-favicon" src="${item.favicon}" alt="" />`;
  }
  return `
    <span class="entry-favicon-fallback">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    </span>
  `;
}

async function save() {
  await chrome.storage.sync.set({ urls: items.map(stripTransient) });
}

function stripTransient(item) {
  const { faviconLoading, ...rest } = item;
  return rest;
}

async function addItem(url, title) {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
  const item = { id, url, title: title || '', favicon: null, faviconLoading: true };
  items.push(item);
  render();

  // Fetch favicon via background (avoids CORS issues in extension pages)
  try {
    const response = await chrome.runtime.sendMessage({ action: 'fetch-favicon', url });
    item.favicon = response?.dataUrl || null;
  } catch {
    item.favicon = null;
  }
  item.faviconLoading = false;

  await save();
  render();
}

async function deleteItem(index) {
  items.splice(index, 1);
  await save();
  render();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const url = inputUrl.value.trim();
  const title = inputTitle.value.trim();

  if (!url) return;

  try {
    new URL(url);
  } catch {
    showStatus('Invalid URL — make sure to include https://', 'error');
    return;
  }

  if (items.some((item) => item.url === url)) {
    showStatus('This URL is already in your list', 'error');
    return;
  }

  btnAdd.disabled = true;
  await addItem(url, title);
  inputUrl.value = '';
  inputTitle.value = '';
  btnAdd.disabled = false;
  showStatus('URL added successfully', 'success');
  inputUrl.focus();
});

function showStatus(msg, type) {
  statusMsg.textContent = msg;
  statusMsg.className = `status-msg ${type}`;
  statusMsg.hidden = false;
  setTimeout(() => {
    statusMsg.hidden = true;
  }, 3000);
}

function esc(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

load();
