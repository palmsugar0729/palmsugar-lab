# palmsugar-lab

> palmsugar 的个人学习站，包含博客、**日语学习**、EJU 学习、美食食谱、前端技巧展示以及常用小工具。

---

## 🌟 最近更新（2026-06-05）

**日语学习模块 v2.0 已上线！**

- 📝 **SRS 单词卡系统** — 基于简化版 SM-2 间隔重复算法，自动安排复习
- ✏️ **练习题库升级** — 支持语法选择题 + 翻译题，按 JLPT 级别筛选，错题本功能
- 📊 **学习仪表盘** — 一目了然的今日学习概览和快捷入口

---

## 🚀 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3（Composition API + `<script setup>`） |
| 语言 | TypeScript（严格模式） |
| 构建工具 | Vite |
| 路由 | Vue Router 4 |
| 状态管理 | Pinia |
| 样式 | SCSS（Sass） |
| 内容 | Markdown + JSON（静态文件驱动） |

---

## 📁 项目结构

```
palmsugar-lab/
├── docs/                       # 项目文档
│   ├── PRD.md                  # 产品需求文档
│   └── DISCUSSION_ARCHIVE.md   # 讨论留档
├── public/                     # 静态公共资源
├── src/
│   ├── api/                    # 数据加载模块（本地数据读取）
│   ├── assets/                 # 静态资源（图片、字体、SVG）
│   ├── components/             # 可复用组件
│   │   └── layout/             # 布局组件（Header、Footer）
│   ├── composables/            # 组合式函数（业务逻辑复用）
│   ├── content/                # 内容数据（Markdown + JSON）
│   │   ├── blog/               # 博客文章
│   │   ├── eju/                # EJU 学习资料
│   │   ├── japanese/           # 日语学习资料
│   │   │   ├── words/          # 单词数据（按 JLPT 级别）
│   │   │   └── exercise/       # 练习题数据
│   │   ├── recipe/             # 食谱
│   │   └── tool/               # 工具配置
│   ├── router/                 # 路由配置
│   ├── styles/                 # 全局样式
│   ├── types/                  # TypeScript 类型定义
│   ├── utils/                  # 工具函数
│   ├── views/                  # 页面级组件
│   │   ├── tools/              # 工具页面
│   │   └── front/              # 前端技巧展示页面
│   ├── App.vue                 # 根组件
│   └── main.ts                 # 入口文件
├── index.html                  # HTML 入口
├── vite.config.ts              # Vite 配置
├── tsconfig.json               # TypeScript 配置
└── package.json                # 依赖和脚本
```

---

## 🛠️ 开发说明

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

---

## 📝 内容管理

本项目采用**静态文件驱动**的内容管理方式：

- **博客/EJU/日语文章**：Markdown 文件，存放于 `src/content/` 下对应目录
- **日语单词**：JSON 文件，按 JLPT 级别存放于 `src/content/japanese/words/`
- **练习题**：JSON 文件，存放于 `src/content/japanese/exercise/`

添加新内容时，只需按格式创建对应的 Markdown 或 JSON 文件即可，无需修改代码。

详细数据格式说明见：`src/content/japanese/DATA_TEMPLATE.md`

---

## 🎨 设计系统

- **视觉风格**：玻璃拟态（Glassmorphism）
- **主色调**：绿色系（`#a3c1ad`）
- **字体**：SmileySans（得意黑）+ 系统字体回退
- **圆角**：卡片 `14px`，按钮 `999px`（胶囊形）

---

## 📦 部署

本项目为静态 SPA，构建后生成 `dist/` 目录，可部署到任何静态托管服务：

- GitHub Pages
- Vercel
- Netlify
- Cloudflare Pages
- 自有服务器（Nginx/Caddy）

```bash
npm run build
# 上传 dist/ 目录到托管服务
```

---

## 📄 文档

| 文档 | 说明 |
|------|------|
| `docs/PRD.md` | 产品需求文档（日语学习模块升级） |
| `docs/DISCUSSION_ARCHIVE.md` | 需求讨论过程留档 |
| `AGENTS.md` | 项目开发规范 |

---

## 🗺️ 未来规划

- [ ] 补充更多 JLPT 单词和练习题数据
- [ ] 添加学习统计图表（ECharts 掌握率趋势、热力图）
- [ ] uni-app 迁移（将日语学习模块剥离为独立 App）
- [ ] 后端服务 + 跨设备数据同步
- [ ] 语音播放（TTS）

---

## ⚠️ 声明

本站为个人学习站，内部内容仅供学习参考，请勿用于商业用途！

---

*Powered by Vue 3 + Vite + ❤️*
