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
        keys: ['pchome', 'ruten', 'shopee', 'yahoo'],
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
        <span>${item.name}</span>
        <a href="${item.url}" target="_blank" class="item-url">${item.url}</a>
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
  const itemText = input.value.trim();
  
  if (itemText) {
    chrome.storage.sync.get('wishlist', (result) => {
      const wishlist = result.wishlist || [];
      // 檢查是否為 URL
      try {
        const url = new URL(itemText);
        wishlist.unshift({
          name: url.hostname,
          url: itemText
        });
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
  document.getElementById('settingsTab').click();
});