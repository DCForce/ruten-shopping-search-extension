import { defaultDisabledSites } from './settings.js';

// 預設的搜尋網站配置
const defaultSites = {
  'momo': {
    name: 'momo購物網',
    url: 'https://www.momoshop.com.tw/search/searchShop.jsp?keyword=',
    enabled: true
  },
  'pchome': {
    name: 'PChome',
    url: 'https://ecshweb.pchome.com.tw/search/v3.3/?q=',
    enabled: true
  },
  'ruten': {
    name: '露天拍賣',
    url: 'https://www.ruten.com.tw/find/?q=',
    enabled: true
  },
  'yahoo': {
    name: 'Yahoo購物',
    url: 'https://tw.bid.yahoo.com/search/auction/product?p=',
    enabled: true
  },
  'shopee': {
    name: '蝦皮購物',
    url: 'https://shopee.tw/search?keyword=',
    enabled: true
  },
  'books': {
    name: '博客來網路書店',
    url: 'https://search.books.com.tw/search/query/key/',
    enabled: true
  },
  'eslite': {
    name: '誠品',
    url: 'https://www.eslite.com/Search?keyword=',
    enabled: true
  },
  'taaze': {
    name: 'Taaze',
    url: 'https://www.taaze.tw/rwd_searchResult.html?keyType%5B%5D=0&keyword%5B%5D=',
    enabled: true
  },
  'gamesquare': {
    name: '遊戲平方',
    url: 'https://gamesquare.tw/shop-list.php?keyword=',
    enabled: true
  },
  'scryfall': {
    name: 'Scryfall',
    url: 'https://scryfall.com/search?q=',
    enabled: true
  }
};

// 初始化設定
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['sites', 'wishlist', 'disabledSites'], (syncResult) => {
    chrome.storage.local.get('searchHistory', (localResult) => {
      if (!syncResult.sites) {
        chrome.storage.sync.set({ sites: defaultSites });
      }
      if (!localResult.searchHistory) {
        chrome.storage.local.set({ searchHistory: [] });
      }
      if (!syncResult.wishlist) {
        chrome.storage.sync.set({ wishlist: [] });
      }
      if (!syncResult.disabledSites) {
        chrome.storage.sync.set({ disabledSites: defaultDisabledSites });
      }

      // 確保在安裝/更新時更新選單
      updateContextMenu();
    });
  });
});

// 在擴充功能啟動或切換分頁時更新選單
chrome.runtime.onStartup.addListener(updateContextMenu);
chrome.tabs.onActivated.addListener(updateContextMenu);
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === 'complete') {
    updateContextMenu();
  }
});

// 更新右鍵選單
function updateContextMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.storage.sync.get(['sites', 'disabledSites'], (result) => {
      const sites = result.sites || defaultSites;
      const disabledSites = result.disabledSites || defaultDisabledSites;

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0]?.url || '';
        if (isSiteDisabled(url, disabledSites)) {
          return;
        }

        // 建立主選單
        chrome.contextMenus.create({
          id: 'searchAll',
          title: '在所有平台搜尋「%s」',
          contexts: ['selection']
        });

        // 建立子選單，按排序順序新增
        Object.entries(sites).forEach(([key, site]) => {
          if (site.enabled) {
            chrome.contextMenus.create({
              id: key,
              title: `在${site.name}上搜尋「%s」`,
              contexts: ['selection']
            });
          }
        });
      });
    });
  });
}

function isSiteDisabled(url, disabledSites) {
  try {
    const hostname = new URL(url).hostname;
    return disabledSites.some(site => hostname === site || hostname.endsWith(`.${site}`));
  } catch {
    return false;
  }
}

// 處理選單點擊事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!info.selectionText || info.selectionText.trim() === '') {
    return;
  }
  const searchTerm = encodeURIComponent(info.selectionText);

  chrome.storage.sync.get(['sites', 'disabledSites'], (siteResult) => {
    const sites = siteResult.sites || defaultSites;
    const disabledSites = siteResult.disabledSites || defaultDisabledSites;

    if (tab?.url && isSiteDisabled(tab.url, disabledSites)) {
      return;
    }

    chrome.storage.local.get('searchHistory', (historyResult) => {
      const history = historyResult.searchHistory || [];

      // 記錄搜尋歷史
      const searchRecord = {
        term: info.selectionText,
        timestamp: new Date().toISOString(),
        platform: info.menuItemId === 'searchAll' ? 'all' : info.menuItemId
      };
      history.unshift(searchRecord);
      if (history.length > 100) history.pop(); // 限制歷史記錄數量
      chrome.storage.local.set({ searchHistory: history });

      if (info.menuItemId === 'searchAll') {
        // 在所有啟用的平台上搜尋
        Object.values(sites).forEach(site => {
          if (site.enabled) {
            chrome.tabs.create({
              url: `${site.url}${searchTerm}`
            });
          }
        });
      } else {
        // 在特定平台上搜尋
        const site = sites[info.menuItemId];
        if (site && site.enabled) {
          chrome.tabs.create({
            url: `${site.url}${searchTerm}`
          });
        }
      }
    });
  });
});

// 監聽來自popup.js的訊息
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'updateContextMenu') {
    updateContextMenu();
  }
});