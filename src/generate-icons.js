// Run with: node generate-icons.js
// Generates PNG icons from SVG using sharp or canvas
const fs = require('fs');
const path = require('path');

// Minimal 1x1 transparent PNG fallback — icons are optional for sideloaded extensions
// For proper icons, use an image editor or online converter with the SVG below

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a84ff"/>
      <stop offset="100%" style="stop-color:#5e5ce6"/>
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#g)"/>
  <polygon points="72 20 32 72 64 72 56 108 96 56 64 56 72 20" fill="white"/>
</svg>`;

fs.writeFileSync(path.join(__dirname, 'icons', 'icon.svg'), SVG);
console.log('Saved icons/icon.svg — convert to PNG at sizes 16, 48, 128 with:');
console.log('  npx sharp-cli -i icons/icon.svg -o icons/icon16.png resize 16');
console.log('  npx sharp-cli -i icons/icon.svg -o icons/icon48.png resize 48');
console.log('  npx sharp-cli -i icons/icon.svg -o icons/icon128.png resize 128');
