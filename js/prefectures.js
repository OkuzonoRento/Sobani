// =========================================================
// 画面に表示したい都道府県のキーを指定（必要な県のみ抽出）
// =========================================================
const DISPLAY_PREFECTURES = [
  "ishikawa",
  "kumamoto",
  "tokyo",
  "okinawa"
];

// =========================================================
// 47都道府県 マスターデータ（拡大マップ用に座標調整済み）
// =========================================================
const PREFECTURES_DATA = {
  // --- 北海道・東北 ---
  hokkaido: {
    name: "北海道",
    pos: { x: 3.8, y: 0.1, z: -2.4 },
    url: "https://www.pref.hokkaido.lg.jp/",
    desc: "北海道の公式義援金・寄付金窓口へ直接振り込みます。"
  },
  aomori: {
    name: "青森県",
    pos: { x: 2.8, y: 0.1, z: -1.2 },
    url: "https://www.pref.aomori.lg.jp/",
    desc: "青森県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  iwate: {
    name: "岩手県",
    pos: { x: 2.9, y: 0.1, z: -0.6 },
    url: "https://www.pref.iwate.jp/",
    desc: "岩手県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  miyagi: {
    name: "宮城県",
    pos: { x: 2.8, y: 0.1, z: -0.1 },
    url: "https://www.pref.miyagi.jp/",
    desc: "宮城県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  akita: {
    name: "秋田県",
    pos: { x: 2.4, y: 0.1, z: -0.8 },
    url: "https://www.pref.akita.lg.jp/",
    desc: "秋田県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  yamagata: {
    name: "山形県",
    pos: { x: 2.2, y: 0.1, z: -0.3 },
    url: "https://www.pref.yamagata.jp/",
    desc: "山形県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  fukushima: {
    name: "福島県",
    pos: { x: 2.4, y: 0.1, z: 0.1 },
    url: "https://www.pref.fukushima.lg.jp/",
    desc: "福島県の公式義援金・寄付金口座へ直接振り込みます。"
  },

  // --- 関東 ---
  ibaraki: {
    name: "茨城県",
    pos: { x: 2.2, y: 0.1, z: 0.4 },
    url: "https://www.pref.ibaraki.jp/",
    desc: "茨城県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  tochigi: {
    name: "栃木県",
    pos: { x: 1.9, y: 0.1, z: 0.3 },
    url: "https://www.pref.tochigi.lg.jp/",
    desc: "栃木県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  gunma: {
    name: "群馬県",
    pos: { x: 1.5, y: 0.1, z: 0.3 },
    url: "https://www.pref.gunma.jp/",
    desc: "群馬県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  saitama: {
    name: "埼玉県",
    pos: { x: 1.6, y: 0.1, z: 0.5 },
    url: "https://www.pref.saitama.lg.jp/",
    desc: "埼玉県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  chiba: {
    name: "千葉県",
    pos: { x: 2.2, y: 0.1, z: 0.7 },
    url: "https://www.pref.chiba.lg.jp/",
    desc: "千葉県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  tokyo: {
    name: "東京都",
    pos: { x: 1.7, y: 0.1, z: 0.6 },
    url: "https://www.metro.tokyo.lg.jp/",
    desc: "東京都の公式義援金・寄付金口座へ直接振り込みます。"
  },
  kanagawa: {
    name: "神奈川県",
    pos: { x: 1.7, y: 0.1, z: 0.8 },
    url: "https://www.pref.kanagawa.jp/",
    desc: "神奈川県の公式義援金・寄付金口座へ直接振り込みます。"
  },

  // --- 中部 ---
  niigata: {
    name: "新潟県",
    pos: { x: 1.2, y: 0.1, z: -0.1 },
    url: "https://www.pref.niigata.lg.jp/",
    desc: "新潟県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  toyama: {
    name: "富山県",
    pos: { x: 0.3, y: 0.1, z: -0.1 },
    url: "https://www.pref.toyama.jp/",
    desc: "富山県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  ishikawa: {
    name: "石川県",
    pos: { x: -0.6, y: 0.2, z: -0.3 },
    url: "https://www.pref.ishikawa.lg.jp/kensei/koho/gienkin.html",
    desc: "石川県が開設している公式の災害義援金・寄付金口座へ直接振り込みます。"
  },
  fukui: {
    name: "福井県",
    pos: { x: -0.3, y: 0.1, z: 0.1 },
    url: "https://www.pref.fukui.lg.jp/",
    desc: "福井県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  yamanashi: {
    name: "山梨県",
    pos: { x: 1.2, y: 0.1, z: 0.5 },
    url: "https://www.pref.yamanashi.jp/",
    desc: "山梨県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  nagano: {
    name: "長野県",
    pos: { x: 1.0, y: 0.1, z: 0.3 },
    url: "https://www.pref.nagano.lg.jp/",
    desc: "長野県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  gifu: {
    name: "岐阜県",
    pos: { x: 0.4, y: 0.1, z: 0.3 },
    url: "https://www.pref.gifu.lg.jp/",
    desc: "岐阜県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  shizuoka: {
    name: "静岡県",
    pos: { x: 1.1, y: 0.1, z: 0.7 },
    url: "https://www.pref.shizuoka.jp/",
    desc: "静岡県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  aichi: {
    name: "愛知県",
    pos: { x: 0.5, y: 0.1, z: 0.6 },
    url: "https://www.pref.aichi.jp/",
    desc: "愛知県の公式義援金・寄付金口座へ直接振り込みます。"
  },

  // --- 関西 ---
  mie: {
    name: "三重県",
    pos: { x: 0.3, y: 0.1, z: 0.8 },
    url: "https://www.pref.mie.lg.jp/",
    desc: "三重県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  shiga: {
    name: "滋賀県",
    pos: { x: -0.1, y: 0.1, z: 0.4 },
    url: "https://www.pref.shiga.lg.jp/",
    desc: "滋賀県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  kyoto: {
    name: "京都府",
    pos: { x: -0.3, y: 0.1, z: 0.4 },
    url: "https://www.pref.kyoto.jp/",
    desc: "京都府の公式義援金・寄付金口座へ直接振り込みます。"
  },
  osaka: {
    name: "大阪府",
    pos: { x: 0.1, y: 0.1, z: 0.7 },
    url: "https://www.pref.osaka.lg.jp/",
    desc: "大阪府の公式義援金・寄付金口座へ直接振り込みます。"
  },
  hyogo: {
    name: "兵庫県",
    pos: { x: -0.7, y: 0.1, z: 0.5 },
    url: "https://web.pref.hyogo.lg.jp/",
    desc: "兵庫県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  nara: {
    name: "奈良県",
    pos: { x: 0.1, y: 0.1, z: 0.7 },
    url: "https://www.pref.nara.jp/",
    desc: "奈良県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  wakayama: {
    name: "和歌山県",
    pos: { x: -0.1, y: 0.1, z: 1.0 },
    url: "https://www.pref.wakayama.lg.jp/",
    desc: "和歌山県の公式義援金・寄付金口座へ直接振り込みます。"
  },

  // --- 中国 ---
  tottori: {
    name: "鳥取県",
    pos: { x: -1.1, y: 0.1, z: 0.4 },
    url: "https://www.pref.tottori.lg.jp/",
    desc: "鳥取県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  shimane: {
    name: "島根県",
    pos: { x: -1.7, y: 0.1, z: 0.4 },
    url: "https://www.pref.shimane.lg.jp/",
    desc: "島根県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  okayama: {
    name: "岡山県",
    pos: { x: -1.1, y: 0.1, z: 0.6 },
    url: "https://www.pref.okayama.jp/",
    desc: "岡山県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  hiroshima: {
    name: "広島県",
    pos: { x: -1.7, y: 0.1, z: 0.6 },
    url: "https://www.pref.hiroshima.lg.jp/",
    desc: "広島県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  yamaguchi: {
    name: "山口県",
    pos: { x: -2.2, y: 0.1, z: 0.7 },
    url: "https://www.pref.yamaguchi.lg.jp/",
    desc: "山口県の公式義援金・寄付金口座へ直接振り込みます。"
  },

  // --- 四国 ---
  tokushima: {
    name: "徳島県",
    pos: { x: -1.0, y: 0.1, z: 1.1 },
    url: "https://www.pref.tokushima.lg.jp/",
    desc: "徳島県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  kagawa: {
    name: "香川県",
    pos: { x: -1.1, y: 0.1, z: 0.9 },
    url: "https://www.pref.kagawa.lg.jp/",
    desc: "香川県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  ehime: {
    name: "愛媛県",
    pos: { x: -1.7, y: 0.1, z: 1.0 },
    url: "https://www.pref.ehime.jp/",
    desc: "愛媛県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  kochi: {
    name: "高知県",
    pos: { x: -1.4, y: 0.1, z: 1.1 },
    url: "https://www.pref.kochi.lg.jp/",
    desc: "高知県の公式義援金・寄付金口座へ直接振り込みます。"
  },

  // --- 九州・沖縄 ---
  fukuoka: {
    name: "福岡県",
    pos: { x: -2.8, y: 0.1, z: 1.4 },
    url: "https://www.pref.fukuoka.lg.jp/",
    desc: "福岡県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  saga: {
    name: "佐賀県",
    pos: { x: -3.1, y: 0.1, z: 1.4 },
    url: "https://www.pref.saga.lg.jp/",
    desc: "佐賀県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  nagasaki: {
    name: "長崎県",
    pos: { x: -3.4, y: 0.1, z: 1.5 },
    url: "https://www.pref.nagasaki.jp/",
    desc: "長崎県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  kumamoto: {
    name: "熊本県",
    pos: { x: -3.1, y: 0.2, z: 1.7 },
    url: "https://www.pref.kumamoto.jp/soshiki/30/50702.html",
    desc: "熊本県が開設している公式の災害義援金・寄付金口座へ直接振り込みます。"
  },
  oita: {
    name: "大分県",
    pos: { x: -2.5, y: 0.1, z: 1.5 },
    url: "https://www.pref.oita.jp/",
    desc: "大分県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  miyazaki: {
    name: "宮崎県",
    pos: { x: -2.7, y: 0.1, z: 1.9 },
    url: "https://www.pref.miyazaki.lg.jp/",
    desc: "宮崎県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  kagoshima: {
    name: "鹿児島県",
    pos: { x: -3.1, y: 0.1, z: 2.1 },
    url: "https://www.pref.kagoshima.jp/",
    desc: "鹿児島県の公式義援金・寄付金口座へ直接振り込みます。"
  },
  okinawa: {
    name: "沖縄県",
    pos: { x: -3.9, y: 0.1, z: 2.5 },
    url: "https://www.pref.okinawa.lg.jp/",
    desc: "沖縄県の公式義援金・寄付金口座へ直接振り込みます。"
  }
};