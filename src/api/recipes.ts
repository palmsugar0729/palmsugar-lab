export interface ArticleMeta {
    id: string
    title: string
    date: string
    description: string
    tags?: string[]
  }
  
  // 读取 markdown（仅 meta）
  export const getArticleList = async (): Promise<ArticleMeta[]> => {
    const modules = import.meta.glob('../content/recipe/*.md', {
      eager: true,
      query: '?raw',
      import: 'default'
      })
  
    const list: ArticleMeta[] = []
  
    for (const path in modules) {
        const content = modules[path] as string
  
        list.push({
            id: path.split('/').pop()?.replace('.md', '') || '',
            title: '测试标题',
            date: '2026-01-01',
            description: content.slice(0, 50)
        })
    }
  
    // 按时间排序
    return list.sort((a, b) => +new Date(b.date) - +new Date(a.date))
  }
  