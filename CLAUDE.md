# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome extension that provides multi-platform shopping search functionality for Taiwanese e-commerce sites. Users can right-click selected text to search across multiple shopping platforms, manage search history, and maintain a wishlist.

## Development Commands

```bash
# Install dependencies
npm install

# Development build (watches for changes)
npm run dev

# Production build
npm run build

# Create distributable ZIP file
npm run zip
```

Note: The build process automatically updates the version in `src/manifest.json` from `package.json`.

## Architecture

### Core Components

- **background.js**: Service worker that handles context menus, storage initialization, and search functionality
- **popup.js**: Main UI logic for the extension popup (settings, history, wishlist, disabled sites)
- **settings.js**: Configuration file containing default disabled sites
- **manifest.json**: Chrome extension manifest (version auto-synced from package.json)

### Key Features

1. **Context Menu Search**: Right-click selected text to search on individual platforms or all platforms at once
2. **Site Management**: Enable/disable shopping platforms, organized by categories (shopping, books, games)
3. **Search History**: Tracks searches in local storage (limited to 100 entries)
4. **Wishlist Management**: Store items with URLs or plain text
5. **Disabled Sites**: Prevent context menus from appearing on specified domains

### Storage Architecture

- **chrome.storage.sync**: Sites configuration, wishlist, disabled sites
- **chrome.storage.local**: Search history (for better performance)

### Supported Platforms

The extension supports multiple categories of platforms:
- Shopping: momo, PChome, 露天拍賣, 蝦皮購物, Yahoo購物
- Books: 博客來, 誠品, Taaze
- Games: Scryfall, 遊戲平方

### Build Process

Uses Webpack to bundle JavaScript modules and copy static assets to the `dist/` directory. The build process:
1. Bundles background.js and popup.js
2. Copies HTML, CSS, JSON, and PNG files from src/ to dist/
3. Updates manifest.json version from package.json

### Testing

No automated testing framework is configured. Manual testing involves:
1. Load unpacked extension from `dist/` folder
2. Test right-click context menus on various sites
3. Verify popup functionality (settings, history, wishlist)
4. Check disabled sites functionality

### File Structure

```
src/
├── background.js       # Service worker (context menus, storage)
├── popup.js           # Popup UI logic
├── popup.html         # Popup interface
├── popup.css          # Popup styles
├── settings.js        # Default configurations
├── manifest.json      # Extension manifest
└── icon*.png          # Extension icons
```