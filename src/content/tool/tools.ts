export interface ToolMeta {
    id: string
    title: string
    description: string
    component: string
    tags?: string[]
  }
  
  export const toolList = [
    {
      id: '001',
      title: '图片格式转换',
      description: '支持 JPG / PNG / WEBP 批量转换',
      component: 'ImageTool'
    }
  ]