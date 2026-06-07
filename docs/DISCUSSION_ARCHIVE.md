# 讨论内容留档

> 日期：2026-06-05  
> 参与：palmsugar（用户）+ Claude Code（AI 助手）  
> 主题：palmsugar-lab 日语学习模块升级方向讨论  

---

## 一、项目现状梳理

### 1.1 项目基本信息

- **项目名称**：palmsugar-lab
- **技术栈**：Vue 3 + TypeScript + Vite + Vue Router + Pinia + SCSS
- **项目类型**：个人学习站（SPA）
- **部署方式**：静态网站（手动构建上传）
- **现有内容**：博客、日语学习、EJU、食谱、前端技巧展示、小工具

### 1.2 日语学习板块现状

| 模块 | 文件 | 现状 |
|------|------|------|
| 日语主页 | `src/views/Japanese.vue` | 两个红色文字链接 + 文章列表 |
| 单词卡 | `src/views/word(demo).vue` | 12 个 demo 单词，翻卡 + 认识/不认识，无复习算法 |
| 练习题 | `src/views/Exercise.vue` | 30 道语法选择题，翻卡展示答案，有错题列表（不持久化） |
| 数据 | `src/content/japanese/` | 少量 markdown + JSON，静态加载 |

### 1.3 现有技术亮点

- 使用 `import.meta.glob` 加载本地 Markdown/JSON 作为内容源
- 3D 翻卡动画交互（CSS `transform-style: preserve-3d`）
- 玻璃拟态 UI 风格（`backdrop-filter: blur()`）
- Google AdSense 已接入

---

## 二、需求讨论过程

### 第一轮：确定优先方向

**问题**：你目前最想优先推进哪个方向？

**用户选择**：开发新功能/工具

**结论**：优先做功能开发，而非内容填充或技术基建。

---

### 第二轮：日语学习板块细化

**问题**：日语学习板块是你想重点发展的吗？如果是，你希望往哪个方向发展？

**用户选择**：
- ✅ 扩充单词卡系统
- ✅ 扩充练习题库
- ❌ 学习进度追踪（未选）
- ❌ 暂不重点发展（未选）

**结论**：日语学习是核心重点，单词卡和练习题库都需要升级。

---

### 第三轮：小工具板块

**问题**：对于小工具（Tools）板块，你有没有特别想做的工具想法？

**用户选择**：暂时没有具体想法

**结论**：小工具板块本次迭代暂不处理。

---

### 第四轮：单词卡交互方式

**问题**：单词卡的复习交互，你喜欢哪种风格？

**用户选择**：翻卡式（现有风格）

**结论**：保留现有的 3D 翻卡动画，不做 Anki 式的直显风格。

---

### 第五轮：数据准备

**问题**：关于日语单词和题目的初始数据，你的偏好是？

**用户选择**：示例数据即可，后续自己补

**结论**：先搭建功能框架，准备少量示例数据用于演示，数据模板供用户后续补充。

---

### 第六轮：小工具倾向

**问题**：如果阶段 4 只做一个小工具，你倾向哪个？

**用户选择**：暂不做小工具

**结论**：集中精力在日语学习功能，小工具延后。

---

### 第七轮：App 端技术方案

**问题**：对于 App 端，你倾向哪种技术方案？

**用户选择**：uni-app（多端覆盖）

**背景说明**：用户计划将来把日语学习模块剥离为独立系统，做成网页端 + App 端。

**分析**：
- uni-app 支持 Vue 3 + `<script setup>`，现有代码大部分可复用
- 主要迁移成本在：路由（vue-router → pages.json）、存储（localStorage → uni.storage）、部分 CSS
- 如果提前封装平台相关 API，迁移成本可控制在 15% 以内

---

### 第八轮：数据同步

**问题**：关于网页端和 App 端的数据互通（学习进度同步），你的想法是？

**用户选择**：后续再考虑

**结论**：本次迭代不做数据同步，先使用 localStorage。

---

### 第九轮：现在是否做准备

**问题**：对于"现在是否就为将来的剥离做准备"，你的态度是？

**用户选择**：先做出来再说

**结论**：
- 不为了 uni-app 而改变现有开发方式
- 但顺手做好存储层封装（`src/utils/storage.ts`），将来只需替换内部实现
- 避免直接 DOM 操作，保持 Vue 的声明式风格

---

## 三、最终方案确认

### 3.1 核心功能

| 优先级 | 功能 | 说明 |
|--------|------|------|
| P0 | 单词卡 SRS 系统 | 简化版 SM-2 算法，认识/模糊/不认识三档，localStorage 持久化 |
| P1 | 练习题库升级 | 支持语法选择 + 翻译题，级别筛选，错题本 |
| P2 | 学习仪表盘主页 | 今日概览 + 快捷入口 + 学习动态 |
| P3 | 示例数据 + 模板 | 每级别 5~10 个单词/题目，数据格式说明文档 |

### 3.2 技术决策

| 决策项 | 选择 | 理由 |
|--------|------|------|
| 复习算法 | 简化版 SM-2 | 经典可靠，实现简单 |
| 数据持久化 | localStorage | 纯前端，无需后端 |
| 存储封装 | `src/utils/storage.ts` | 为 uni-app 迁移做准备 |
| 图表库 | 本次不加 | 保持轻量，后续迭代再加 |
| App 方案 | uni-app（将来） | 多端覆盖，Vue 3 兼容 |

### 3.3 风格决策

| 决策项 | 选择 |
|--------|------|
| UI 风格 | 延续玻璃拟态 |
| 交互风格 | 保留 3D 翻卡 |
| 字体 | 继续使用 SmileySans |
| 主色调 | 延续现有绿色系 |

---

## 四、风险与注意事项

1. **数据量问题**：如果将来单词数据量很大（如 N5 就有 800+ 单词），`import.meta.glob` 构建时全量加载可能导致 bundle 过大。后续可能需要改为懒加载或分块加载。

2. **localStorage 容量**：localStorage 通常有 5MB 限制。如果学习数据（进度 + 错题）超过此限制，需要考虑 IndexedDB 或数据压缩。

3. **SRS 算法调参**：简化版 SM-2 的默认参数（初始 EF=2.5，quality 映射）可能需要根据实际使用反馈调整。

4. **uni-app 兼容性**：虽然 uni-app 支持 Vue 3，但某些 CSS 特性（如复杂选择器、部分 backdrop-filter）在小程序端可能有限制。如果将来要覆盖小程序，可能需要降级部分视觉效果。

---

## 五、实施过程记录

### 5.1 实施日期

- **开始**：2026-06-05
- **完成**：2026-06-05
- **实施者**：Claude Code

### 5.2 实施内容

#### 基础层（新创建）

| 文件 | 说明 |
|------|------|
| `src/types/japanese.ts` | 统一类型定义（Word、Exercise、WordProgress、ExerciseSession 等） |
| `src/utils/storage.ts` | 存储封装层，提供 get/set/remove 接口，内部使用 localStorage |
| `src/composables/useSRS.ts` | **简化版 SM-2 算法**实现，含今日复习队列、学习状态、统计 API |
| `src/composables/useExerciseProgress.ts` | 练习进度管理，含错题本（Set 存储）、练习历史 |
| `src/api/vocabulary.ts` | 单词数据加载器，使用 `import.meta.glob` 加载各级别 JSON |
| `src/api/exercise.ts` | 练习题数据加载器，支持按级别/题型筛选、随机抽取 |

#### 示例数据（新创建）

| 文件 | 内容 |
|------|------|
| `src/content/japanese/words/N5.json` | 10 个 N5 示例单词 |
| `src/content/japanese/words/N4.json` | 5 个 N4 示例单词 |
| `src/content/japanese/words/N3.json` | 2 个 N3 示例单词 |
| `src/content/japanese/words/N2.json` | 2 个 N2 示例单词 |
| `src/content/japanese/words/N1.json` | 2 个 N1 示例单词 |
| `src/content/japanese/exercise/exercises.json` | 10 道示例练习题（语法选择 + 翻译） |

#### 页面重构

| 文件 | 功能 |
|------|------|
| `src/views/Vocabulary.vue` | 📝 **单词卡 SRS 系统** — Dashboard / 今日复习 / 单词浏览 / 统计 |
| `src/views/Exercise.vue` | ✏️ **练习题库** — 设置页 / 答题 / 结果 / 错题本 |
| `src/views/Japanese.vue` | 📊 **学习仪表盘** — 今日概览 / 快捷入口 / 最近动态 |

#### 其他更新

| 文件 | 说明 |
|------|------|
| `src/router/index.ts` | `/word` 路由指向新的 `Vocabulary.vue` |
| `docs/PRD.md` | 产品需求文档 |
| `docs/DISCUSSION_ARCHIVE.md` | 讨论留档 |
| `AGENTS.md` | 项目开发规范 |
| `README.md` | 重写后的项目说明 |
| `src/content/japanese/DATA_TEMPLATE.md` | 数据格式模板 |

### 5.3 技术实现要点

1. **SRS 算法（简化版 SM-2）**：
   - 初始 EF = 2.5，最小 EF = 1.3
   - 用户三档反馈映射：认识=5，模糊=3，不认识=0
   - 新词首次复习间隔 1 天，第二次 6 天，之后按 EF 计算
   - 学习状态持久化到 localStorage（key: `palmsugar-lab:srs-progress`）

2. **存储层封装**：
   - 所有 localStorage 操作通过 `storage.ts`，key 带 `palmsugar-lab:` 前缀
   - 为将来 uni-app 迁移预留，只需替换内部实现

3. **数据加载**：
   - 使用 `import.meta.glob` 在构建时加载 JSON，运行时无网络请求
   - 单词按级别分文件存放，便于后续扩展

### 5.4 遇到的问题与解决方案

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| `vue-tsc` 命令未找到 | node_modules 缺失 | 运行 `npm install` 安装依赖 |
| Exercise.vue 模板语法错误 | 多个 `<button>` 和 `<div>` 标签的 `>` 符号被错误地换行到下一行 | 检查并修复所有标签闭合位置，确保 `>` 紧跟属性列表 |
| `exerciseList.value.length` 类型错误 | 在 `<script setup>` 中需要 `.value`，但在模板中 Vue 自动解包 ref | 在模板中使用 `exerciseList.length`，在 script 中使用 `exerciseList.value.length` |
| `getExerciseById` 导入错误 | 该函数在 `api/exercise.ts` 中，但代码从 `useExerciseProgress` 导入 | 修正导入路径 |
| 未使用变量/类型报错 | TypeScript `noUnusedLocals` 严格检查 | 移除未使用的 import（如 `computed`、`getAllExercises`、`ExerciseRecord` 等） |

### 5.5 构建验证

```bash
npm run build
# ✅ vue-tsc 类型检查通过
# ✅ Vite 构建成功，生成 dist/ 目录
```

### 5.6 后续建议

1. **补充数据**：按 `DATA_TEMPLATE.md` 格式添加更多单词和练习题
2. **算法调参**：根据实际使用反馈调整 SM-2 的初始 EF、quality 映射等参数
3. **图表增强**：统计页可接入 ECharts 展示掌握率趋势图、学习热力图
4. **uni-app 迁移**：替换 `src/utils/storage.ts` 内部实现为 `uni.getStorageSync` / `uni.setStorageSync`

---

## 六、后续行动（更新）

1. ✅ 完成 PRD 文档
2. ✅ 完成讨论留档
3. ✅ 重写 README.md
4. ✅ 编写 AGENTS.md（项目规范）
5. ✅ 完成编码实施
6. ✅ 构建验证通过
7. ⬜ 用户测试反馈
8. ⬜ 根据反馈调整优化

---

*本文件用于记录讨论过程和实施结果，方便后续回顾和团队成员（或未来的自己）理解决策背景。*
