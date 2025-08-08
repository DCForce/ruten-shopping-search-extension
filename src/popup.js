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

// 載入停用網域
function loadDisabledSites() {
  chrome.storage.sync.get('disabledSites', (result) => {
    const disabledSites = result.disabledSites || [];
    const list = document.getElementById('disabledSiteList');
    list.innerHTML = '';

    disabledSites.forEach((site, index) => {
      const div = document.createElement('div');
      div.className = 'history-item';

      const span = document.createElement('span');
      span.textContent = site;
      div.appendChild(span);

      const deleteSpan = document.createElement('span');
      deleteSpan.className = 'delete-btn';
      deleteSpan.dataset.index = index;
      deleteSpan.textContent = '×';
      deleteSpan.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index);
        disabledSites.splice(idx, 1);
        chrome.storage.sync.set({ disabledSites }, () => {
          loadDisabledSites();
          chrome.runtime.sendMessage({ action: 'updateContextMenu' });
        });
      });
      div.appendChild(deleteSpan);

      list.appendChild(div);
    });
  });
}

// 新增停用網域
document.getElementById('addDisabledSite').addEventListener('click', () => {
  const input = document.getElementById('disabledSiteInput');
  const domain = input.value.trim();

  if (domain) {
    chrome.storage.sync.get('disabledSites', (result) => {
      const disabledSites = result.disabledSites || [];
      if (!disabledSites.includes(domain)) {
        disabledSites.push(domain);
        chrome.storage.sync.set({ disabledSites }, () => {
          input.value = '';
          loadDisabledSites();
          chrome.runtime.sendMessage({ action: 'updateContextMenu' });
        });
      }
    });
  }
});
// 初始化按鈕狀態
const addItemBtn = document.getElementById('addItem');
const newItemInput = document.getElementById('newItem');
addItemBtn.disabled = true;

// 監聽輸入框變化
newItemInput.addEventListener('input', () => {
  addItemBtn.disabled = !newItemInput.value.trim();
});

// 載入設定
function loadSettings() {
  chrome.storage.sync.get('sites', (result) => {
    const sites = result.sites || {};
    const siteList = document.getElementById('sortableSiteList');
    siteList.innerHTML = '';

    // 定義分類
    const categories = {
      'shopping': {
        title: '購物平台',
        keys: ['momo', 'pchome', 'ruten', 'shopee', 'yahoo'],
        color: '#4CAF50'
      },
      'books': {
        title: '書店平台',
        keys: ['eslite', 'books', 'taaze'],
        color: '#2196F3'
      },
      'games': {
        title: '遊戲平台',
        keys: ['scryfall', 'gamesquare'],
        color: '#FF9800'
      }
    };

    // 依分類建立清單
    Object.entries(categories).forEach(([category, data]) => {
      // 建立分類標題
      const categoryTitle = document.createElement('div');
      categoryTitle.className = 'category-title';
      categoryTitle.style.borderLeftColor = data.color;
      categoryTitle.innerHTML = `
        <input type="checkbox" class="category-checkbox">
        <span>${data.title}</span>
      `;
      siteList.appendChild(categoryTitle);

      // 建立該分類的平台清單
      const categoryList = document.createElement('div');
      categoryList.className = 'category-list';
      siteList.appendChild(categoryList);

      data.keys.forEach(key => {
        if (sites[key]) {
          const li = document.createElement('li');
          li.className = 'site-item';
          li.dataset.key = key;
          li.innerHTML = `
            <input type="checkbox" ${sites[key].enabled ? 'checked' : ''}>
            <span class="site-name">${sites[key].name}</span>
          `;

          const checkbox = li.querySelector('input');
          checkbox.addEventListener('change', () => {
            sites[key].enabled = checkbox.checked;
            chrome.storage.sync.set({ sites });
            chrome.runtime.sendMessage({ action: 'updateContextMenu' });
            updateCategoryCheckbox(categoryTitle, categoryList);
          });

          categoryList.appendChild(li);
        }
      });

      // 設定分類標題的 checkbox 事件
      const categoryCheckbox = categoryTitle.querySelector('.category-checkbox');
      categoryCheckbox.checked = data.keys.every(key => sites[key]?.enabled);
      
      categoryCheckbox.addEventListener('change', () => {
        const items = categoryList.querySelectorAll('.site-item input');
        items.forEach(item => {
          item.checked = categoryCheckbox.checked;
          const key = item.closest('.site-item').dataset.key;
          sites[key].enabled = categoryCheckbox.checked;
        });
        chrome.storage.sync.set({ sites });
        chrome.runtime.sendMessage({ action: 'updateContextMenu' });
      });
    });
  });
}

// 更新分類標題的 checkbox 狀態
function updateCategoryCheckbox(categoryTitle, categoryList) {
  const items = categoryList.querySelectorAll('.site-item input');
  const allChecked = Array.from(items).every(item => item.checked);
  const someChecked = Array.from(items).some(item => item.checked);
  const categoryCheckbox = categoryTitle.querySelector('.category-checkbox');
  
  categoryCheckbox.checked = allChecked;
  categoryCheckbox.indeterminate = someChecked && !allChecked;
}

// 載入搜尋歷史
function loadHistory() {
  chrome.storage.local.get('searchHistory', (result) => {
    const history = result.searchHistory || [];
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    
    history.forEach((record, index) => {
      const div = document.createElement('div');
      div.className = 'history-item';
      const termSpan = document.createElement('span');
      termSpan.textContent = record.term;

      const timeSmall = document.createElement('small');
      timeSmall.textContent = new Date(record.timestamp).toLocaleString();

      const deleteSpan = document.createElement('span');
      deleteSpan.className = 'delete-btn';
      deleteSpan.dataset.index = index;
      deleteSpan.textContent = '×';

      div.appendChild(termSpan);
      div.appendChild(timeSmall);
      div.appendChild(deleteSpan);

      deleteSpan.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        history.splice(index, 1);
        chrome.storage.local.set({ searchHistory: history }, loadHistory);
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
      const nameSpan = document.createElement('span');
      nameSpan.textContent = item.name;

      const link = document.createElement('a');
      link.href = item.url;
      link.target = '_blank';
      link.className = 'item-url';
      link.textContent = item.url;

      const deleteSpan = document.createElement('span');
      deleteSpan.className = 'delete-btn';
      deleteSpan.dataset.index = index;
      deleteSpan.textContent = '×';

      div.appendChild(nameSpan);
      div.appendChild(link);
      div.appendChild(deleteSpan);

      deleteSpan.addEventListener('click', (e) => {
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
  const itemText = input.value.trim();
  
  if (itemText) {
    chrome.storage.sync.get('wishlist', (result) => {
      const wishlist = result.wishlist || [];
      // 檢查是否為 URL 且協定為 http 或 https
      try {
        const url = new URL(itemText);
        if (url.protocol === 'http:' || url.protocol === 'https:') {
          wishlist.unshift({
            name: url.hostname,
            url: itemText
          });
        } else {
          // 協定不被支援，僅儲存純文字
          wishlist.unshift({
            name: itemText,
            url: ''
          });
        }
      } catch {
        // 如果不是有效的 URL，則作為純文字項目儲存
        wishlist.unshift({
          name: itemText,
          url: ''
        });
      }
      chrome.storage.sync.set({ wishlist }, () => {
        input.value = '';
        document.getElementById('addItem').disabled = true; // 確保按鈕回到禁用狀態
        loadWishlist();
      });
    });
  }
});

// 新增目前頁面到待購清單
document.getElementById('addCurrentPage').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (currentTab && currentTab.url) {
      const item = {
        name: currentTab.title || '未命名頁面',
        url: currentTab.url
      };
      
      chrome.storage.sync.get('wishlist', (result) => {
        const wishlist = result.wishlist || [];
        // 檢查是否已存在相同的 URL
        const isDuplicate = wishlist.some(existingItem => existingItem.url === item.url);
        if (!isDuplicate) {
          wishlist.unshift(item);
          chrome.storage.sync.set({ wishlist }, loadWishlist);
        } else {
          alert('此頁面已經在待購清單中了！');
        }
      });
    } else {
      alert('無法獲取當前頁面資訊，請重試！');
    }
  });
});

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  loadHistory();
  loadWishlist();
  loadDisabledSites();
  document.getElementById('settingsTab').click();
  // 顯示版本資訊
  fetch(chrome.runtime.getURL('manifest.json'))
    .then(res => res.json())
    .then(manifest => {
      document.getElementById('extVersion').textContent = manifest.version;
    });
});