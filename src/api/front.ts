export interface FrontItem {
    id: string
    title: string
    description: string
    source: 'self' | 'codepen'
    origin?: string
  }
  
  export const frontList: FrontItem[] = [
    {
      id: '001',
      title: '按钮点击动画',
      description: '点击缩放效果',
      source: 'self'
    },
    {
      id: '002',
      title: '卡片翻面',
      description: '点击翻转（伪3D）',
      source: 'self'
    },
    {
      id: '003',
      title: '按钮hover效果',
      description: '不同的hover变色',
      source: 'codepen',
      origin: 'https://codepen.io/giana/pen/BZaGyP'
    },
    {
      id: '004',
      title: '卡片翻面',
      description: '点击翻转',
      source: 'codepen',
      origin: 'https://codepen.io/colebemis/pen/WNKdNj'
    }
  ]