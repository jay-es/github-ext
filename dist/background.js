chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // 遷移開始時のみ処理をする
  if (changeInfo.status !== 'loading') {
    return;
  }

  // アイコンを切り替え
  if (tab.url.substr(0, 19) === 'https://github.com/') {
    chrome.pageAction.show(tabId);
  } else {
    chrome.pageAction.hide(tabId);
  }
});
