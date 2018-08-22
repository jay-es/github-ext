const selectors = {
  codeDetails: '.js-file.js-details-container',
  comments: '.js-toggle-file-notes',
  outdatedComment: '.outdated-comment',
  tabSize: '.tab-size',
};

// ヘルパ関数（NodeList.prototype.forEachがないとエラーになる）
const domEach = (selectorStr, callback) => {
  document.querySelectorAll(selectorStr).forEach(callback);
};

const processList = {
  // コード開く/閉じる
  toggleDetails(sw) {
    domEach(selectors.codeDetails, (el) => {
      el.classList.toggle('Details--on', sw);
    });
  },

  // コメント表示/非表示
  toggleComments(sw) {
    domEach(selectors.comments, (el) => {
      if (sw ? !el.checked : el.checked) {
        el.click();
      }
    });
  },

  // 修正済みコードのコメント表示/非表示
  toggleOutdated(sw) {
    domEach(selectors.outdatedComment, (el) => {
      el.classList.toggle('open', sw);
    });
  },

  // タブサイズ変更
  changeTabSize(tabSize) {
    domEach(selectors.tabSize, (el) => {
      el.setAttribute('data-tab-size', tabSize);
    });
  },

  // 空白無視
  ignoreWhitespace(mode) {
    const { location } = window;
    const { search } = location;
    const regexp = /w=\d/;

    if (!search) {
      location.search = `w=${mode}`;
    } else if (regexp.test(search)) {
      location.search = search.replace(regexp, `w=${mode}`);
    } else {
      location.search = `${search}&w=${mode}`;
    }
  },
};

// 処理を実行
const execProcess = ({ fnName, arg }) => {
  const processFn = processList[fnName];

  if (typeof processFn !== 'function') {
    console.error(`"processList.${fnName}" is not a function`); // eslint-disable-line no-console
    return;
  }

  processFn(arg);
};

// ページのDOM要素の有無をpopup.jsに返す
const sendDom = (sendResponse) => {
  const response = Object.values(selectors).map(selectorStr => ({
    selectorStr,
    hide: !document.querySelectorAll(selectorStr).length,
  }));

  sendResponse(response);
};

chrome.runtime.onMessage.addListener(({ evName, evData }, sender, sendResponse) => {
  if (evName === 'popup.process') {
    execProcess(evData);
  } else if (evName === 'popup.dom') {
    sendDom(sendResponse);
  }
});
