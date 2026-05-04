export interface ArticleMeta {
  id: string;
  title: string;
  date: string;
  description: string;
  tags?: string[];
}

// 读取 markdown（仅 meta）
export const getArticleList = async (): Promise<ArticleMeta[]> => {
  const modules = import.meta.glob("../content/japanese/*.md", {
    eager: true,
    query: "?raw",
    import: "default",
  });

  const list: ArticleMeta[] = [];

  for (const path in modules) {
    const content = modules[path] as string;

    const match = content.match(/---([\s\S]*?)---/);

    let title = "";
    let date = "";
    let body = content;

    if (match) {
      const meta = match[1];

      const titleMatch = meta.match(/title:\s*(.*)/);
      const dateMatch = meta.match(/date:\s*(.*)/);

      title = titleMatch ? titleMatch[1] : "";
      date = dateMatch ? dateMatch[1] : "";

      body = content.replace(match[0], "");
    }

    list.push({
      id: path.split("/").pop()?.replace(".md", "") || "",
      title,
      date,
      description: body.slice(0, 50),
    });
  }

  // 按时间排序
  return list.sort((a, b) => +new Date(b.date) - +new Date(a.date));
};
