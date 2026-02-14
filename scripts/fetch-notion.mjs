import { Client } from "@notionhq/client";
import { writeFileSync, mkdirSync } from "fs";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
mkdirSync("data", { recursive: true });

async function fetchArticles() {
  const dbId = process.env.NOTION_ARTICLES_DB;
  const res = await notion.databases.query({ database_id: dbId, sorts: [{ property: "収集日", direction: "descending" }], page_size: 50 });
  return res.results.map(p => ({
    title: p.properties["記事タイトル"]?.title?.[0]?.plain_text || "",
    url: p.properties["記事URL"]?.url || "",
    source: p.properties["ソースサイト"]?.select?.name || "",
    language: p.properties["言語"]?.select?.name || "",
    summary: p.properties["概要"]?.rich_text?.[0]?.plain_text || "",
    date: p.properties["収集日"]?.date?.start || ""
  }));
}

async function fetchVideos() {
  const dbId = process.env.NOTION_VIDEOS_DB;
  const res = await notion.databases.query({ database_id: dbId, sorts: [{ property: "収集日", direction: "descending" }], page_size: 50 });
  return res.results.map(p => ({
    title: p.properties["動画タイトル"]?.title?.[0]?.plain_text || "",
    url: p.properties["動画URL"]?.url || "",
    channel: p.properties["チャンネル名"]?.rich_text?.[0]?.plain_text || "",
    category: p.properties["カテゴリ"]?.select?.name || "",
    language: p.properties["言語"]?.select?.name || "",
    platform: p.properties["プラットフォーム"]?.select?.name || "",
    summary: p.properties["概要"]?.rich_text?.[0]?.plain_text || "",
    date: p.properties["収集日"]?.date?.start || ""
  }));
}

async function fetchSites() {
  const dbId = process.env.NOTION_SITES_DB;
  const res = await notion.databases.query({ database_id: dbId, page_size: 100 });
  return res.results.map(p => ({
    name: p.properties["サイト名"]?.title?.[0]?.plain_text || "",
    url: p.properties["URL"]?.url || "",
    category: p.properties["カテゴリ"]?.select?.name || "",
    feed: p.properties["フィード種別"]?.select?.name || "",
    enabled: p.properties["有効"]?.checkbox ?? true
  }));
}

const articles = await fetchArticles();
const videos = await fetchVideos();
const sites = await fetchSites();
const now = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });

writeFileSync("data/articles.json", JSON.stringify({ articles, updated: now }, null, 2));
writeFileSync("data/videos.json", JSON.stringify({ videos }, null, 2));
writeFileSync("data/sites.json", JSON.stringify({ sites }, null, 2));
console.log("Done:", articles.length, "articles,", videos.length, "videos,", sites.length, "sites");
