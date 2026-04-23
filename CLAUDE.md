# Quick Launch — Chrome Extension

A Chrome extension that lets users search and open a personal list of saved URLs directly into Chrome's built-in sidebar panel, triggered by a keyboard shortcut (`Ctrl+Space`).

## Goal

Provide a fast, keyboard-driven URL launcher that opens pages in Chrome's side panel without leaving the current tab.

## Key Concepts

### Architecture (Manifest V3)

- **`background.js`** — Service worker. Handles the `toggle-launcher` command, relays messages to the active tab's content script, opens the side panel, stores the active URL in `chrome.storage.session`, and fetches favicons via Google's favicon service to avoid CORS issues.
- **`content.js`** — Injected into every page. Renders the launcher overlay using a Shadow DOM (to avoid style leakage), handles search filtering, keyboard navigation, and sends the selected URL to the background to open in the sidebar.
- **`sidebar/`** — The side panel UI. Loads the chosen URL in an `<iframe>` with a toolbar showing the favicon, title, and URL. Handles `X-Frame-Options` blocks gracefully (shows an error + "open in tab" fallback). Reacts to `chrome.storage.session` changes to update while the sidebar is open.
- **`options/`** — Settings page for managing the saved URL list. Persists entries (URL, optional title, favicon data URL) to `chrome.storage.sync`.

### Data Model

Entries stored in `chrome.storage.sync` under the `urls` key:

```js
{ id: string, url: string, title: string, favicon: string | null }
```

Favicons are fetched once on add and stored as base64 data URLs.

### UI / UX Patterns

- Overlay uses Shadow DOM so extension styles never conflict with host-page styles.
- Launcher animates in with opacity + scale transition; hides after selection.
- Keyboard nav: `↑`/`↓` to select, `Enter` to open, `Esc` to close.
- Empty and no-results states are handled inline in the results list.

## File Map

```
manifest.json          Extension manifest (MV3)
background.js          Service worker
content.js             Launcher overlay (injected into pages)
sidebar/
  sidebar.html         Side panel page
  sidebar.js           Side panel logic
  sidebar.css          Side panel styles
options/
  options.html         Options page
  options.js           Options logic
  options.css          Options styles
icons/                 Extension icons (SVG + PNG)
generate-icons.js      Script to rasterise SVG icons to PNG
```
