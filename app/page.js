"use client";
import { useState, useEffect } from "react";

// ===== SVGアイコン =====
const Icons = {
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  article: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  ),
  video: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  external: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14}}>
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
    </svg>
  ),
};

// ===== メインアプリ =====
export default function App() {
  const [tab, setTab] = useState("articles");
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  // データ読み込み
  useEffect(() => {
    loadData(tab);
  }, [tab]);

  async function loadData(currentTab) {
    setLoading(true);
    setError(null);
    try {
      const endpoint = `/api/${currentTab === "articles" ? "articles" : currentTab === "videos" ? "videos" : "sites"}`;
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("データの取得に失敗しました");
      const data = await res.json();

      if (currentTab === "articles") setArticles(data.articles || []);
      else if (currentTab === "videos") setVideos(data.videos || []);
      else setSites(data.sites || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  // フィルター適用
  function getFiltered(items) {
    if (filter === "all") return items;
    if (filter === "ja") return items.filter((i) => i.language === "日本語");
    if (filter === "en") return items.filter((i) => i.language === "英語");
    return items;
  }

  return (
    <div className="app">
      {/* ヘッダー */}
      <header className="header">
        <h1>{Icons.shield} セキュリティニュース</h1>
        <p className="subtitle">最新のセキュリティ情報をまとめてチェック</p>
      </header>

      {/* メインコンテンツ */}
      <main className="content">
        {/* 言語フィルター（記事・動画タブ） */}
        {(tab === "articles" || tab === "videos") && (
          <div className="filters">
            {[
              ["all", "すべて"],
              ["ja", "日本語"],
              ["en", "英語"],
            ].map(([key, label]) => (
              <button
                key={key}
                className={`filter-btn ${filter === key ? "active" : ""}`}
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* ローディング */}
        {loading && (
          <div className="loading">
            <div className="spinner" />
          </div>
        )}

        {/* エラー */}
        {error && <p className="error-msg">{error}</p>}

        {/* 記事一覧 */}
        {!loading && !error && tab === "articles" && (
          <>
            <p className="count">{getFiltered(articles).length}件の記事</p>
            {getFiltered(articles).map((a) => (
              <a
                key={a.id}
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="card">
                  <div className="card-title">
                    {a.title} {Icons.external}
                  </div>
                  <div className="card-meta">
                    <span className="badge badge-source">{a.source}</span>
                    <span className={`badge badge-lang-${a.language === "日本語" ? "ja" : "en"}`}>
                      {a.language}
                    </span>
                    <span className="badge badge-date">{a.date}</span>
                  </div>
                  <div className="card-summary">{a.summary}</div>
                </div>
              </a>
            ))}
          </>
        )}

        {/* 動画一覧 */}
        {!loading && !error && tab === "videos" && (
          <>
            <p className="count">{getFiltered(videos).length}件の動画</p>
            {getFiltered(videos).map((v) => (
              <a
                key={v.id}
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="card">
                  <div className="card-title">
                    {v.title} {Icons.external}
                  </div>
                  <div className="card-meta">
                    <span className="badge badge-category">{v.category}</span>
                    <span className="badge badge-platform">{v.platform}</span>
                    <span className={`badge badge-lang-${v.language === "日本語" ? "ja" : "en"}`}>
                      {v.language}
                    </span>
                    <span className="badge badge-date">{v.date}</span>
                  </div>
                  <div className="card-summary">
                    {v.channel && `📺 ${v.channel}`}
                    {v.channel && v.summary && " — "}
                    {v.summary}
                  </div>
                </div>
              </a>
            ))}
          </>
        )}

        {/* サイト管理 */}
        {!loading && !error && tab === "sites" && (
          <>
            <p className="count">{sites.length}件の監視サイト</p>
            {sites.map((s) => (
              <div key={s.id} className="site-card">
                <div className="site-info">
                  <div className="site-name">{s.name}</div>
                  <div className="site-url">{s.url}</div>
                  <div className="card-meta" style={{ marginTop: 4 }}>
                    <span className={`badge badge-lang-${s.category === "日本語" ? "ja" : "en"}`}>
                      {s.category}
                    </span>
                  </div>
                </div>
                <button
                  className={`site-toggle ${s.enabled ? "on" : ""}`}
                  aria-label={s.enabled ? "無効にする" : "有効にする"}
                />
              </div>
            ))}
            <p style={{ fontSize: "0.75rem", color: "#64748b", textAlign: "center", padding: "12px" }}>
              サイトの追加・削除はNotionアプリから行えます
            </p>
          </>
        )}
      </main>

      {/* 下部タブバー */}
      <nav className="tab-bar">
        {[
          ["articles", Icons.article, "記事"],
          ["videos", Icons.video, "動画"],
          ["sites", Icons.settings, "サイト管理"],
        ].map(([key, icon, label]) => (
          <button
            key={key}
            className={`tab-btn ${tab === key ? "active" : ""}`}
            onClick={() => { setTab(key); setFilter("all"); }}
          >
            {icon}
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
              }
