# AGENTS.md — 项目开发规范

> 本文件定义 `palmsugar-lab` 项目的开发规范，所有开发者（包括 AI 助手）在修改代码前应阅读并遵循本规范。

---

## 1. 目录结构规范

### 1.1 根目录

| 目录/文件 | 用途 | 规则 |
|-----------|------|------|
| `docs/` | **项目文档** | 所有文档必须放在此处，禁止散落在根目录或其他位置 |
| `src/` | **源代码** | 所有业务代码必须放在此处 |
| `public/` | **静态公共资源** | 构建时直接复制到 `dist/`，不经过打包处理 |
| `index.html` | HTML 入口 | 包含 AdSense 脚本，修改需谨慎 |
| `package.json` | 依赖管理 | 新增依赖需说明理由 |
| `vite.config.ts` | 构建配置 | 保持简洁，避免复杂配置 |
| `README.md` | 项目说明 | 保持更新 |

### 1.2 src 目录详解

```
src/
├── api/              # 数据加载模块
│   └── 规则：只负责读取本地数据，不做业务逻辑处理
│
├── assets/           # 静态资源
│   └── 规则：图片、字体、SVG 等。引用时使用相对路径 @/assets/...
│
├── components/       # 可复用组件
│   ├── layout/       # 布局组件（Header、Footer）
│   └── 规则：纯展示组件，不直接调用数据加载逻辑
│
├── composables/      # 组合式函数
│   └── 规则：封装可复用的业务逻辑（如 SRS 算法、存储操作），不依赖具体页面
│
├── content/          # 内容数据（Markdown + JSON）
│   ├── blog/         # 博客文章
│   ├── eju/          # EJU 资料
│   ├── japanese/     # 日语学习资料
│   │   ├── words/    # 单词数据（按级别分文件）
│   │   └── exercise/ # 练习题数据
│   ├── recipe/       # 食谱
│   └── tool/         # 工具配置
│
├── router/           # 路由配置
│   └── 规则：只定义路由映射，不做业务逻辑
│
├── styles/           # 全局样式
│   ├── global.scss   # 全局工具类
│   ├── reset.scss    # 样式重置
│   └── theme.scss    # 主题变量
│
├── types/            # TypeScript 类型定义
│   └── 规则：所有共享类型必须定义在此处，禁止在组件内定义共享类型
│
├── utils/            # 工具函数
│   └── 规则：纯函数，不依赖 Vue 运行时。如 storage.ts、formatDate.ts 等
│
├── views/            # 页面级组件
│   ├── tools/        # 工具页面
│   ├── front/        # 前端技巧展示
│   └── 规则：页面组件可以调用 api、composables，组织子组件
│
├── App.vue           # 根组件（Header + router-view + Footer）
└── main.ts           # 入口文件
```

---

## 2. 代码开发规范

### 2.1 基本原则

1. **代码区不引用外部文件**
   - 禁止在组件中直接 `import` `src/content/` 以外的外部数据文件
   - 数据加载必须通过 `api/` 模块，禁止在视图组件中直接 `import.meta.glob`
   - 例外：`src/content/` 下的静态数据文件属于项目内部资源

2. **所有文档放 `docs/`**
   - PRD、设计文档、讨论留档、API 文档等全部放在 `docs/`
   - 禁止在根目录或其他位置创建 `.md` 文档文件

3. **平台相关 API 必须封装**
   - 所有 `localStorage` 操作必须通过 `src/utils/storage.ts`
   - 所有页面跳转优先使用 `vue-router`，如需直接操作 location 需封装
   - 为将来 uni-app 迁移做准备

### 2.2 Vue 组件规范

#### 文件结构

```vue
<template>
  <!-- 模板 -->
</template>

<script setup lang="ts">
  // 1. 类型导入
  // 2. Vue 核心导入
  // 3. 第三方库导入
  // 4. 项目内部导入（按层级：types -> utils -> api -> composables -> components）
  // 5. 逻辑代码
</script>

<style scoped lang="scss">
  // 样式
</style>
```

#### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `ArticleCard.vue`、`Vocabulary.vue` |
| 组合式函数 | camelCase，前缀 `use` | `useSRS.ts`、`useExerciseProgress.ts` |
| 工具函数 | camelCase | `storage.ts`、`formatDate.ts` |
| 类型文件 | PascalCase | `japanese.ts`（存放多个类型） |
| 常量 | SCREAMING_SNAKE_CASE | `MAX_NEW_WORDS_PER_DAY` |

#### 组件设计原则

- **单一职责**：一个组件只做一件事
- **props 向下传递**：数据通过 props 传入，事件通过 emits 传出
- **避免直接修改 props**：如需修改，使用本地 ref 或 computed
- **样式 scoped**：组件样式默认使用 `scoped`，全局样式放 `styles/`

### 2.3 TypeScript 规范

- **启用严格模式**：项目已配置 `strict: true`，不允许关闭
- **禁止 `any`**：尽量使用具体类型，必要时使用 `unknown`
- **接口命名**：PascalCase，前缀 `I` 可选（项目内保持一致即可）
- **类型导出**：共享类型必须从 `types/` 目录导出

### 2.4 样式规范

- **使用 SCSS**：所有组件样式使用 `lang="scss"`
- **变量复用**：颜色、间距等使用 `styles/theme.scss` 中定义的变量
- **BEM 可选**：项目规模不大，可使用简单的类名命名，保持可读性即可
- **禁止行内样式**：除非动态计算的值，否则样式应写在 `<style>` 中

### 2.5 数据规范

#### 内容数据（Markdown / JSON）

- 存放于 `src/content/` 下对应目录
- JSON 数据文件使用 2 空格缩进
- Markdown 文件使用 YAML frontmatter 存储元数据

#### 示例 JSON 格式

```json
{
  "id": "n5-001",
  "word": "間",
  "reading": "あいだ",
  "meaning": "期间",
  "type": "N",
  "accent": "◎",
  "level": "N5",
  "example": "この間どこへ行きましたか。",
  "exampleTranslation": "前几天你去了哪里？"
}
```

---

## 3. 业务逻辑规范

### 3.1 SRS 算法（useSRS.ts）

- 实现简化版 SM-2 算法
- 用户反馈映射：认识=5，模糊=3，不认识=0
- 所有存储操作通过 `storage.ts`，禁止直接调用 `localStorage`
- 提供清晰的 API：`getTodayReviews()`、`getNewWords(count)`、`getStats()`

### 3.2 练习进度（useExerciseProgress.ts）

- 错题本存储错题 ID 列表
- 练习历史记录包含：日期、正确率、用时
- 同样通过 `storage.ts` 读写

### 3.3 数据加载（api/）

- `vocabulary.ts`：加载单词数据，按级别分组
- `exercise.ts`：加载练习题数据，支持级别和题型筛选
- 使用 `import.meta.glob` 在构建时加载，运行时无网络请求

---

## 4. Git 提交规范

### 提交信息格式

```
<type>(<scope>): <subject>

<body>（可选）
```

### Type 说明

| Type | 含义 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修复 bug |
| `docs` | 文档更新 |
| `style` | 代码格式（不影响功能） |
| `refactor` | 重构 |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `chore` | 构建/工具链/依赖更新 |

### 示例

```
feat(vocabulary): 添加单词卡 SRS 复习算法

- 实现简化版 SM-2 算法
- 添加认识/模糊/不认识三档反馈
- 学习进度持久化到 localStorage

fix(exercise): 修复翻卡动画在 Safari 下的兼容性问题
docs: 更新 README.md 项目结构说明
```

---

## 5. 文档规范

### 5.1 文档存放位置

| 文档类型 | 存放位置 |
|----------|----------|
| 产品需求文档 | `docs/PRD.md` |
| 讨论留档 | `docs/DISCUSSION_ARCHIVE.md` |
| 数据格式模板 | `src/content/japanese/DATA_TEMPLATE.md` |
| 项目规范 | `AGENTS.md`（本文件） |
| 项目说明 | `README.md` |

### 5.2 代码注释规范

- **复杂算法**：必须添加注释说明逻辑
- **公共函数**：使用 JSDoc 格式注释参数和返回值
- **魔法数字**：必须说明含义，或使用常量替代

```typescript
/**
 * 计算下次复习日期
 * @param quality 用户反馈质量（0-5）
 * @param progress 当前学习进度
 * @returns 更新后的学习进度
 */
function calculateNextReview(quality: number, progress: WordProgress): WordProgress {
  // EF 最小值为 1.3，防止间隔过小
  const MIN_EF = 1.3;
  // ...
}
```

---

## 6. 性能规范

- **图片优化**：使用 WebP 格式，必要时提供 fallback
- **代码分割**：路由组件使用懒加载（`() => import(...)`）
- **避免大 JSON 全量加载**：单词数据量大时，考虑按级别分文件，按需加载
- **节流/防抖**：搜索输入、滚动事件等使用节流或防抖

---

## 7. 兼容性规范

### 7.1 浏览器兼容

- 现代浏览器（Chrome、Firefox、Safari、Edge 最新两个版本）
- CSS 特性使用前检查 caniuse 兼容性

### 7.2 uni-app 迁移准备

为将来迁移到 uni-app 打包 App，现在需遵循：

1. **存储封装**：所有持久化操作通过 `src/utils/storage.ts`
2. **避免 DOM 操作**：使用 Vue ref 和模板绑定
3. **避免浏览器专属 API**：如 `window.alert`、`document.cookie` 等
4. **CSS 限制**：不使用小程序不支持的复杂选择器

---

## 8. 检查清单（Checklist）

在提交代码前，确认以下事项：

- [ ] 代码通过 `npm run build` 无 TypeScript 错误
- [ ] 新增文件遵循目录结构规范
- [ ] 新增文档放在 `docs/` 目录
- [ ] 无直接 `localStorage` 调用（通过 `storage.ts`）
- [ ] 组件样式使用 `scoped`
- [ ] 共享类型定义在 `types/` 目录
- [ ] 提交信息符合规范

---

*本规范随项目发展持续更新。如有疑问，优先参考现有代码的风格和模式。*
