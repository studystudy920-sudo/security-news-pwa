// セキュリティ記事をNotionから取得するAPI
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function GET() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_ARTICLES_DB,
      sorts: [{ property: "収集日", direction: "descending" }],
      page_size: 50,
    });

    const articles = response.results.map((page) => {
      const props = page.properties;
      return {
        id: page.id,
        title: props["記事タイトル"]?.title?.[0]?.plain_text || "無題",
        url: props["記事URL"]?.url || "",
        source: props["ソースサイト"]?.select?.name || "",
        language: props["言語"]?.select?.name || "",
        summary: props["概要"]?.rich_text?.[0]?.plain_text || "",
        date: props["収集日"]?.date?.start || "",
      };
    });

    return Response.json({ articles });
  } catch (error) {
    console.error("Notion API error:", error);
    return Response.json({ error: "記事の取得に失敗しました" }, { status: 500 });
  }
}
