// 切換分頁
document.querySelectorAll('.tabs button').forEach(button => {
  button.addEventListener('click', () => {
    const tabId = button.id.replace('Tab', '');
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
  });
});

// 載入設定
function loadSettings() {
  chrome.storage.sync.get('sites', (result) => {
    const sites = result.sites;
    const siteList = document.getElementById('siteList');
    siteList.innerHTML = '';
    
    Object.entries(sites).forEach(([key, site]) => {
      const div = document.createElement('div');
      div.className = 'site-item';
      div.innerHTML = `
        <input type="checkbox" id="${key}" ${site.enabled ? 'checked' : ''}>
        <label for="${key}">${site.name}</label>
      `;
      
      const checkbox = div.querySelector('input');
      checkbox.addEventListener('change', () => {
        sites[key].enabled = checkbox.checked;
        chrome.storage.sync.set({ sites }, () => {
          chrome.runtime.sendMessage({ action: 'updateContextMenu' });
        });
      });
      
      siteList.appendChild(div);
    });
  });
}

// 載入搜尋歷史
function loadHistory() {
  chrome.storage.sync.get('searchHistory', (result) => {
    const history = result.searchHistory || [];
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    
    history.forEach((record, index) => {
      const div = document.createElement('div');
      div.className = 'history-item';
      div.innerHTML = `
        <span>${record.term}</span>
        <small>${new Date(record.timestamp).toLocaleString()}</small>
        <span class="delete-btn" data-index="${index}">×</span>
      `;
      
      div.querySelector('.delete-btn').addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        history.splice(index, 1);
        chrome.storage.sync.set({ searchHistory: history }, loadHistory);
      });
      
      historyList.appendChild(div);
    });
  });
}

// 載入待購清單
function loadWishlist() {
  chrome.storage.sync.get('wishlist', (result) => {
    const wishlist = result.wishlist || [];
    const wishlistItems = document.getElementById('wishlistItems');
    wishlistItems.innerHTML = '';
    
    wishlist.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'wishlist-item';
      div.innerHTML = `
        <span>${item}</span>
        <span class="delete-btn" data-index="${index}">×</span>
      `;
      
      div.querySelector('.delete-btn').addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        wishlist.splice(index, 1);
        chrome.storage.sync.set({ wishlist }, loadWishlist);
      });
      
      wishlistItems.appendChild(div);
    });
  });
}

// 新增待購項目
document.getElementById('addItem').addEventListener('click', () => {
  const input = document.getElementById('newItem');
  const item = input.value.trim();
  
  if (item) {
    chrome.storage.sync.get('wishlist', (result) => {
      const wishlist = result.wishlist || [];
      wishlist.unshift(item);
      chrome.storage.sync.set({ wishlist }, () => {
        input.value = '';
        loadWishlist();
      });
    });
  }
});

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  loadHistory();
  loadWishlist();
  document.getElementById('settingsTab').click();
});