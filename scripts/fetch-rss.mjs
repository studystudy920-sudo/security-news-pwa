/**
 * セキュリティ関連RSSフィード取得スクリプト
 * GitHub Actions から実行され、data/security-feeds.json に出力
 */
import { writeFileSync, readFileSync } from "fs";

// ===== セキュリティRSSフィード定義 =====
const FEEDS = [
  // --- 日本語ソース ---
  { url: "https://www.jpcert.or.jp/rss/jpcert-all.rdf", source: "JPCERT/CC", lang: "ja", category: "alert" },
  { url: "https://www.ipa.go.jp/security/rss/alert.rdf", source: "IPA", lang: "ja", category: "alert" },
  { url: "https://jvn.jp/rss/jvn.rdf", source: "JVN", lang: "ja", category: "vuln" },
  { url: "https://piyolog.hatenadiary.jp/rss", source: "piyolog", lang: "ja", category: "analysis" },
  { url: "https://blog.tokumaru.org/feeds/posts/default?alt=rss", source: "徳丸浩の日記", lang: "ja", category: "analysis" },
  // --- 海外ソース ---
  { url: "https://feeds.feedburner.com/TheHackersNews", source: "The Hacker News", lang: "en", category: "news" },
  { url: "https://krebsonsecurity.com/feed/", source: "Krebs on Security", lang: "en", category: "news" },
  { url: "https://www.bleepingcomputer.com/feed/", source: "Bleeping Computer", lang: "en", category: "news" },
  { url: "https://isc.sans.edu/rssfeed_full.xml", source: "SANS ISC", lang: "en", category: "analysis" },
  { url: "https://www.cisa.gov/cybersecurity-advisories/all.xml", source: "CISA", lang: "en", category: "alert" },
  // --- Google セキュリティ ---
  { url: "https://security.googleblog.com/feeds/posts/default?alt=rss", source: "Google Security Blog", lang: "en", category: "news" },
  { url: "https://blog.google/threat-analysis-group/rss/", source: "Google TAG", lang: "en", category: "analysis" },
  // --- Google News セキュリティ(日本語) ---
  { url: "https://news.google.com/rss/search?q=%E3%82%B5%E3%82%A4%E3%83%90%E3%83%BC%E3%82%BB%E3%82%AD%E3%83%A5%E3%83%AA%E3%83%86%E3%82%A3&hl=ja&gl=JP&ceid=JP:ja", source: "Google News JP", lang: "ja", category: "news" },
];

// ===== XML パーサー（軽量、依存なし）=====
function parseXML(text) {
  // 簡易XMLパーサー：<item> or <entry> を抽出
  const items = [];
  // RSS 2.0 / RSS 1.0: <item>...</item>
  const itemRegex = /<item[\s>]([\s\S]*?)<\/item>/gi;
  // Atom: <entry>...</entry>
  const entryRegex = /<entry[\s>]([\s\S]*?)<\/entry>/gi;

  let match;
  const regex = text.includes("<entry") ? entryRegex : itemRegex;
  while ((match = regex.exec(text)) !== null) {
    items.push(match[1]);
  }
  return items;
}

function extractTag(xml, tag) {
  // CDATA対応
  const re = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, "i");
  const m = xml.match(re);
  return m ? m[1].trim() : "";
}

function extractLink(xml) {
  // <link href="..."> (Atom) or <link>...</link> (RSS)
  const atomLink = xml.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?\s*>/i);
  if (atomLink) return atomLink[1];
  return extractTag(xml, "link");
}

function extractDate(xml) {
  // pubDate (RSS) or dc:date (RSS 1.0) or updated/published (Atom)
  return extractTag(xml, "pubDate")
    || extractTag(xml, "dc:date")
    || extractTag(xml, "updated")
    || extractTag(xml, "published")
    || extractTag(xml, "date");
}

function stripHTML(html) {
  return html
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")   // エンティティ→HTMLに戻す
    .replace(/<[^>]*>/g, "")                         // HTMLタグ除去
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, " ").trim();
}

function formatDate(dateStr) {
  if (!dateStr) return new Date().toISOString().split("T")[0];
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr.substring(0, 10);
    return d.toISOString().split("T")[0];
  } catch {
    return dateStr.substring(0, 10);
  }
}

// ===== フィード取得 =====
async function fetchFeed(feedConfig) {
  const { url, source, lang, category } = feedConfig;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "SecureDaily-Bot/1.0" },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.error(`  ✗ ${source}: HTTP ${res.status}`);
      return [];
    }

    const text = await res.text();
    const items = parseXML(text);

    return items.slice(0, 10).map(item => ({
      title: stripHTML(extractTag(item, "title")),
      url: extractLink(item),
      summary: stripHTML(extractTag(item, "description") || extractTag(item, "summary") || extractTag(item, "content")).substring(0, 200),
      date: formatDate(extractDate(item)),
      source,
      language: lang === "ja" ? "日本語" : "英語",
      category,
    })).filter(a => a.title && a.url);
  } catch (e) {
    console.error(`  ✗ ${source}: ${e.message}`);
    return [];
  }
}

// ===== メイン =====
async function main() {
  console.log("セキュリティRSSフィード取得を開始...\n");

  const results = await Promise.allSettled(FEEDS.map(f => {
    console.log(`  取得中: ${f.source}`);
    return fetchFeed(f);
  }));

  let allArticles = [];
  results.forEach((r, i) => {
    if (r.status === "fulfilled" && r.value.length > 0) {
      console.log(`  ✓ ${FEEDS[i].source}: ${r.value.length}件`);
      allArticles.push(...r.value);
    }
  });

  // 日付降順ソート
  allArticles.sort((a, b) => b.date.localeCompare(a.date));

  // 重複除去（URLベース）
  const seen = new Set();
  allArticles = allArticles.filter(a => {
    if (seen.has(a.url)) return false;
    seen.add(a.url);
    return true;
  });

  // 既存のNotionデータとマージ
  let existingArticles = [];
  try {
    const existing = JSON.parse(readFileSync("data/articles.json", "utf-8"));
    existingArticles = existing.articles || [];
  } catch { /* ファイルがなければ空 */ }

  // RSS記事を追加（既存のNotion記事は保持）
  const existingUrls = new Set(existingArticles.map(a => a.url));
  const newFromRSS = allArticles.filter(a => !existingUrls.has(a.url));

  const merged = [...newFromRSS, ...existingArticles].sort((a, b) => b.date.localeCompare(a.date));

  const now = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });

  // security-feeds.json（RSS専用データ）
  writeFileSync("data/security-feeds.json", JSON.stringify({
    feeds: allArticles,
    sources: FEEDS.map(f => ({ name: f.source, lang: f.lang, category: f.category })),
    updated: now,
  }, null, 2));

  // articles.json も更新（マージ済み）
  writeFileSync("data/articles.json", JSON.stringify({
    articles: merged.slice(0, 200), // 最新200件
    updated: now,
  }, null, 2));

  console.log(`\n✓ 完了: RSS ${allArticles.length}件, 既存 ${existingArticles.length}件, マージ後 ${merged.length}件`);
}

main().catch(console.error);
