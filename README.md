# 台灣多平台購物搜尋 (Multi-Platform Shopping Search)

![License](https://img.shields.io/github/license/DCForce/ruten-shopping-search-extension)
![Version](https://img.shields.io/github/v/release/DCForce/ruten-shopping-search-extension)
![Issues](https://img.shields.io/github/issues/DCForce/ruten-shopping-search-extension)

Chrome 擴充功能，輕鬆在多個購物平台上搜尋比價。
內建搜尋歷史跟簡單的文字待購清單功能。


## ✨ 功能特色

- 🔍 一鍵在多個購物平台搜尋商品
- 🛍️ 支援多個台灣購物平台（共 10 個平台）：
  - **購物平台**：momo購物網、PChome、露天拍賣、蝦皮購物、Yahoo購物
  - **書店平台**：博客來、誠品、Taaze
  - **遊戲平台**：Scryfall、遊戲平方
- 📝 自動記錄搜尋歷史（最多 100 筆，包含時間戳記與平台資訊）
- 📋 智慧待購清單管理
  - 自動偵測 URL 並建立可點擊連結
  - 一鍵新增目前瀏覽頁面
  - 自動過濾重複項目
- ⚙️ 彈性的平台設定
  - 依分類（購物/書店/遊戲）批次啟用/停用
  - 個別平台開關控制
- 🚫 指定網域停用右鍵搜尋（預設停用 netflix.com）
- 🔄 跨裝置同步設定（使用 Chrome Storage Sync）

## 📥 安裝方式

### 從 Chrome Web Store 安裝（推薦）

1. 前往 [Chrome Web Store](https://chromewebstore.google.com/detail/cpgmdkgicjdjfpaenckloocokjbmibai)
2. 點擊「新增至 Chrome」
3. 確認安裝

### 手動安裝（開發版）

1. 下載此專案的 ZIP 檔案
2. 解壓縮到本地資料夾
3. 打開 Chrome 擴充功能頁面 (chrome://extensions/)
4. 開啟「開發人員模式」
5. 點擊「載入未封裝項目」
6. 選擇解壓縮後的資料夾

## 🚀 使用方式

1. 在網頁上選取商品名稱
2. 點擊右鍵，選擇想要搜尋的平台
   - 可選擇單一平台搜尋
   - 或使用「在所有平台搜尋」一次搜尋所有平台
3. 自動開啟新分頁顯示搜尋結果
4. 點擊工具列圖示可：
   - 管理平台設定
   - 查看搜尋歷史
   - 編輯待購清單
   - 管理停用網域

### 停用網域管理
在「停用網域」分頁中可新增或移除停用的網域。當前頁面網域（包含子網域）在清單中時，右鍵選單將不會顯示搜尋選項。擴充功能預設停用 netflix.com。

## 🛠️ 開發相關

### 技術框架

- HTML/CSS/JavaScript
- Chrome Extension Manifest V3
- Webpack 5 (模組打包)
- Chrome Storage API (Sync & Local)

### 本地開發

1. Clone the repository:
```bash
git clone https://github.com/DCForce/ruten-shopping-search-extension.git
```

2. Install dependencies:
```bash
cd ruten-shopping-search-extension
npm install
```

3. Development mode:
```bash
npm run dev
```

4. Release (Dist):
```bash
npm run build
```
- Update the version variable in package.json before building the extension

```bash
npm run zip
```

### Testing
To manually test the Chrome extension:
1. Clone the repository and install dependencies (run ```npm install```).
2. Run ```npm run build``` to produce the dist/ directory (or ```npm run dev``` to watch for changes).
3. Open ```chrome://extensions``` in a Chrome browser and enable “Developer mode”.
4. Click **Load unpacked** and select the generated ```dist/``` folder.
5. Interact with the extension:
   - Right‑click selected text on any page to verify the search options appear.
   - Use the extension’s popup to check settings, search history, and the wishlist.
   - Confirm new tabs open with the correct URLs and history/wishlist entries persist.

There are no scripts or documentation for automated tests, so testing is currently manual. Automated testing could be added using tools like Puppeteer to simulate browser interactions, but such infrastructure isn’t present in the repository.


### 專案結構

```
├── src/
│   ├── manifest.json      # 擴充功能設定檔
│   ├── background.js      # Service Worker (右鍵選單、儲存管理)
│   ├── popup.html         # 彈出視窗介面
│   ├── popup.css          # 彈出視窗樣式
│   ├── popup.js           # 彈出視窗邏輯
│   ├── settings.js        # 預設設定
│   └── icon*.png          # 擴充功能圖示
├── dist/                  # 建置輸出目錄
├── webpack.config.js      # Webpack 設定
└── package.json           # 專案依賴與版本管理
```

## 🤝 貢獻指南

我們歡迎所有形式的貢獻，包括但不限於：

- 提交 issues
- 提出新功能建議
- 改進文檔
- 提交 pull requests

請參考我們的 [貢獻指南](CONTRIBUTING.md) 了解詳細資訊。

## 📄 版本歷程

詳見 [CHANGELOG.md](CHANGELOG.md)

## 📜 授權協議

此專案使用 MIT 授權 - 詳見 [LICENSE](LICENSE) 檔案

## 👥 作者

- [DCForce](https://github.com/DCForce)

## 🙏 鳴謝

感謝所有貢獻者和使用者的支持！

