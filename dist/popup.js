(() => {
  if (!chrome.tabs) {
    return;
  }

  let tabId;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    tabId = tabs[0].id;

    // ページのDOM要素有無によって、popupの表示を変える
    chrome.tabs.sendMessage(tabId, { evName: 'popup.dom' }, null, (response) => {
      response.forEach((v) => {
        document.querySelectorAll(v.selectorStr).forEach((el) => {
          el.classList.toggle('hidden', v.hide);
        });
      });
    });
  });

  const sendProcess = (fnName, arg) => {
    const message = {
      evName: 'popup.process',
      evData: {
        arg,
        fnName,
      },
    };

    // argが数字だったら数値に変換
    if (/^\d+$/.test(arg)) {
      message.evData.arg = Number(arg);
    }

    chrome.tabs.sendMessage(tabId, message);
    window.close();
  };

  document.addEventListener('click', (e) => {
    const { fnName, arg } = e.target.dataset;

    if (!fnName) {
      return;
    }

    sendProcess(fnName, arg);
  }, false);
})();
