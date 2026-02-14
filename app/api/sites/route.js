// 監視サイト一覧の取得・管理API
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// サイト一覧を取得
export async function GET() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_SITES_DB,
      sorts: [{ property: "カテゴリ", direction: "ascending" }],
    });

    const sites = response.results.map((page) => {
      const props = page.properties;
      return {
        id: page.id,
        name: props["サイト名"]?.title?.[0]?.plain_text || "無題",
        url: props["URL"]?.url || "",
        category: props["カテゴリ"]?.select?.name || "",
        feedType: props["フィード種別"]?.select?.name || "",
        enabled: props["有効"]?.checkbox || false,
      };
    });

    return Response.json({ sites });
  } catch (error) {
    console.error("Notion API error:", error);
    return Response.json({ error: "サイト一覧の取得に失敗しました" }, { status: 500 });
  }
}
