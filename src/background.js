// 預設的搜尋網站配置
const defaultSites = {
  'ruten': {
    name: '露天拍賣',
    url: 'https://www.ruten.com.tw/find/?q=',
    enabled: true
  },
  'shopee': {
    name: '蝦皮購物',
    url: 'https://shopee.tw/search?keyword=',
    enabled: true
  },
  'yahoo': {
    name: 'Yahoo購物',
    url: 'https://tw.bid.yahoo.com/search/auction/product?p=',
    enabled: true
  },
  'pchome': {
    name: 'PChome',
    url: 'https://ecshweb.pchome.com.tw/search/v3.3/?q=',
    enabled: true
  }
};

// 初始化設定
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['sites', 'searchHistory', 'wishlist'], (result) => {
    if (!result.sites) {
      chrome.storage.sync.set({ sites: defaultSites });
    }
    if (!result.searchHistory) {
      chrome.storage.sync.set({ searchHistory: [] });
    }
    if (!result.wishlist) {
      chrome.storage.sync.set({ wishlist: [] });
    }
  });
  
  updateContextMenu();
});

// 更新右鍵選單
function updateContextMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.storage.sync.get('sites', (result) => {
      const sites = result.sites || defaultSites;
      
      // 建立主選單
      chrome.contextMenus.create({
        id: 'searchAll',
        title: '在所有平台搜尋「%s」',
        contexts: ['selection']
      });
      
      // 建立子選單
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
}

// 處理選單點擊事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const searchTerm = encodeURIComponent(info.selectionText);
  
  chrome.storage.sync.get(['sites', 'searchHistory'], (result) => {
    const sites = result.sites || defaultSites;
    const history = result.searchHistory || [];
    
    // 記錄搜尋歷史
    const searchRecord = {
      term: info.selectionText,
      timestamp: new Date().toISOString(),
      platform: info.menuItemId === 'searchAll' ? 'all' : info.menuItemId
    };
    history.unshift(searchRecord);
    if (history.length > 100) history.pop(); // 限制歷史記錄數量
    chrome.storage.sync.set({ searchHistory: history });
    
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