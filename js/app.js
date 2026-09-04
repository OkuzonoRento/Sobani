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
  const STRIPE_CHECKOUT_URL = 'https://donate.stripe.com/test_28E8wP9mugHx5kX0qkf3a00';

  // Supabase クライアント初期化
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
     2. DOM要素の取得
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

  const aboutModal = document.getElementById('about-modal');
  const openAboutModalBtn = document.getElementById('open-about-modal');
  const aboutModalClose = document.getElementById('about-modal-close');
  const aboutTabBtns = document.querySelectorAll('.about-tab-btn');
  const aboutTabContents = document.querySelectorAll('.about-tab-content');

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
     3. モーダル表示制御関数
  ========================================================= */
  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('is-open');
    modalEl.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('is-open');
    modalEl.style.display = 'none';
    
    const openModals = document.querySelectorAll('.modal-backdrop.is-open');
    if (openModals.length === 0) {
      document.body.style.overflow = '';
    }
  }

  /* =========================================================
     4. 都道府県ドロップダウン初期化
  ========================================================= */
  if (typeof DISPLAY_PREFECTURES !== 'undefined' && Array.isArray(DISPLAY_PREFECTURES)) {
    const fragment = document.createDocumentFragment();
    DISPLAY_PREFECTURES.forEach(key => {
      if (typeof PREFECTURES_DATA !== 'undefined' && PREFECTURES_DATA[key]) {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = PREFECTURES_DATA[key].name;
        fragment.appendChild(opt);
      }
    });
    regionSelect.appendChild(fragment);
  }

  const defaultPrefecture = (typeof DISPLAY_PREFECTURES !== 'undefined' && DISPLAY_PREFECTURES.length > 0)
  ? DISPLAY_PREFECTURES[0]
  : (typeof ALL_PREFECTURES !== 'undefined' && ALL_PREFECTURES.length > 0 ? ALL_PREFECTURES[0] : 'fukui');

  let currentTargetKey = defaultPrefecture;

  document.addEventListener('DOMContentLoaded', () => {
    if (regionSelect) {
      regionSelect.value = currentTargetKey;
      updateTargetLinks(currentTargetKey);
    }
  });
  regionSelect.value = currentTargetKey;

  /* =========================================================
     5. モーダル・UIイベントリスナー
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

  const SUCCESS_MESSAGE = "動画広告の視聴が完了しました！\nご協力ありがとうございます。\n収益は寄付金として支援されました。";

  function handleAdRewardDonate() {
    if (typeof window.RewardAdSDK === 'undefined') {
      console.warn('RewardAdSDK が未ロードのためデモ完了として処理します。');
      closeModal(donateModal);
      showResultModal(SUCCESS_MESSAGE);
      return;
    }

    window.RewardAdSDK.show({
      adUnitId: 'ca-pub-8872888803893974/4540673903',
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

  function updateTargetLinks(targetKey) {
    if (typeof PREFECTURES_DATA === 'undefined') return;
    const data = PREFECTURES_DATA[targetKey] || PREFECTURES_DATA.ishikawa;
    if (!data) return;

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
      if (STRIPE_CHECKOUT_URL && STRIPE_CHECKOUT_URL !== '#') {
        window.open(STRIPE_CHECKOUT_URL, '_blank', 'noopener,noreferrer');
      } else {
        showResultModal('現在Stripe決済の準備中です。');
      }
    });
  }

  if (openAboutModalBtn) {
    openAboutModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dropdownMenu.classList.remove('is-active');
      openModal(aboutModal);
    });
  }

  if (aboutModalClose) aboutModalClose.addEventListener('click', () => closeModal(aboutModal));
  if (aboutModal) {
    aboutModal.addEventListener('click', (e) => {
      if (e.target === aboutModal) closeModal(aboutModal);
    });
  }

  aboutTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      aboutTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      aboutTabContents.forEach(content => {
        content.style.display = (content.id === `tab-content-${targetTab}`) ? 'block' : 'none';
      });
    });
  });

  if (openShareModalBtn) {
    openShareModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dropdownMenu.classList.remove('is-active');
      openModal(shareModal);
    });
  }

  if (shareModalClose) shareModalClose.addEventListener('click', () => closeModal(shareModal));
  if (shareModal) {
    shareModal.addEventListener('click', (e) => {
      if (e.target === shareModal) closeModal(shareModal);
    });
  }
  if (shareTwitterBtn) shareTwitterBtn.addEventListener('click', () => closeModal(shareModal));

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
     6. ニュース機能
  ========================================================= */
  try {
    const savedReadIds = JSON.parse(localStorage.getItem('readNewsIds') || '[]');
    savedReadIds.forEach(id => readNewsIds.add(String(id)));
  } catch (e) {
    console.warn('LocalStorageの読み込みに失敗しました:', e);
  }

  function markAsRead(newsId) {
    readNewsIds.add(String(newsId));
    try {
      localStorage.setItem('readNewsIds', JSON.stringify(Array.from(readNewsIds)));
    } catch (e) {
      console.warn('LocalStorageへの書き込みに失敗しました:', e);
    }
  }

  async function fetchNewsData() {
    try {
      const response = await fetch(`${GAS_NEWS_URL}?action=getNews`, { method: 'GET', mode: 'cors' });
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
      console.warn('ニュースデータの取得に失敗:', error);
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
    const isUnread = !readNewsIds.has(String(item.id));
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

    const hasUnread = currentNewsData.some(item => !readNewsIds.has(String(item.id)));
    if (dropdownNewsUnread) dropdownNewsUnread.style.display = hasUnread ? 'inline-block' : 'none';
    if (menuBtnUnread) menuBtnUnread.style.display = hasUnread ? 'inline-block' : 'none';
  }

  function showNewsListModal() {
    newsOpenedFrom = 'dropdown';
    if (newsViewList) newsViewList.style.display = 'block';
    if (newsViewDetail) newsViewDetail.style.display = 'none';
    if (newsModalClose) newsModalClose.style.display = 'block';
    openModal(newsModal);
    if (dropdownMenu) dropdownMenu.classList.remove('is-active');
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

  const closeNewsModal = () => closeModal(newsModal);

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
     7. 不具合報告機能
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

  if (bugModal) {
    bugModal.addEventListener('click', (e) => {
      if (!isSubmitting && e.target === bugModal) closeModal(bugModal);
    });
  }

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
      const activePrefName = (typeof PREFECTURES_DATA !== 'undefined' && PREFECTURES_DATA[currentTargetKey]) 
        ? PREFECTURES_DATA[currentTargetKey].name 
        : currentTargetKey;
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
        showResultModal('不具合報告を送信しました。\nご協力ありがとうございます！');
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
     8. メッセージデータ管理
  ========================================================= */
  let allMessages = []; 
  let currentFilteredMessages = []; 
  let currentMsgIndex = -1;
  let autoSwitchTimer = null;
  let routeIntervalTimer = null;

  function getPrefecturalInfo(identifier) {
    const defaultUnknown = (typeof UNKNOWN_POINT !== 'undefined') 
      ? UNKNOWN_POINT 
      : { name: "どこか", pos: { x: -1.5, y: 0.75, z: -0.8 } };

    const toVector3 = (p) => {
      if (p instanceof THREE.Vector3) return p.clone();
      return new THREE.Vector3(p.x, p.y, p.z);
    };

    if (!identifier) {
      return { name: defaultUnknown.name, pos: toVector3(defaultUnknown.pos) };
    }

    const searchKey = (typeof normalizeToPrefectureId === 'function') 
      ? normalizeToPrefectureId(identifier) 
      : String(identifier).toLowerCase();

    if (searchKey === 'unknown' || searchKey === 'other' || searchKey === 'どこか') {
      return { 
        name: defaultUnknown.name, 
        pos: toVector3(defaultUnknown.pos) 
      };
    }

    let matchedData = (typeof PREFECTURES_DATA !== 'undefined') ? PREFECTURES_DATA[searchKey] : null;

    if (matchedData) {
      const englishMeshName = matchedData.en || (searchKey.charAt(0).toUpperCase() + searchKey.slice(1));
      if (prefectureMeshes[englishMeshName]) {
        const worldPos = new THREE.Vector3();
        prefectureMeshes[englishMeshName].getWorldPosition(worldPos);
        return { name: matchedData.name, pos: worldPos };
      }
    }

    return { 
      name: defaultUnknown.name, 
      pos: toVector3(defaultUnknown.pos) 
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

  const DEBUG_SAMPLE_TEXTS = [
    'デバッグ：いつも遠くから応援しています！',
    'デバッグ：全国から温かい声援をお届けします。',
    'デバッグ：一日も早い復興を心よりお祈り申し上げます。',
    'デバッグ：みんなで力を合わせて乗り越えましょう！',
    'デバッグ：少しでも力になれれば幸いです。',
    'デバッグ：現地で頑張る皆様へエールを送ります！'
  ];

  async function fetchMessages() {
    let rawMessages = [];

    if (!supabaseClient) {
      console.warn('Supabase SDK が初期化されていません。');
    } else {
      try {
        const { data, error } = await supabaseClient.from('Retrieved_posts').select('*');
        if (error) throw error;
        if (data && Array.isArray(data) && data.length > 0) {
          rawMessages = data;
        }
      } catch (error) {
        console.warn('Supabase取得エラー:', error.message || error);
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
          const normalizedSourceId = (typeof normalizeToPrefectureId === 'function') ? normalizeToPrefectureId(rawFrom) : rawFrom;
          const normalizedTargetId = (typeof normalizeToPrefectureId === 'function') ? normalizeToPrefectureId(rawTo) : rawTo;

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

  function generateRandomDebugMessages(count = 40) {
    const prefKeys = Object.keys(PREFECTURES_DATA).filter(k => k !== 'debug');
    prefKeys.push('unknown');

    const dummyList = [];

    for (let i = 0; i < count; i++) {
      const randomFromKey = prefKeys[Math.floor(Math.random() * prefKeys.length)];
      const randomText = DEBUG_SAMPLE_TEXTS[Math.floor(Math.random() * DEBUG_SAMPLE_TEXTS.length)];

      dummyList.push({
        id: `dbg-rand-${i}`,
        to: 'debug',
        sourceId: randomFromKey,
        regionId: getRegionIdBySourceId(randomFromKey),
        from: getPrefecturalInfo(randomFromKey).name,
        userId: `@debug_user${i + 1}`,
        message: randomText
      });
    }

    return dummyList;
  }

  function filterMessagesByTarget(targetKey) {
    if (targetKey === 'debug') {
      currentFilteredMessages = generateRandomDebugMessages(30);
    } else {
      currentFilteredMessages = allMessages.filter(item => item.to === targetKey || !item.to);
    }

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
     9. Three.js 3Dマップ設定
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
  let boatModel = null;
  const defaultMaterial = new THREE.MeshStandardMaterial({ color: 0x4caf50, roughness: 0.1, metalness: 0.1 });
  const highlightMaterial = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.0, metalness: 0.1 });
  const sharedParticleGeo = new THREE.SphereGeometry(0.2, 16, 16);

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

            loader.load(
              'models/boat.glb',
              (boatGltf) => {
                boatModel = boatGltf.scene;
                boatModel.position.set(-1.5, 0.75, -0.8);
                boatModel.scale.set(0.2, 0.2, 0.2);
                boatModel.rotation.set(0, Math.PI / 4, 0);
                scene.add(boatModel);
                resolve();
              },
              undefined,
              (boatErr) => {
                console.warn('boat.glb の読み込みに失敗しました:', boatErr);
                resolve();
              }
            );
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
    if (typeof PREFECTURES_DATA === 'undefined') return;
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
     10. 3Dアーカールート・動的描画（粒子の速度調整）
  ========================================================= */
  let particles = [];
  const lineGroup = new THREE.Group();
  scene.add(lineGroup);
  let interactiveObjects = [];

  const CURVE_DIVISIONS = 40;

  function updateTubeMeshGeometry(mesh, curve, startRatio, endRatio) {
    if (startRatio >= endRatio || endRatio <= 0.001) {
      mesh.visible = false;
      return;
    }
    mesh.visible = true;

    const points = [];
    const steps = Math.max(2, Math.floor(CURVE_DIVISIONS * (endRatio - startRatio)));
    for (let i = 0; i <= steps; i++) {
      const t = startRatio + (i / steps) * (endRatio - startRatio);
      points.push(curve.getPoint(t));
    }

    if (points.length < 2) {
      mesh.visible = false;
      return;
    }

    const subCurve = new THREE.CatmullRomCurve3(points);
    const newGeo = new THREE.TubeGeometry(subCurve, steps, 0.04, 6, false);

    if (mesh.geometry) mesh.geometry.dispose();
    mesh.geometry = newGeo;
  }

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

    const lineMat = new THREE.MeshStandardMaterial({
      color: regionColor,
      emissive: regionColor,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.95,
      roughness: 0.2
    });

    const dummyGeo = new THREE.BufferGeometry();
    const line = new THREE.Mesh(dummyGeo, lineMat);
    line.userData = { messageData: msg, regionId: regionId };
    line.visible = false;
    lineGroup.add(line);

    const particleMat = new THREE.MeshBasicMaterial({ color: regionColor, transparent: true, opacity: 0 });
    const particle = new THREE.Mesh(sharedParticleGeo, particleMat);
    particle.visible = false;

    const hitMesh = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 8), new THREE.MeshBasicMaterial({ visible: false }));
    hitMesh.userData = { messageData: msg, regionId: regionId };
    particle.add(hitMesh);
    
    interactiveObjects.push(hitMesh);
    scene.add(particle);

    // 【速度調整】0.3 -> 0.2 へ少し低速化
    const drawDuration = 0.6 + Math.random() * 0.4;
    const leaveDuration = 0.6 + Math.random() * 0.4;
    const particleSpeed = 0.2; 
    const loopCount = 3 + Math.floor(Math.random() * 2); // 速度低下にともない周回数を少し調整して全体の滞在時間を最適化
    const moveDuration = (1.0 / particleSpeed) * loopCount;

    particles.push({
      mesh: particle,
      hitMesh,
      line,
      curve,
      regionId: regionId,
      
      age: 0.0,
      drawDuration,
      moveDuration,
      leaveDuration,
      particleSpeed,
      startDelay: Math.random() * 3.0,
      state: 'WAITING'
    });
  }

  function initArcRoutes() {
    clearArcRoutes();
    const activeRegionIds = [...new Set(currentFilteredMessages.map(msg => msg.regionId))];

    activeRegionIds.forEach(regionId => {
      createSingleRouteForRegion(regionId);
    });
  }

  function resetRouteLifetime(p) {
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
    p.line.userData = { messageData: msg, regionId: p.regionId };
    p.hitMesh.userData = { messageData: msg, regionId: p.regionId };

    // 【速度調整】0.3 -> 0.2 へ少し低速化
    p.age = 0.0;
    p.drawDuration = 0.6 + Math.random() * 0.4;
    p.leaveDuration = 0.6 + Math.random() * 0.4;
    p.particleSpeed = 0.2;
    const loopCount = 3 + Math.floor(Math.random() * 2);
    p.moveDuration = (1.0 / p.particleSpeed) * loopCount;

    p.mesh.visible = false;
    p.line.visible = false;
    p.state = 'WAITING';
  }

  regionSelect.addEventListener('change', (e) => {
    currentTargetKey = e.target.value;
    updateHighlightedPrefecture(currentTargetKey);
    filterMessagesByTarget(currentTargetKey);
    updateTargetLinks(currentTargetKey);
    initArcRoutes();
  });

  /* =========================================================
     11. レイキャスト・メッセージタップ判定
  ========================================================= */
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  raycaster.params.Line.threshold = 0.05;

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
     12. アニメーションメインループ
  ========================================================= */
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
        if (p.startDelay <= 0) {
          p.state = 'RUNNING';
          p.age = 0.0;
        }
        return;
      }

      if (p.state === 'RUNNING') {
        p.age += delta;

        const tDraw = p.drawDuration;
        const tMove = tDraw + p.moveDuration;
        const tLeave = tMove + p.leaveDuration;

        if (p.age < tDraw) {
          const ratio = p.age / tDraw;
          updateTubeMeshGeometry(p.line, p.curve, 0.0, ratio);
          p.mesh.visible = false;
        } 
        else if (p.age < tMove) {
          const singleLoopProgress = ((p.age - tDraw) * p.particleSpeed) % 1.0;
          
          p.mesh.position.copy(p.curve.getPoint(singleLoopProgress));
          p.mesh.visible = true;

          if (singleLoopProgress < 0.1) {
            p.mesh.material.opacity = singleLoopProgress / 0.1;
          } else if (singleLoopProgress > 0.8) {
            p.mesh.material.opacity = (1.0 - singleLoopProgress) / 0.2;
          } else {
            p.mesh.material.opacity = 1.0;
          }

          updateTubeMeshGeometry(p.line, p.curve, 0.0, 1.0);
        } 
        else if (p.age < tLeave) {
          p.mesh.visible = false;
          const leaveRatio = (p.age - tMove) / p.leaveDuration;
          updateTubeMeshGeometry(p.line, p.curve, leaveRatio, 1.0);
        } 
        else {
          resetRouteLifetime(p);
        }
      }
    });

    renderer.render(scene, camera);
  }

  /* =========================================================
     13. アプリ全体の非同期初期化
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
      console.error("3Dモデル読み込み失敗:", modelRes.reason);
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

  const adElements = document.querySelectorAll('.adsbygoogle');
  adElements.forEach((adEl) => {
    if (!adEl.getAttribute('data-adsbygoogle-status')) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  });
});