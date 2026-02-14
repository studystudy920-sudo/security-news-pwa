// セキュリティ動画をNotionから取得するAPI
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function GET() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_VIDEOS_DB,
      sorts: [{ property: "収集日", direction: "descending" }],
      page_size: 50,
    });

    const videos = response.results.map((page) => {
      const props = page.properties;
      return {
        id: page.id,
        title: props["動画タイトル"]?.title?.[0]?.plain_text || "無題",
        url: props["動画URL"]?.url || "",
        channel: props["チャンネル名"]?.rich_text?.[0]?.plain_text || "",
        category: props["カテゴリ"]?.select?.name || "",
        language: props["言語"]?.select?.name || "",
        platform: props["プラットフォーム"]?.select?.name || "",
        summary: props["概要"]?.rich_text?.[0]?.plain_text || "",
        date: props["収集日"]?.date?.start || "",
      };
    });

    return Response.json({ videos });
  } catch (error) {
    console.error("Notion API error:", error);
    return Response.json({ error: "動画の取得に失敗しました" }, { status: 500 });
  }
}
