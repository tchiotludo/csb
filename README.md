# Quick Launch

A Chrome extension that lets you search and open your saved URLs directly in Chrome's built-in sidebar — triggered by a keyboard shortcut.

Press **`Ctrl+Space`** on any page → type to filter → hit **`Enter`** → the URL opens in the side panel. Never lose your place on the current tab.

---

## Features

- **Instant search** — fuzzy-filter your saved URLs by title or address
- **Keyboard-driven** — `↑`/`↓` to navigate, `Enter` to open, `Esc` to close
- **Side panel** — pages open in Chrome's native sidebar, not a new tab
- **Favicon support** — saved entries display their site icon
- **Shadow DOM overlay** — the launcher UI never clashes with host-page styles
- **Sync storage** — your URL list follows you across devices via Chrome sync
- **Graceful fallback** — if a site blocks iframes, the sidebar shows an error and an "open in tab" button

---

## Screenshots

> _Add screenshots here once the extension is published._

---

## Installation

### From source (developer mode)

1. Clone this repo:
   ```bash
   git clone https://github.com/tchiotludo/csb.git
   cd csb
   ```

2. Open Chrome and go to `chrome://extensions`

3. Enable **Developer mode** (toggle in the top-right corner)

4. Click **Load unpacked** and select the cloned `src` folder

5. The extension is now active — try `Ctrl+Space` on any page

> **Note:** The keyboard shortcut may conflict with other extensions. You can remap it at `chrome://extensions/shortcuts`.

---

## Usage

### Opening the launcher

Press **`Ctrl+Space`** on any tab. The launcher overlay appears on top of the page.

### Navigating

| Key | Action |
|-----|--------|
| Type anything | Filter your saved URLs |
| `↑` / `↓` | Move selection up / down |
| `Enter` | Open selected URL in the sidebar |
| `Esc` | Close the launcher |

### Managing your URLs

Click the extension icon → **Options**, or go to `chrome://extensions` → Quick Launch → **Extension options**.

From there you can:
- Add URLs with an optional custom title
- Reorder entries by dragging
- Delete entries

---

## Architecture

Built with **Manifest V3**.

| File | Role |
|------|------|
| `background.js` | Service worker — handles the keyboard command, opens the side panel, stores the active URL in `chrome.storage.session`, fetches favicons via Google's service to avoid CORS |
| `content.js` | Injected into every page — renders the launcher overlay in a Shadow DOM, handles search & keyboard nav |
| `sidebar/` | Side panel UI — loads the selected URL, shows favicon + title, reacts to storage changes |
| `options/` | Settings page — manages the saved URL list, persists to `chrome.storage.sync` |

### Data model

Each entry stored under the `urls` key in `chrome.storage.sync`:

```json
{
  "id": "string",
  "url": "string",
  "title": "string",
  "favicon": "data:image/png;base64,..."
}
```

---

## Contributing

Pull requests are welcome! For major changes please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create a branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push: `git push origin feat/my-feature`
5. Open a pull request

---

## License

[MIT](LICENSE) © Ludovic Dehon
