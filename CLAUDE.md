# プロジェクト指針

## Claude Design ⇄ Claude Code 循環ワークフロー

このリポジトリは **Claude Design と Claude Code の双方向連携の起点**として使う。
デザイン制作とコード実装を1本のループにつなげる。

### 標準フロー（6ステップ）

| # | 場所 | 作業 |
|---|------|------|
| 1 | Claude Code（このセッション） | 設計ドキュメント・ルール（`CLAUDE.md`、スタイルガイド等）を書く |
| 2 | GitHub | コミット → push（ブランチ運用） |
| 3 | Claude Design | `Import → GitHub` でこのリポジトリを選択 |
| 4 | Claude Design | 既存ルールを踏まえてデザイン作成（例：新モジュール、新画面、新コンポーネント） |
| 5 | Claude Design | `Export → Send to Claude Code Web` でハンドオフバンドルを送信 |
| 6 | Claude Code（このセッション） | バンドルを取り込んで実装（差分のみ反映が原則） |

### 適用できる用途（CAMS資料に限らず）

- **CAMS試験対策スライド**（既存パターン：`public/cams/cams-1-4/` 参照）
  - 他モジュール（1-5, 2-1 等）の追加にも同じ流れが使える
- **ランディングページ／マーケサイト**：LP草案 → デザイン → 実装
- **ダッシュボード／管理画面**：UI仕様 → モックアップ → React/Next.js実装
- **学習用Webアプリ**：要件定義 → インタラクティブプロトタイプ → 実装
- **ドキュメントサイト**：構成案 → ビジュアル化 → 静的サイト化
- **新機能のUI設計**：既存コードベースのスタイル踏襲 → 差分実装

### ハンドオフバンドルの読み方（重要）

Claude Design から届くバンドルには必ず以下が含まれる：
- `README.md` — コーディングエージェント向けの実装指示（**最初に必ず読む**）
- `chats/*.md` — ユーザーとデザインAIの会話履歴（**意図はここに**）
- `project/CLAUDE.md` — プロジェクト固有のデザイン指針
- `project/*.html/css/js` — 実装すべき成果物
- `project/uploads/` — 元素材（PPTX、画像など）
- `project/screenshots/` — デザイン作業中のスクショ

**鉄則**：HTMLだけ見て実装しない。READMEとチャット履歴を読んで「ユーザーが本当に欲しかったもの」を理解してから実装する。

### 実装方針の判断軸

| デザインの性質 | 実装方法 |
|----------------|---------|
| 完成済みプロトタイプ（自己完結HTML/CSS/JS） | `public/` 配下に**静的アセットとして配置**（ピクセルパーフェクト維持） |
| Reactコンポーネント化が自然なUI | `app/` 配下に**React/Next.jsで再構築**（既存スタイル踏襲） |
| 単一ページ・ランディング | `app/[route]/page.js` で**Next.jsページ化** |

判断に迷ったら、バンドル内の README の「Match the visual output; don't copy the prototype's internal structure unless it happens to fit」に従う。

### 既存の実装例

- `public/cams/cams-1-4/` — CAMS 1-4 シェル・無記名株式（20スライドHTMLデッキ、静的配置）
  - 元バンドル：Claude Design からの完成済みプロトタイプ
  - 配置理由：自己完結・外部依存なし・ピクセルパーフェクト維持優先

---

## このリポジトリについて

Next.js 14 ベースの PWA（security-news-pwa）。
- `app/` — Next.js App Router
- `public/` — 静的アセット（Claude Design ハンドオフの配置先として活用）
- `scripts/` — データ更新スクリプト
- `data/` — ニュースデータ
