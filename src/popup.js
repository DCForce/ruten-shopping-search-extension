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

    Object.entries(sites).forEach(([key, site]) => {
      const li = document.createElement('li');
      li.className = 'sortable-item';
      li.dataset.key = key;
      li.innerHTML = `
        <span class="site-name">${site.name}</span>
        <input type="checkbox" ${site.enabled ? 'checked' : ''}>
      `;

      const checkbox = li.querySelector('input');
      checkbox.addEventListener('change', () => {
        sites[key].enabled = checkbox.checked;
        chrome.storage.sync.set({ sites });
        chrome.runtime.sendMessage({ action: 'updateContextMenu' });
      });

      siteList.appendChild(li);
    });

    enableDragAndDrop(siteList, sites);
  });
}

function enableDragAndDrop(list, sites) {
  let draggedItem = null;

  list.addEventListener('dragstart', (e) => {
    draggedItem = e.target;
    e.target.style.opacity = '0.5';
  });

  list.addEventListener('dragend', (e) => {
    e.target.style.opacity = '';
    draggedItem = null;
  });

  list.addEventListener('dragover', (e) => {
    e.preventDefault();
    const target = e.target.closest('.sortable-item');
    if (target && target !== draggedItem) {
      const rect = target.getBoundingClientRect();
      const next = (e.clientY - rect.top) / rect.height > 0.5;
      list.insertBefore(draggedItem, next ? target.nextSibling : target);
    }
  });

  list.addEventListener('drop', () => {
    const sortedKeys = Array.from(list.children).map((item) => item.dataset.key);
    const sortedSites = {};
    sortedKeys.forEach((key) => {
      sortedSites[key] = sites[key];
    });
    chrome.storage.sync.set({ sites: sortedSites }, () => {
      // 顯示排序已存檔提示
      const caption = document.getElementById('sortSavedCaption');
      caption.style.display = 'block';
      setTimeout(() => {
        caption.style.display = 'none';
      }, 2000);

      // 重新載入設定以更新顯示
      loadSettings();
    });
  });

  Array.from(list.children).forEach((item) => {
    item.setAttribute('draggable', true);
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