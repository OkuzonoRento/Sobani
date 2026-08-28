// =========================================================
// 47都道府県キーリスト
// 画面上のドロップダウンやランダム選択の全対象とする場合はこちらを使用
// =========================================================
const ALL_PREFECTURES = [
  "fukui",
  "mie","nara",
];

// 表示対象の都道府県キー設定（全県対象にする場合は ALL_PREFECTURES を指定）
const DISPLAY_PREFECTURES = ALL_PREFECTURES;

// =========================================================
// 47都道府県 マスターデータ
// =========================================================
const PREFECTURES_DATA = {
  // --- 北海道・東北 ---
  hokkaido: {
    name: "北海道",
    url: "https://www.pref.hokkaido.lg.jp/",
    desc: "北海道の公式義援金・寄付金窓口へ直接振り込みます。"
  },
  aomori: {
    name: "青森県",
    url: "https://www.pref.aomori.lg.jp/",
    desc: "青森県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  iwate: {
    name: "岩手県",
    url: "https://www.pref.iwate.jp/",
    desc: "岩手県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  miyagi: {
    name: "宮城県",
    url: "https://www.pref.miyagi.jp/",
    desc: "宮城県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  akita: {
    name: "秋田県",
    url: "https://www.pref.akita.lg.jp/",
    desc: "秋田県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  yamagata: {
    name: "山形県",
    url: "https://www.pref.yamagata.jp/",
    desc: "山形県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  fukushima: {
    name: "福島県",
    url: "https://www.pref.fukushima.lg.jp/",
    desc: "福島県の公式義援金・寄付金口座へ直接振り込みます。"
  },

  // --- 関東 ---
  ibaraki: {
    name: "茨城県",
    url: "https://www.pref.ibaraki.jp/",
    desc: "茨城県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  tochigi: {
    name: "栃木県",
    url: "https://www.pref.tochigi.lg.jp/",
    desc: "栃木県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  gunma: {
    name: "群馬県",
    url: "https://www.pref.gunma.jp/",
    desc: "群馬県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  saitama: {
    name: "埼玉県",
    url: "https://www.pref.saitama.lg.jp/",
    desc: "埼玉県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  chiba: {
    name: "千葉県",
    url: "https://www.pref.chiba.lg.jp/",
    desc: "千葉県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  tokyo: {
    name: "東京都",
    url: "https://www.metro.tokyo.lg.jp/",
    desc: "東京都の公式義援金・寄付金口座へ直接振り込みます。"
  },
  kanagawa: {
    name: "神奈川県",
    url: "https://www.pref.kanagawa.jp/",
    desc: "神奈川県の公式義援金・寄付金口座へ直接振り込みます。"
  },

  // --- 中部 ---
  niigata: {
    name: "新潟県",
    url: "https://www.pref.niigata.lg.jp/",
    desc: "新潟県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  toyama: {
    name: "富山県",
    url: "https://www.pref.toyama.jp/",
    desc: "富山県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  ishikawa: {
    name: "石川県",
    url: "https://www.pref.ishikawa.lg.jp/kensei/koho/gienkin.html",
    desc: "石川県が開設している公式の災害義援金・寄付金口座へ直接振り込みます。"
  },
  fukui: {
    name: "福井県",
    url: "https://www.pref.fukui.lg.jp/",
    desc: "福井県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  yamanashi: {
    name: "山梨県",
    url: "https://www.pref.yamanashi.jp/",
    desc: "山梨県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  nagano: {
    name: "長野県",
    url: "https://www.pref.nagano.lg.jp/",
    desc: "長野県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  gifu: {
    name: "岐阜県",
    url: "https://www.pref.gifu.lg.jp/",
    desc: "岐阜県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  shizuoka: {
    name: "静岡県",
    url: "https://www.pref.shizuoka.jp/",
    desc: "静岡県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  aichi: {
    name: "愛知県",
    url: "https://www.pref.aichi.jp/",
    desc: "愛知県の公式義援金・寄付金口座へ直接振り込みます。"
  },

  // --- 関西 ---
  mie: {
    name: "三重県",
    url: "https://www.pref.mie.lg.jp/",
    desc: "三重県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  shiga: {
    name: "滋賀県",
    url: "https://www.pref.shiga.lg.jp/",
    desc: "滋賀県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  kyoto: {
    name: "京都府",
    url: "https://www.pref.kyoto.jp/",
    desc: "京都府の公式義援金・寄付金口座へ直接振り込みます。"
  },
  osaka: {
    name: "大阪府",
    url: "https://www.pref.osaka.lg.jp/",
    desc: "大阪府の公式義援金・寄付金口座へ直接振り込みます。"
  },
  hyogo: {
    name: "兵庫県",
    url: "https://web.pref.hyogo.lg.jp/",
    desc: "兵庫県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  nara: {
    name: "奈良県",
    url: "https://www.pref.nara.jp/",
    desc: "奈良県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  wakayama: {
    name: "和歌山県",
    url: "https://www.pref.wakayama.lg.jp/",
    desc: "和歌山県の公式義援金・寄付金口座へ直接振り込みます。"
  },

  // --- 中国 ---
  tottori: {
    name: "鳥取県",
    url: "https://www.pref.tottori.lg.jp/",
    desc: "鳥取県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  shimane: {
    name: "島根県",
    url: "https://www.pref.shimane.lg.jp/",
    desc: "島根県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  okayama: {
    name: "岡山県",
    url: "https://www.pref.okayama.jp/",
    desc: "岡山県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  hiroshima: {
    name: "広島県",
    url: "https://www.pref.hiroshima.lg.jp/",
    desc: "広島県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  yamaguchi: {
    name: "山口県",
    url: "https://www.pref.yamaguchi.lg.jp/",
    desc: "山口県の公式義援金・寄付金口座へ直接振り込みます。"
  },

  // --- 四国 ---
  tokushima: {
    name: "徳島県",
    url: "https://www.pref.tokushima.lg.jp/",
    desc: "徳島県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  kagawa: {
    name: "香川県",
    url: "https://www.pref.kagawa.lg.jp/",
    desc: "香川県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  ehime: {
    name: "愛媛県",
    url: "https://www.pref.ehime.jp/",
    desc: "愛媛県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  kochi: {
    name: "高知県",
    url: "https://www.pref.kochi.lg.jp/",
    desc: "高知県の公式義援金・寄付金口座へ直接振り込みます。"
  },

  // --- 九州・沖縄 ---
  fukuoka: {
    name: "福岡県",
    url: "https://www.pref.fukuoka.lg.jp/",
    desc: "福岡県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  saga: {
    name: "佐賀県",
    url: "https://www.pref.saga.lg.jp/",
    desc: "佐賀県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  nagasaki: {
    name: "長崎県",
    url: "https://www.pref.nagasaki.jp/",
    desc: "長崎県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  kumamoto: {
    name: "熊本県",
    url: "https://www.pref.kumamoto.jp/soshiki/30/50702.html",
    desc: "熊本県が開設している公式の災害義援金・寄付金口座へ直接振り込みます。"
  },
  oita: {
    name: "大分県",
    url: "https://www.pref.oita.jp/",
    desc: "大分県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  miyazaki: {
    name: "宮崎県",
    url: "https://www.pref.miyazaki.lg.jp/",
    desc: "宮崎県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  kagoshima: {
    name: "鹿児島県",
    url: "https://www.pref.kagoshima.jp/",
    desc: "鹿児島県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  okinawa: {
    name: "沖縄県",
    url: "https://www.pref.okinawa.lg.jp/",
    desc: "沖縄県の公式義援金・寄付金口座へ直接振り込みます。"
  }
};

// 判定不能メッセージ用（発信地が「海外・未定・データなし」の初期位置）
// ※ 3Dメッシュが存在しない「仮想発信地」となるため、この座標のみ維持しています
const UNKNOWN_POINT = {
  name: "どこか",
  pos: { x: -1.8, y: 0.1, z: -0.8 }
};

// =========================================================
// 都道府県表記変換マッピングおよび正規化関数
// =========================================================
const KANJI_TO_ID_MAP = {
  '北海道': 'hokkaido',
  '青森': 'aomori', '青森県': 'aomori',
  '岩手': 'iwate', '岩手県': 'iwate',
  '宮城': 'miyagi', '宮城県': 'miyagi',
  '秋田': 'akita', '秋田県': 'akita',
  '山形': 'yamagata', '山形県': 'yamagata',
  '福島': 'fukushima', '福島県': 'fukushima',
  '茨城': 'ibaraki', '茨城県': 'ibaraki',
  '栃木': 'tochigi', '栃木県': 'tochigi',
  '群馬': 'gunma', '群馬県': 'gunma',
  '埼玉': 'saitama', '埼玉県': 'saitama',
  '千葉': 'chiba', '千葉県': 'chiba',
  '東京': 'tokyo', '東京都': 'tokyo',
  '神奈川': 'kanagawa', '神奈川県': 'kanagawa',
  '新潟': 'niigata', '新潟県': 'niigata',
  '富山': 'toyama', '富山県': 'toyama',
  '石川': 'ishikawa', '石川県': 'ishikawa',
  '福井': 'fukui', '福井県': 'fukui',
  '山梨': 'yamanashi', '山梨県': 'yamanashi',
  '長野': 'nagano', '長野県': 'nagano',
  '岐阜': 'gifu', '岐阜県': 'gifu',
  '静岡': 'shizuoka', '静岡県': 'shizuoka',
  '愛知': 'aichi', '愛知県': 'aichi',
  '三重': 'mie', '三重県': 'mie',
  '滋賀': 'shiga', '滋賀県': 'shiga',
  '京都': 'kyoto', '京都府': 'kyoto',
  '大阪': 'osaka', '大阪府': 'osaka',
  '兵庫': 'hyogo', '兵庫県': 'hyogo',
  '奈良': 'nara', '奈良県': 'nara',
  '和歌山': 'wakayama', '和歌山県': 'wakayama',
  '鳥取': 'tottori', '鳥取県': 'tottori',
  '島根': 'shimane', '島根県': 'shimane',
  '岡山': 'okayama', '岡山県': 'okayama',
  '広島': 'hiroshima', '広島県': 'hiroshima',
  '山口': 'yamaguchi', '山口県': 'yamaguchi',
  '徳島': 'tokushima', '徳島県': 'tokushima',
  '香川': 'kagawa', '香川県': 'kagawa',
  '愛媛': 'ehime', '愛媛県': 'ehime',
  '高知': 'kochi', '高知県': 'kochi',
  '福岡': 'fukuoka', '福岡県': 'fukuoka',
  '佐賀': 'saga', '佐賀県': 'saga',
  '長崎': 'nagasaki', '長崎県': 'nagasaki',
  '熊本': 'kumamoto', '熊本県': 'kumamoto',
  '大分': 'oita', '大分県': 'oita',
  '宮崎': 'miyazaki', '宮崎県': 'miyazaki',
  '鹿児島': 'kagoshima', '鹿児島県': 'kagoshima',
  '沖縄': 'okinawa', '沖縄県': 'okinawa'
};

/**
 * 任意の文字列（漢字・アルファベット）を小文字IDへ正規化
 */
function normalizeToPrefectureId(val) {
  if (!val) return 'unknown';
  const cleanVal = String(val).trim();
  return KANJI_TO_ID_MAP[cleanVal] || cleanVal.toLowerCase();
}