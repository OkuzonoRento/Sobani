document.addEventListener('DOMContentLoaded', () => {
  /* =========================================================
     1. 定数・設定値
  ========================================================= */
  const MESH_ELEVATION_Y = 0.2;

  const ROUTE_CONFIG = {
    Y_OFFSET: 0.3,
    TARGET_Y_OFFSET: -0.1,
    ARCH_HEIGHT: 2.2,
    ARCH_VARIANCE: 0.6
  };

  const GAS_NEWS_URL = 'https://script.google.com/macros/s/AKfycbx_YuKTspfzfxgtTr-qFWQu7OKAPKcckdqO7ohgy_2NrkGZkF-0qK4wYaL3FOyJc1b6Xg/exec';
  const GAS_REPORT_URL = 'https://script.google.com/macros/s/AKfycbxium_dLE0-zIVv9kdXeCzxjIJAjQHnIuz60LGaf31XG898K_HIA4LmWC70hcUj8QkO/exec';

  // Stripe Checkout のリンクURL
  const STRIPE_CHECKOUT_URL = 'https://donate.stripe.com/test_28E8wP9mugHx5kX0qkf3a00';

  // Supabase 設定
  const SUPABASE_URL = 'https://pcfspldxfzosoirzxgfg.supabase.co/';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjZnNwbGR4Znpvc29pcnp4Z2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1MzAxNDksImV4cCI6MjEwMzEwNjE0OX0.EWKHnjxyCH1GR97bMFe-dB1tLUB7c_fDzPykxA82wvQ';
  
  const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storage: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {}
      }
    }
  }) : null;

  let currentNewsData = [];
  const readNewsIds = new Set();

  const REGION_DEFINITIONS = [
    { id: 'kyushu',   name: '九州・沖縄',   color: 0xff6b6b, keys: ['fukuoka', 'saga', 'nagasaki', 'kumamoto', 'oita', 'miyazaki', 'kagoshima', 'okinawa'] },
    { id: 'shikoku',  name: '四国',         color: 0xff922b, keys: ['tokushima', 'kagawa', 'ehime', 'kochi'] },
    { id: 'chugoku',  name: '中国',         color: 0xfcc419, keys: ['tottori', 'shimane', 'okayama', 'hiroshima', 'yamaguchi'] },
    { id: 'kansai',   name: '関西',         color: 0x51cf66, keys: ['mie', 'shiga', 'kyoto', 'osaka', 'hyogo', 'nara', 'wakayama'] },
    { id: 'chubu',    name: '中部',         color: 0x339af0, keys: ['niigata', 'toyama', 'ishikawa', 'fukui', 'yamanashi', 'nagano', 'gifu', 'shizuoka', 'aichi'] },
    { id: 'kanto',    name: '関東',         color: 0x845ef7, keys: ['ibaraki', 'tochigi', 'gunma', 'saitama', 'chiba', 'kanagawa'] },
    { id: 'tokyo',    name: '東京',         color: 0x845ef7, keys: ['tokyo'] },
    { id: 'tohoku',   name: '東北・北海道', color: 0x20c997, keys: ['hokkaido', 'aomori', 'iwate', 'miyagi', 'akita', 'yamagata', 'fukushima'] },
    { id: 'unknown',  name: '未定・海外',   color: 0xfcc2d7, keys: ['unknown', 'other'] }
  ];

  /* =========================================================
     2. UI DOM要素の参照取得
  ========================================================= */
  const regionSelect = document.getElementById('region-select');
  const menuBtn = document.getElementById('menu-btn');
  const dropdownMenu = document.getElementById('dropdown-menu');
  const donateModal = document.getElementById('donate-modal');
  const modalClose = document.getElementById('modal-close');
  const openDonateBtns = document.querySelectorAll('.open-donate-modal');
  const modalStep1 = document.getElementById('modal-step-1');
  const modalStep2 = document.getElementById('modal-step-2');
  const optionAdDonate = document.getElementById('option-ad-donate');
  const optionExternalDonate = document.getElementById('option-external-donate');
  const modalBackBtn = document.getElementById('modal-back-btn');

  const resultModal = document.getElementById('result-modal');
  const resultModalMessage = document.getElementById('result-modal-message');
  const resultModalCloseBtn = document.getElementById('result-modal-close-btn');

  const sendMsgLink = document.getElementById('send-message-link');
  const stripeSupportLink = document.getElementById('stripe-support-link');
  const optionLocalGov = document.getElementById('option-local-gov');
  const govTitleText = document.getElementById('gov-title-text');
  const govDescText = document.getElementById('gov-desc-text');

  // このサイトについて モーダル関連
  const aboutModal = document.getElementById('about-modal');
  const openAboutModalBtn = document.getElementById('open-about-modal');
  const aboutModalClose = document.getElementById('about-modal-close');
  const aboutTabBtns = document.querySelectorAll('.about-tab-btn');
  const aboutTabContents = document.querySelectorAll('.about-tab-content');

  // SNS共有モーダル関連
  const shareModal = document.getElementById('share-modal');
  const openShareModalBtn = document.getElementById('open-share-modal');
  const shareModalClose = document.getElementById('share-modal-close');
  const shareTwitterBtn = document.getElementById('share-twitter-btn');
  const shareCopyBtn = document.getElementById('share-copy-btn');

  const bugModal = document.getElementById('bug-report-modal');
  const openBugBtn = document.getElementById('open-bug-modal');
  const bugModalClose = document.getElementById('bug-modal-close');
  const bugForm = document.getElementById('bug-report-form');
  const bugSubmitBtn = document.getElementById('bug-submit-btn');

  const newsModal = document.getElementById('news-modal');
  const newsModalClose = document.getElementById('news-modal-close');
  const openNewsModalBtn = document.getElementById('open-news-modal');
  const openNewsListBtn = document.getElementById('open-news-list-btn');
  const newsPreviewContainer = document.getElementById('news-preview-container');
  const newsFullList = document.getElementById('news-full-list');
  const newsViewList = document.getElementById('news-view-list');
  const newsViewDetail = document.getElementById('news-view-detail');
  const newsBackBtn = document.getElementById('news-back-btn');
  const dropdownNewsUnread = document.getElementById('dropdown-news-unread');
  const menuBtnUnread = document.getElementById('menu-btn-unread');

  const newsDetailCategory = document.getElementById('news-detail-category');
  const newsDetailDate = document.getElementById('news-detail-date');
  const newsDetailTitle = document.getElementById('news-detail-title');
  const newsDetailBody = document.getElementById('news-detail-body');

  const cardEl = document.getElementById('message-card');
  const locEl = document.getElementById('msg-location');
  const userIdEl = document.getElementById('msg-user-id');
  const textEl = document.getElementById('msg-text');
  const container = document.getElementById('map-canvas-container');

  let newsOpenedFrom = 'home';

  /* =========================================================
     モーダル開閉時の背景スクロール制御関数
  ========================================================= */
  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('is-open', 'active');
    modalEl.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('is-open', 'active');
    modalEl.style.display = 'none';
    
    const openModals = document.querySelectorAll('.modal-backdrop.is-open, .modal-backdrop.active');
    if (openModals.length === 0) {
      document.body.style.overflow = '';
    }
  }

  /* =========================================================
     3. 都道府県選択ドロップダウンの動的生成および初期化
  ========================================================= */
  if (typeof DISPLAY_PREFECTURES !== 'undefined' && Array.isArray(DISPLAY_PREFECTURES)) {
    const fragment = document.createDocumentFragment();
    DISPLAY_PREFECTURES.forEach(key => {
      if (PREFECTURES_DATA[key]) {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = PREFECTURES_DATA[key].name;
        fragment.appendChild(opt);
      }
    });
    regionSelect.appendChild(fragment);
  }

  let currentTargetKey = (typeof DISPLAY_PREFECTURES !== 'undefined' && DISPLAY_PREFECTURES.length > 0)
    ? DISPLAY_PREFECTURES[0] 
    : 'ishikawa';
  regionSelect.value = currentTargetKey;

  /* =========================================================
     4. 各種モーダルおよびUIイベント制御
  ========================================================= */
  const showResultModal = (msg) => {
    resultModalMessage.textContent = msg;
    openModal(resultModal);
  };

  const hideResultModal = () => closeModal(resultModal);

  if (resultModalCloseBtn) resultModalCloseBtn.addEventListener('click', hideResultModal);
  if (resultModal) {
    resultModal.addEventListener('click', (e) => {
      if (e.target === resultModal) hideResultModal();
    });
  }

  const resetModalSteps = () => {
    modalStep1.style.display = 'block';
    modalStep2.style.display = 'none';
  };

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('is-active');
  });

  document.addEventListener('click', (e) => {
    if (!dropdownMenu.contains(e.target) && e.target !== menuBtn) {
      dropdownMenu.classList.remove('is-active');
    }
  });

  openDonateBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.tagName === 'A') e.preventDefault();
      resetModalSteps();
      openModal(donateModal);
      dropdownMenu.classList.remove('is-active');
    });
  });

  modalClose.addEventListener('click', () => closeModal(donateModal));
  donateModal.addEventListener('click', (e) => {
    if (e.target === donateModal) closeModal(donateModal);
  });

  optionExternalDonate.addEventListener('click', () => {
    modalStep1.style.display = 'none';
    modalStep2.style.display = 'block';
  });

  modalBackBtn.addEventListener('click', resetModalSteps);

  /**
   * 4-A. 動画広告を見て寄付する処理の実装
   */
  const SUCCESS_MESSAGE = "動画広告の視聴が完了しました！\nご協力ありがとうございます。\n収益は寄付金として支援されました。";

  function handleAdRewardDonate() {
    if (typeof window.RewardAdSDK === 'undefined') {
      console.warn('RewardAdSDK が読み込まれていません。デモ完了表示に移行します。');
      closeModal(donateModal);
      showResultModal(SUCCESS_MESSAGE);
      return;
    }

    window.RewardAdSDK.show({
      adUnitId: 'YOUR_AD_UNIT_ID',
      onReward: () => {
        closeModal(donateModal);
        showResultModal(SUCCESS_MESSAGE);
      },
      onClose: (completed) => {
        if (!completed) {
          showResultModal('動画の再生が中断されたため、寄付は完了しませんでした。');
        }
      },
      onError: (err) => {
        console.error('広告再生エラー:', err);
        showResultModal('広告の配信エラーが発生しました。時間を置いてお試しください。');
      }
    });
  }

  if (optionAdDonate) {
    optionAdDonate.addEventListener('click', handleAdRewardDonate);
  }

  /**
   * 都道府県選択に応じた各種動的リンクの更新処理
   */
  function updateTargetLinks(targetKey) {
    const data = PREFECTURES_DATA[targetKey] || PREFECTURES_DATA.ishikawa;
    govTitleText.textContent = `${data.name}公式義援金`;
    govDescText.textContent = data.desc;
    optionLocalGov.href = data.url;

    const shareUrl = encodeURIComponent(window.location.href);

    const prefNameCleaned = data.name.replace(/県$/, '');
    const msgHashtag = encodeURIComponent(`そばに${prefNameCleaned}`);
    const msgPromptText = encodeURIComponent(`${data.name}へ応援メッセージを送ろう！\n`);
    sendMsgLink.href = `https://x.com/intent/tweet?hashtags=${msgHashtag}&text=${msgPromptText}`;

    const shareHashtag = encodeURIComponent('そばに');
    const shareText = encodeURIComponent(`被災地を応援するプラットフォーム「そばに」で${data.name}を応援しています！\n`);
    if (shareTwitterBtn) {
      shareTwitterBtn.href = `https://x.com/intent/tweet?hashtags=${shareHashtag}&url=${shareUrl}&text=${shareText}`;
    }
  }

  if (sendMsgLink) {
    sendMsgLink.addEventListener('click', (e) => {
      e.preventDefault();
      const url = sendMsgLink.href;
      if (url && url !== '#') {
        dropdownMenu.classList.remove('is-active');
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
  }

  if (stripeSupportLink) {
    stripeSupportLink.href = STRIPE_CHECKOUT_URL;
    stripeSupportLink.addEventListener('click', (e) => {
      e.preventDefault();
      dropdownMenu.classList.remove('is-active');
      if (STRIPE_CHECKOUT_URL && STRIPE_CHECKOUT_URL !== 'https://buy.stripe.com/YOUR_PAYMENT_LINK' && STRIPE_CHECKOUT_URL !== '#') {
        window.open(STRIPE_CHECKOUT_URL, '_blank', 'noopener,noreferrer');
      } else {
        showResultModal('現在Stripe決済の準備中です。');
      }
    });
  }

  /* =========================================================
     4-B. 「このサイトについて」モーダル制御・タブ切り替え
  ========================================================= */
  if (openAboutModalBtn) {
    openAboutModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dropdownMenu.classList.remove('is-active');
      openModal(aboutModal);
    });
  }

  if (aboutModalClose) {
    aboutModalClose.addEventListener('click', () => {
      closeModal(aboutModal);
    });
  }

  if (aboutModal) {
    aboutModal.addEventListener('click', (e) => {
      if (e.target === aboutModal) {
        closeModal(aboutModal);
      }
    });
  }

  // タブ切り替えロジック
  aboutTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      aboutTabBtns.forEach(b => {
        b.classList.remove('active');
        b.style.fontWeight = 'normal';
        b.style.borderBottom = 'none';
        b.style.color = '#666';
      });
      btn.classList.add('active');
      btn.style.fontWeight = 'bold';
      btn.style.borderBottom = '2px solid #e11d48';
      btn.style.color = '#e11d48';

      aboutTabContents.forEach(content => {
        if (content.id === `tab-content-${targetTab}`) {
          content.style.display = 'block';
        } else {
          content.style.display = 'none';
        }
      });
    });
  });

  /* =========================================================
     4-C. SNS共有モーダル制御
  ========================================================= */
  if (openShareModalBtn) {
    openShareModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dropdownMenu.classList.remove('is-active');
      openModal(shareModal);
    });
  }

  if (shareModalClose) {
    shareModalClose.addEventListener('click', () => {
      closeModal(shareModal);
    });
  }

  if (shareModal) {
    shareModal.addEventListener('click', (e) => {
      if (e.target === shareModal) {
        closeModal(shareModal);
      }
    });
  }

  if (shareTwitterBtn) {
    shareTwitterBtn.addEventListener('click', () => {
      closeModal(shareModal);
    });
  }

  if (shareCopyBtn) {
    shareCopyBtn.addEventListener('click', async () => {
      const url = window.location.href;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(url);
        } else {
          const textArea = document.createElement("textarea");
          textArea.value = url;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }
        closeModal(shareModal);
        showResultModal('URLをクリップボードにコピーしました！');
      } catch (err) {
        console.error('URLコピー失敗:', err);
        showResultModal('URLのコピーに失敗しました。');
      }
    });
  }

  /* =========================================================
     5. ニュース機能
  ========================================================= */
  if (typeof readNewsIds !== 'undefined' && readNewsIds instanceof Set) {
    const savedReadIds = JSON.parse(localStorage.getItem('readNewsIds') || '[]');
    savedReadIds.forEach(id => readNewsIds.add(String(id)));
  }

  function markAsRead(newsId) {
    if (typeof readNewsIds !== 'undefined') {
      readNewsIds.add(String(newsId));
      try {
        localStorage.setItem('readNewsIds', JSON.stringify(Array.from(readNewsIds)));
      } catch (e) {
        console.warn('ローカルストレージへの保存に失敗しました:', e);
      }
    }
  }

  async function fetchNewsData() {
    try {
      const response = await fetch(`${GAS_NEWS_URL}?action=getNews`, {
        method: 'GET',
        mode: 'cors'
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const resData = await response.json();
      if (resData.status === 'success' && Array.isArray(resData.data)) {
        currentNewsData = resData.data.map((item, index) => ({
          id: String(item.id || `news-${index}`),
          date: item.date || '----.--.--',
          category: item.category || 'お知らせ',
          categoryClass: item.categoryClass || getCategoryClass(item.category),
          title: item.title || 'タイトルなし',
          content: item.content || item.body || ''
        }));
        initNewsDisplay();
      }
    } catch (error) {
      console.warn('ニュースデータの取得に失敗しました:', error);
      currentNewsData = [];
      initNewsDisplay();
    }
  }

  function getCategoryClass(category) {
    if (!category) return 'tag-info';
    if (category.includes('アップデート')) return 'tag-update';
    if (category.includes('実績') || category.includes('報告')) return 'tag-report';
    return 'tag-info';
  }

  function createNewsCardElement(item, fromSource) {
    const card = document.createElement('div');
    card.className = 'news-card';
    
    const isUnread = typeof readNewsIds !== 'undefined' ? !readNewsIds.has(String(item.id)) : true;
    const unreadDot = isUnread ? `<span class="unread-badge"></span>` : '';

    card.innerHTML = `
      <div class="news-meta">
        ${unreadDot}
        <span class="news-tag ${item.categoryClass || ''}">${item.category}</span>
        <span class="news-date">${item.date}</span>
      </div>
      <h4 class="news-title">${item.title}</h4>
      <p class="news-summary">${item.content}</p>
    `;

    card.addEventListener('click', () => {
      markAsRead(item.id);
      initNewsDisplay();
      showNewsDetail(item, fromSource);
    });
    
    return card;
  }

  function initNewsDisplay() {
    if (newsPreviewContainer) {
      newsPreviewContainer.innerHTML = '';
      if (currentNewsData.length === 0) {
        newsPreviewContainer.innerHTML = '<p style="color:#888; font-size:13px; padding:8px 0;">現在お知らせはありません。</p>';
      } else {
        currentNewsData.slice(0, 2).forEach(item => {
          newsPreviewContainer.appendChild(createNewsCardElement(item, 'home'));
        });
      }
    }

    if (newsFullList) {
      newsFullList.innerHTML = '';
      if (currentNewsData.length === 0) {
        newsFullList.innerHTML = '<p style="color:#888; font-size:13px; padding:12px; text-align:center;">現在お知らせはありません。</p>';
      } else {
        currentNewsData.forEach(item => {
          newsFullList.appendChild(createNewsCardElement(item, 'dropdown'));
        });
      }
    }

    const hasUnread = typeof readNewsIds !== 'undefined' 
      ? currentNewsData.some(item => !readNewsIds.has(String(item.id)))
      : false;

    if (dropdownNewsUnread) dropdownNewsUnread.style.display = hasUnread ? 'inline-block' : 'none';
    if (menuBtnUnread) menuBtnUnread.style.display = hasUnread ? 'inline-block' : 'none';
  }

  function showNewsListModal() {
    newsOpenedFrom = 'dropdown';
    if (newsViewList) newsViewList.style.display = 'block';
    if (newsViewDetail) newsViewDetail.style.display = 'none';
    if (newsModalClose) newsModalClose.style.display = 'block';
    openModal(newsModal);
    if (dropdownMenu) dropdownMenu.classList.remove('is-active', 'active');
  }

  function showNewsDetail(item, fromSource) {
    newsOpenedFrom = fromSource;
    if (newsDetailCategory) {
      newsDetailCategory.textContent = item.category;
      newsDetailCategory.className = `news-tag ${item.categoryClass || ''}`;
    }
    if (newsDetailDate) newsDetailDate.textContent = item.date;
    if (newsDetailTitle) newsDetailTitle.textContent = item.title;
    if (newsDetailBody) newsDetailBody.textContent = item.content;

    if (newsViewList) newsViewList.style.display = 'none';
    if (newsViewDetail) newsViewDetail.style.display = 'block';
    if (newsModalClose) newsModalClose.style.display = 'none';

    openModal(newsModal);
  }

  function closeNewsModal() {
    closeModal(newsModal);
  }

  if (openNewsModalBtn) openNewsModalBtn.addEventListener('click', (e) => { e.preventDefault(); showNewsListModal(); });
  if (openNewsListBtn) openNewsListBtn.addEventListener('click', showNewsListModal);

  if (newsBackBtn) {
    newsBackBtn.addEventListener('click', () => {
      if (newsOpenedFrom === 'dropdown') {
        if (newsViewList) newsViewList.style.display = 'block';
        if (newsViewDetail) newsViewDetail.style.display = 'none';
        if (newsModalClose) newsModalClose.style.display = 'block';
      } else {
        closeNewsModal();
      }
    });
  }

  if (newsModalClose) newsModalClose.addEventListener('click', closeNewsModal);
  if (newsModal) {
    newsModal.addEventListener('click', (e) => {
      if (e.target === newsModal) closeNewsModal();
    });
  }

  /* =========================================================
     6. 不具合報告モーダル
  ========================================================= */
  let isSubmitting = false;

  if (openBugBtn) {
    openBugBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dropdownMenu.classList.remove('is-active');
      openModal(bugModal);
    });
  }

  if (bugModalClose) {
    bugModalClose.addEventListener('click', () => {
      if (!isSubmitting) closeModal(bugModal);
    });
  }

  bugModal.addEventListener('click', (e) => {
    if (!isSubmitting && e.target === bugModal) {
      closeModal(bugModal);
    }
  });

  bugForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const description = document.getElementById('bug-description').value.trim();
    const includeEnv = document.getElementById('send-env-check').checked;

    if (!description || description.length < 5) {
      showResultModal('不具合の詳細を5文字以上で入力してください。');
      return;
    }

    const payload = {
      description,
      createdAt: new Date().toISOString()
    };

    if (includeEnv) {
      const activePrefName = PREFECTURES_DATA[currentTargetKey] ? PREFECTURES_DATA[currentTargetKey].name : currentTargetKey;
      payload.env = {
        pref: activePrefName || "未選択",
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`
      };
    }

    isSubmitting = true;
    bugSubmitBtn.disabled = true;
    bugSubmitBtn.classList.add('is-disabled');
    bugSubmitBtn.textContent = '送信中...';
    if (bugModalClose) bugModalClose.style.display = 'none';

    try {
      const response = await fetch(GAS_REPORT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      const resData = await response.json();

      if (resData.status === 'success') {
        bugForm.reset();
        closeModal(bugModal);
        showResultModal(`不具合報告を送信しました。\nご協力ありがとうございます！`);
      } else {
        showResultModal(resData.message || '送信に失敗しました。時間をおいて再度お試しください。');
      }
    } catch (error) {
      console.error('送信エラー:', error);
      showResultModal('通信エラーが発生しました。\nインターネット接続をご確認ください。');
    } finally {
      isSubmitting = false;
      bugSubmitBtn.disabled = false;
      bugSubmitBtn.classList.remove('is-disabled');
      bugSubmitBtn.innerHTML = '<span>送信する</span>';
      if (bugModalClose) bugModalClose.style.display = 'block';
    }
  });

  /* =========================================================
     7. メッセージデータ管理
  ========================================================= */
  let allMessages = []; 
  let currentFilteredMessages = []; 
  let currentMsgIndex = -1;
  let autoSwitchTimer = null;
  let routeIntervalTimer = null;

  function getPrefecturalInfo(identifier) {
    const defaultUnknown = (typeof UNKNOWN_POINT !== 'undefined') 
      ? UNKNOWN_POINT 
      : { name: "どこか", pos: { x: -1.8, y: 0.1, z: -0.8 } };

    if (!identifier || identifier === 'unknown' || identifier === 'other') {
      return { 
        name: defaultUnknown.name, 
        pos: new THREE.Vector3(defaultUnknown.pos.x, defaultUnknown.pos.y, defaultUnknown.pos.z) 
      };
    }

    const searchKey = normalizeToPrefectureId(identifier);
    let matchedKey = PREFECTURES_DATA[searchKey] ? searchKey : null;
    let matchedData = matchedKey ? PREFECTURES_DATA[searchKey] : null;

    if (!matchedData) {
      for (const key in PREFECTURES_DATA) {
        if (PREFECTURES_DATA[key].name === identifier || key === searchKey) {
          matchedKey = key;
          matchedData = PREFECTURES_DATA[key];
          break;
        }
      }
    }

    if (matchedKey) {
      const englishMeshName = matchedData.en || (matchedKey.charAt(0).toUpperCase() + matchedKey.slice(1));
      if (prefectureMeshes[englishMeshName]) {
        const worldPos = new THREE.Vector3();
        prefectureMeshes[englishMeshName].getWorldPosition(worldPos);
        return { name: matchedData.name, pos: worldPos };
      }
    }

    if (matchedData && matchedData.pos) {
      return { name: matchedData.name, pos: new THREE.Vector3(matchedData.pos.x, matchedData.pos.y, matchedData.pos.z) };
    }

    return { 
      name: defaultUnknown.name, 
      pos: new THREE.Vector3(defaultUnknown.pos.x, defaultUnknown.pos.y, defaultUnknown.pos.z) 
    };
  }

  function getRegionIdBySourceId(sourceId) {
    if (!sourceId) return 'unknown';
    const key = String(sourceId).toLowerCase();
    for (const reg of REGION_DEFINITIONS) {
      if (reg.keys.includes(key)) return reg.id;
    }
    return 'unknown';
  }

  function getRegionColor(regionId) {
    const reg = REGION_DEFINITIONS.find(r => r.id === regionId);
    return reg ? reg.color : 0xffffff;
  }

  async function fetchMessages() {
    let rawMessages = [];

    if (!supabaseClient) {
      console.warn('Supabase SDK が初期化されていません。');
    } else {
      try {
        const { data, error } = await supabaseClient
          .from('Retrieved_posts')
          .select('*');

        if (error) throw error;

        if (data && Array.isArray(data) && data.length > 0) {
          rawMessages = data;
        }
      } catch (error) {
        console.warn('Supabase (Retrieved_posts) 取得エラー:', error.message || error);
        rawMessages = [];
      }
    }

    allMessages = [];

    rawMessages.forEach(item => {
      let rawFromList = [item.FromLocation || item.sourceId];
      if (typeof rawFromList[0] === 'string' && rawFromList[0].startsWith('[')) {
        try {
          const parsed = JSON.parse(rawFromList[0]);
          if (Array.isArray(parsed) && parsed.length > 0) rawFromList = parsed;
        } catch (e) { }
      }

      let rawToList = [item.ToLocation || item.to];
      if (typeof rawToList[0] === 'string' && rawToList[0].startsWith('[')) {
        try {
          const parsed = JSON.parse(rawToList[0]);
          if (Array.isArray(parsed) && parsed.length > 0) rawToList = parsed;
        } catch (e) { }
      }

      rawToList.forEach(rawTo => {
        rawFromList.forEach(rawFrom => {
          const normalizedSourceId = normalizeToPrefectureId(rawFrom);
          const normalizedTargetId = normalizeToPrefectureId(rawTo);

          allMessages.push({
            id: item.tweet_id || item.id,
            to: normalizedTargetId,
            userId: item.author || item.user_id || item.username || '',
            message: item.text || item.message || '被災地を応援しています！',
            sourceId: normalizedSourceId,
            regionId: getRegionIdBySourceId(normalizedSourceId),
            from: getPrefecturalInfo(normalizedSourceId).name
          });
        });
      });
    });

    filterMessagesByTarget(currentTargetKey);
  }

  function filterMessagesByTarget(targetKey) {
    currentFilteredMessages = allMessages.filter(item => item.to === targetKey || !item.to);
    currentMsgIndex = -1;

    if (currentFilteredMessages.length > 0) {
      displayRandomMessage();
      startAutoSwitchTimer();
    } else {
      stopAutoSwitchTimer();
      updateMessageDisplay({
        from: "全国",
        userId: "",
        message: "皆様からの温かい応援メッセージをお待ちしております"
      });
      clearArcRoutes();
    }
  }

  function displayRandomMessage() {
    if (currentFilteredMessages.length === 0) return;
    let randomIndex;
    if (currentFilteredMessages.length === 1) {
      randomIndex = 0;
    } else {
      do {
        randomIndex = Math.floor(Math.random() * currentFilteredMessages.length);
      } while (randomIndex === currentMsgIndex);
    }
    currentMsgIndex = randomIndex;
    updateMessageDisplay(currentFilteredMessages[currentMsgIndex]);
  }

  function updateMessageDisplay(data) {
    cardEl.classList.add('is-fading');
    setTimeout(() => {
      locEl.textContent = data.from || "全国";
      userIdEl.textContent = data.userId || '';

      const rawText = data.message || '';
      const cleanText = rawText
        .replace(/[「」『』()（）\[\]]/g, '')
        .replace(/[#＃][^\s#＃]+/g, '')
        .trim();

      textEl.textContent = cleanText;
      cardEl.classList.remove('is-fading');
    }, 300);
  }

  function startAutoSwitchTimer() {
    stopAutoSwitchTimer();
    autoSwitchTimer = setInterval(displayRandomMessage, 10000);
  }

  function stopAutoSwitchTimer() {
    if (autoSwitchTimer) {
      clearInterval(autoSwitchTimer);
      autoSwitchTimer = null;
    }
  }

  /* =========================================================
     8. Three.js 3Dマップ設定
  ========================================================= */
  const scene = new THREE.Scene();
  const BASE_FOV = 32; 
  const camera = new THREE.PerspectiveCamera(BASE_FOV, container.clientWidth / container.clientHeight, 0.1, 1000);

  camera.position.set(1.0, 10.0, 10.0);
  camera.lookAt(0, 0, 0);

  function fitCameraToMap() {
    const aspect = container.clientWidth / container.clientHeight;
    camera.aspect = aspect;
    camera.fov = aspect < 1.3 ? BASE_FOV * (1.3 / aspect) : BASE_FOV;
    camera.updateProjectionMatrix();
  }
  fitCameraToMap();

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const clock = new THREE.Clock();

  scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(5, 12, 8);
  scene.add(dirLight);

  const prefectureMeshes = {};
  const prefPositions = {};
  const defaultMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.5, metalness: 0.1 });
  const highlightMaterial = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.3, metalness: 0.1 });
  const sharedParticleGeo = new THREE.SphereGeometry(0.12, 16, 16);

  function loadJapanModelAsync(retries = 3) {
    return new Promise((resolve, reject) => {
      const loader = new THREE.GLTFLoader();
      const attempt = (remaining) => {
        loader.load(
          'models/japan.glb',
          (gltf) => {
            scene.add(gltf.scene);
            gltf.scene.traverse((child) => {
              if (child.isMesh) {
                child.material = defaultMaterial.clone();
                prefectureMeshes[child.name] = child;
                const worldPos = new THREE.Vector3();
                child.getWorldPosition(worldPos);
                prefPositions[child.name] = worldPos;
              }
            });
            updateHighlightedPrefecture(currentTargetKey);
            resolve();
          },
          undefined,
          (error) => {
            if (remaining > 0) {
              setTimeout(() => attempt(remaining - 1), 500);
            } else {
              reject(error);
            }
          }
        );
      };
      attempt(retries);
    });
  }

  function updateHighlightedPrefecture(key) {
    const prefData = PREFECTURES_DATA[key];
    if (!prefData) return;
    const englishName = prefData.en || (key.charAt(0).toUpperCase() + key.slice(1));

    Object.keys(prefectureMeshes).forEach(name => {
      const mesh = prefectureMeshes[name];
      mesh.material = defaultMaterial;
      if (mesh.userData.basePosition) {
        mesh.userData.targetY = mesh.userData.basePosition.y;
      }
    });

    const targetMesh = prefectureMeshes[englishName];
    if (targetMesh) {
      targetMesh.material = highlightMaterial;
      if (!targetMesh.userData.basePosition) {
        targetMesh.userData.basePosition = targetMesh.position.clone();
      }
      targetMesh.userData.targetY = targetMesh.userData.basePosition.y + MESH_ELEVATION_Y;
    }
  }

  /* =========================================================
     9. 3Dアーカールート・光の粒子アニメーション
  ========================================================= */
  let particles = [];
  const lineGroup = new THREE.Group();
  scene.add(lineGroup);
  let interactiveObjects = [];

  function clearArcRoutes() {
    if (routeIntervalTimer) {
      clearInterval(routeIntervalTimer);
      routeIntervalTimer = null;
    }

    while (lineGroup.children.length > 0) {
      const child = lineGroup.children[0];
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
      lineGroup.remove(child);
    }

    particles.forEach(p => {
      if (p.mesh.material) p.mesh.material.dispose();
      scene.remove(p.mesh);
    });
    particles = [];
    interactiveObjects = [];
  }

  function getMessageForRegion(regionId) {
    const matched = currentFilteredMessages.filter(msg => 
      msg.regionId === regionId && msg.sourceId !== currentTargetKey
    );
    if (matched.length === 0) return null;
    return matched[Math.floor(Math.random() * matched.length)];
  }

  function createSingleRouteForRegion(regionId) {
    const msg = getMessageForRegion(regionId);
    if (!msg) return;

    const regionColor = getRegionColor(regionId);

    const currentTarget = getPrefecturalInfo(currentTargetKey).pos;
    currentTarget.y += ROUTE_CONFIG.Y_OFFSET + ROUTE_CONFIG.TARGET_Y_OFFSET;

    const startPos = getPrefecturalInfo(msg.sourceId).pos;
    startPos.y += ROUTE_CONFIG.Y_OFFSET;

    const controlPos = new THREE.Vector3(
      (startPos.x + currentTarget.x) / 2,
      Math.max(startPos.y, currentTarget.y) + ROUTE_CONFIG.ARCH_HEIGHT + Math.random() * ROUTE_CONFIG.ARCH_VARIANCE,
      (startPos.z + currentTarget.z) / 2
    );

    const curve = new THREE.QuadraticBezierCurve3(startPos, controlPos, currentTarget);
    const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
    lineGeo.setDrawRange(0, 0);

    const lineMat = new THREE.LineBasicMaterial({ color: regionColor, transparent: true, opacity: 0.8 });
    const line = new THREE.Line(lineGeo, lineMat);
    line.userData = { messageData: msg, regionId: regionId };
    lineGroup.add(line);
    interactiveObjects.push(line);

    const particleMat = new THREE.MeshBasicMaterial({ color: regionColor, transparent: true, opacity: 0 });
    const particle = new THREE.Mesh(sharedParticleGeo, particleMat);
    particle.visible = false;

    const hitMesh = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), new THREE.MeshBasicMaterial({ visible: false }));
    hitMesh.userData = { messageData: msg, regionId: regionId };
    particle.add(hitMesh);
    interactiveObjects.push(hitMesh);
    scene.add(particle);

    particles.push({
      mesh: particle,
      hitMesh,
      line,
      curve,
      regionId: regionId,
      progress: 0.0,
      startProgress: 0.0,
      endProgress: 0.0,
      drawSpeed: 1.8,
      startDelay: 0,
      pendingReset: false,
      state: 'WAITING'
    });
  }

  function startRouteIntervalTimer() {
    if (routeIntervalTimer) clearInterval(routeIntervalTimer);
    routeIntervalTimer = setInterval(() => {
      if (particles.length === 0) return;
      const availableRoutes = particles.filter(p => !p.pendingReset);
      if (availableRoutes.length > 0) {
        availableRoutes[Math.floor(Math.random() * availableRoutes.length)].pendingReset = true;
      }
    }, 8000);
  }

  function initArcRoutes() {
    clearArcRoutes();
    const activeRegionIds = [...new Set(currentFilteredMessages.map(msg => msg.regionId))];

    activeRegionIds.forEach(regionId => {
      createSingleRouteForRegion(regionId);
    });

    if (particles.length > 0) {
      startRouteIntervalTimer();
    }
  }

  function resetSingleRoute(p) {
    const msg = getMessageForRegion(p.regionId);
    if (!msg) return;

    const currentTarget = getPrefecturalInfo(currentTargetKey).pos;
    currentTarget.y += ROUTE_CONFIG.Y_OFFSET + ROUTE_CONFIG.TARGET_Y_OFFSET;

    const startPos = getPrefecturalInfo(msg.sourceId).pos;
    startPos.y += ROUTE_CONFIG.Y_OFFSET;

    const controlPos = new THREE.Vector3(
      (startPos.x + currentTarget.x) / 2,
      Math.max(startPos.y, currentTarget.y) + ROUTE_CONFIG.ARCH_HEIGHT + Math.random() * ROUTE_CONFIG.ARCH_VARIANCE,
      (startPos.z + currentTarget.z) / 2
    );

    p.curve = new THREE.QuadraticBezierCurve3(startPos, controlPos, currentTarget);
    p.line.geometry.setFromPoints(p.curve.getPoints(50));
    p.line.geometry.setDrawRange(0, 0);

    p.line.userData = { messageData: msg, regionId: p.regionId };
    p.hitMesh.userData = { messageData: msg, regionId: p.regionId };

    p.progress = 0.0;
    p.startProgress = 0.0;
    p.endProgress = 0.0;
    p.startDelay = 0;
    p.line.material.opacity = 0.8;
    p.mesh.visible = false;
    p.pendingReset = false;
    p.state = 'DRAWING';
  }

  regionSelect.addEventListener('change', (e) => {
    currentTargetKey = e.target.value;
    updateHighlightedPrefecture(currentTargetKey);
    filterMessagesByTarget(currentTargetKey);
    updateTargetLinks(currentTargetKey);
    initArcRoutes();
  });

  /* =========================================================
     10. レイキャスト判定
  ========================================================= */
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  raycaster.params.Line.threshold = 0.2; 

  function handlePointerSelect(clientX, clientY) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((clientX - rect.left) / container.clientWidth) * 2 - 1;
    mouse.y = -((clientY - rect.top) / container.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const validObjects = interactiveObjects.filter(obj => obj.parent?.isMesh ? obj.parent.visible : obj.visible);
    const intersects = raycaster.intersectObjects(validObjects, true);

    if (intersects.length > 0) {
      intersects.sort((a, b) => a.distance - b.distance);
      const selected = intersects[0].object;
      if (selected.userData?.messageData) {
        updateMessageDisplay(selected.userData.messageData);
        startAutoSwitchTimer();
      }
    }
  }

  container.addEventListener('click', (e) => handlePointerSelect(e.clientX, e.clientY));
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) handlePointerSelect(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  /* =========================================================
     11. 描画・アニメーションメインループ
  ========================================================= */
  const DURATION_SECONDS = 3.5;

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    Object.keys(prefectureMeshes).forEach(name => {
      const mesh = prefectureMeshes[name];
      if (mesh.userData.targetY !== undefined) {
        mesh.position.y += (mesh.userData.targetY - mesh.position.y) * 0.1;
      }
    });

    particles.forEach(p => {
      if (p.state === 'WAITING') {
        p.startDelay -= delta;
        if (p.startDelay <= 0) p.state = 'DRAWING';
      } else if (p.state === 'DRAWING') {
        p.mesh.visible = false;
        p.endProgress += delta * p.drawSpeed;
        if (p.endProgress >= 1.0) {
          p.endProgress = 1.0;
          p.state = 'MOVING';
          p.progress = 0.0;
          p.mesh.position.copy(p.curve.getPoint(0.0));
          p.mesh.visible = true;
        }
      } else if (p.state === 'MOVING') {
        p.progress += delta / DURATION_SECONDS;
        if (p.progress >= 1.0) {
          p.progress = 1.0;
          if (p.pendingReset) p.state = 'LEAVING';
          else p.progress = 0.0;
        }
        p.mesh.position.copy(p.curve.getPoint(p.progress));

        if (p.progress < 0.1) {
          p.mesh.material.opacity = p.progress / 0.1;
        } else if (p.progress > 0.7) {
          p.mesh.material.opacity = (1.0 - p.progress) / 0.3;
        } else {
          p.mesh.material.opacity = 1.0;
        }

      } else if (p.state === 'LEAVING') {
        p.mesh.visible = false;
        p.startProgress += delta * p.drawSpeed;
        if (p.startProgress >= 1.0) {
          p.startProgress = 1.0;
          resetSingleRoute(p);
        }
        p.line.material.opacity = Math.max(0, 0.8 * (1.0 - p.startProgress));
      }

      if (p.state !== 'WAITING') {
        const startIndex = Math.floor(p.startProgress * 50);
        const endIndex = Math.ceil(p.endProgress * 50);
        p.line.geometry.setDrawRange(startIndex, Math.max(0, endIndex - startIndex));
      }
    });

    renderer.render(scene, camera);
  }

  /* =========================================================
     12. アプリケーション全体の初期化
  ========================================================= */
  async function initApp() {
    updateTargetLinks(currentTargetKey);
    initNewsDisplay();

    animate();

    const [modelRes] = await Promise.allSettled([
      loadJapanModelAsync(),
      fetchMessages(),
      fetchNewsData()
    ]);

    if (modelRes.status === 'fulfilled') {
      initArcRoutes();
    } else {
      console.error("アプリ初期化エラー (3Dモデル取得失敗):", modelRes.reason);
    }
  }

  initApp();

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      fitCameraToMap();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }, 100);
  });
});