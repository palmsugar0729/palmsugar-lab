# 日语学习模块升级 — 产品需求文档（PRD）

> 项目：palmsugar-lab  
> 模块：日语学习（Japanese Learning Module）  
> 版本：v2.0  
> 日期：2026-06-05  

---

## 1. 项目背景

`palmsugar-lab` 是一个基于 Vue 3 + TypeScript + Vite 的个人学习站。其中的**日语学习板块**目前功能较为基础：

- 单词卡仅有 12 个 demo 数据，无复习算法
- 练习题仅 30 道语法选择题，无级别筛选、无错题本
- 日语主页仅为两个文字链接，缺乏学习概览

本次升级旨在将日语学习模块打造为一个**功能完整、有记忆系统支撑的学习工具**。

---

## 2. 目标与范围

### 2.1 核心目标

1. **带 SRS 复习算法的单词卡系统** — 类似 Anki 的间隔重复，自动安排复习
2. **支持多题型的练习题库** — 语法选择题 + 翻译题，支持级别筛选和错题本
3. **学习仪表盘主页** — 一目了然的今日学习概览和快捷入口

### 2.2 范围边界

**包含在本迭代中：**
- 单词卡 SRS 系统（Dashboard、今日复习、单词浏览、统计）
- 练习题库升级（语法选择 + 翻译题、错题本、级别筛选）
- 日语学习主页重构（仪表盘）
- 示例数据（每级别 5~10 个单词/题目）
- 数据格式模板文档
- uni-app 兼容封装（`storage.ts` 抽象层）

**不包含在本迭代中：**
- 小工具开发
- 大规模真实数据导入
- 后端服务 / 用户登录 / 跨设备同步
- 语音播放 / TTS
- uni-app 实际迁移（只做封装准备）

---

## 3. 用户故事

### 3.1 单词卡系统

- 作为学习者，我想每天复习到期的单词，这样我能高效记忆而不浪费时间在已掌握的单词上
- 作为学习者，我想标记单词为"认识/模糊/不认识"，这样系统能根据我的掌握程度调整复习频率
- 作为学习者，我想浏览所有单词并按 JLPT 级别筛选，这样我能针对性地学习某个级别
- 作为学习者，我想看到我的学习统计（掌握率、连续学习天数），这样我能保持学习动力

### 3.2 练习题库

- 作为学习者，我想按 JLPT 级别选择练习题，这样我能练习适合我水平的题目
- 作为学习者，我想练习不同类型的题目（语法选择、翻译），这样我能全面提升
- 作为学习者，我想重练我曾经做错的题目，这样能针对性补强薄弱环节
- 作为学习者，我想查看练习历史记录，这样能追踪我的进步

### 3.3 学习仪表盘

- 作为学习者，打开日语学习页面时，我想一眼看到今天该复习多少单词、该练多少题，这样我能快速开始学习

---

## 4. 功能规格

### 4.1 单词卡 SRS 系统

#### 4.1.1 Dashboard 概览页

- 显示今日待复习单词数
- 显示今日新词数
- 显示连续学习天数
- 显示各级别（N5~N1）掌握进度（环形图或进度条）
- 快捷按钮：开始今日复习、浏览单词

#### 4.1.2 今日复习模式

- 只显示 `nextReview <= 今天` 的单词
- 每日新词上限（默认 10 个，可配置）
- 翻卡交互：正面显示单词，背面显示读音/意思/例句
- 三个反馈按钮：
  - **认识** (quality=5) — 熟练度高，延长复习间隔
  - **模糊** (quality=3) — 有一定印象，缩短复习间隔
  - **不认识** (quality=0) — 完全没记住，重置复习间隔
- 完成后显示本次复习摘要

#### 4.1.3 单词浏览模式

- 按 N5~N1 级别筛选
- 搜索框（支持单词/读音/意思搜索）
- 列表/卡片两种展示方式
- 显示每个单词的学习状态（未学/学习中/已掌握）
- 点击可进入单词详情

#### 4.1.4 统计页

- 掌握率趋势图（近 30 天）
- 学习热力图（GitHub 风格）
- 各级别掌握数量柱状图
- 总学习时长、总复习单词数

### 4.2 练习题库

#### 4.2.1 练习设置页

开始练习前选择：
- **级别**：N5 / N4 / N3 / N2 / N1 / 混合
- **题型**：语法选择题 / 翻译题 / 混合
- **题数**：10 / 20 / 30 / 全部

#### 4.2.2 答题模式

- 正面：题目 + 选项（单选）
- 提交后翻卡显示：正确答案 + 解析
- 自动进入下一题或手动点击下一题
- 进度条显示当前题号

#### 4.2.3 结果页

- 正确率百分比
- 用时统计
- 错题列表（题目 + 正确答案 + 解析）
- 按钮：再来一遍 / 错题重练 / 返回主页

#### 4.2.4 错题本

- 自动记录所有做错的题目
- 支持"错题重练"模式（只练习错题）
- 支持手动移除已掌握的错题

### 4.3 学习仪表盘主页

- 顶部：欢迎语 + 今日学习概览卡片
  - 今日待复习单词数
  - 今日推荐练习题目数
  - 连续学习天数
- 中部：两个快捷入口卡片（背单词、刷题）
  - 玻璃拟态风格大卡片
  - 显示简短描述和图标
- 底部：最近学习动态
  - "昨日复习了 20 个单词"
  - "最近练习正确率 85%"

---

## 5. 技术规格

### 5.1 技术栈

- **框架**：Vue 3（Composition API + `<script setup>`）
- **语言**：TypeScript（严格模式）
- **构建工具**：Vite
- **路由**：Vue Router 4
- **状态管理**：Pinia（如需要跨组件共享状态）
- **样式**：SCSS（Sass）
- **数据持久化**：localStorage（通过封装层）
- **图表**：可选（如 ECharts 或 Chart.js，用于统计页）

### 5.2 SRS 算法（简化版 SM-2）

每个单词的学习状态字段：
- `ef`（easiness factor，简易度系数，初始 2.5）
- `repetitions`（连续答对次数，初始 0）
- `interval`（间隔天数，初始 0）
- `nextReview`（下次复习日期，ISO 字符串）

算法逻辑：
```
if quality < 3:
  repetitions = 0
  interval = 1
else:
  repetitions += 1
  if repetitions == 1: interval = 1
  if repetitions == 2: interval = 6
  else: interval = round(interval * ef)

ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
if ef < 1.3: ef = 1.3

nextReview = today + interval days
```

### 5.3 数据结构

#### 单词数据（Word）
```typescript
interface Word {
  id: string;           // 唯一标识，如 "n5-001"
  word: string;         // 日语单词
  reading: string;      // 读音（假名）
  meaning: string;      // 中文意思
  type: string;         // 词性（N/V/Adj 等）
  accent: string;       // 声调
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  example: string;      // 例句（日文）
  exampleTranslation: string; // 例句翻译
}
```

#### 学习进度（WordProgress）
```typescript
interface WordProgress {
  wordId: string;
  ef: number;           // 简易度系数
  repetitions: number;  // 连续成功次数
  interval: number;     // 间隔天数
  nextReview: string;   // ISO 日期字符串
  lastReviewed: string; // 上次复习日期
  totalReviews: number; // 总复习次数
}
```

#### 练习题（Exercise）
```typescript
interface Exercise {
  id: string;
  type: 'choice' | 'translation';
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  question: string;     // 题目
  options: string[];    // 选项
  answer: number;       // 正确选项索引
  explanation: string;  // 解析
}
```

#### 练习进度（ExerciseProgress）
```typescript
interface ExerciseProgress {
  exerciseId: string;
  isWrong: boolean;
  lastAnswered: string; // ISO 日期
}
```

### 5.4 文件组织

```
src/
├── types/
│   └── japanese.ts          # 统一类型定义
├── utils/
│   └── storage.ts           # 存储封装（localStorage / 将来 uni-app）
├── composables/
│   ├── useSRS.ts            # SRS 算法 + 学习状态管理
│   └── useExerciseProgress.ts # 练习进度管理
├── api/
│   ├── vocabulary.ts        # 单词数据加载
│   └── exercise.ts          # 练习题数据加载
├── views/
│   ├── Japanese.vue         # 学习仪表盘主页（重构）
│   ├── Vocabulary.vue       # 单词卡系统（替换 word(demo).vue）
│   └── Exercise.vue         # 练习题库（重构）
└── content/
    └── japanese/
        ├── words/
        │   ├── N5.json      # 示例单词
        │   ├── N4.json
        │   └── ...
        ├── exercise/
        │   └── exercises.json  # 示例练习题
        └── DATA_TEMPLATE.md   # 数据格式说明
```

### 5.5 平台兼容性（uni-app 准备）

为将来迁移到 uni-app 做以下封装：

1. **存储层抽象**：`src/utils/storage.ts`
   - 提供 `get(key)`、`set(key, value)`、`remove(key)` 接口
   - 现在内部使用 `localStorage`
   - 将来替换为 `uni.getStorageSync` / `uni.setStorageSync`

2. **避免直接 DOM 操作**：
   - 翻卡动画使用 Vue `:class` + CSS
   - 事件监听使用 Vue 模板绑定，而非 `document.addEventListener`

3. **数据加载**：
   - 继续使用 `import` 或 `import.meta.glob` 加载静态 JSON
   - uni-app 支持此方式

---

## 6. UI/UX 规格

### 6.1 视觉风格

- **延续现有风格**：玻璃拟态（Glassmorphism）
  - 半透明背景：`rgba(255, 255, 255, 0.7~0.8)`
  - 背景模糊：`backdrop-filter: blur(10px)`
  - 柔和阴影
- **字体**：继续使用 "SmileySans"（得意黑）作为标题字体
- **主色调**：保持现有的绿色系（`#a3c1ad`）或从现有主题提取

### 6.2 翻卡交互

- 3D 翻转动画：`transform-style: preserve-3d`、`rotateY(180deg)`
- 过渡时间：`0.6s`
- 正面：题目/单词
- 背面：答案/详情
- 鼠标悬停时轻微上浮：`transform: translateY(-4px)`

### 6.3 响应式

- 保持现有响应式设计
- 主要适配桌面端和移动端浏览器
- uni-app 迁移时再针对移动端做更细致的适配

---

## 7. 数据策略

### 7.1 示例数据

每个 JLPT 级别准备 **5~10 个示例单词** 和 **5~10 道示例题目**，用于演示功能。

### 7.2 数据模板

提供 `DATA_TEMPLATE.md`，包含：
- 单词 JSON 格式说明
- 练习题 JSON 格式说明
- 添加新数据的步骤
- 文件命名规范

### 7.3 数据加载方式

使用 `import.meta.glob` 在构建时加载 JSON 文件，运行时无网络请求。

---

## 8. 验收标准

### 8.1 功能验收

- [x] 访问 `/japanese` 能看到新的仪表盘主页，包含今日概览和快捷入口
- [x] 点击"背单词"进入 `/word`，Dashboard 正确显示今日复习数和新词数
- [x] 开始复习后，翻卡动画正常，背面显示认识/模糊/不认识三个按钮
- [x] 点击"认识"后，该单词的下次复习日期按算法正确延后
- [x] 刷新页面后，学习进度（复习日期、掌握状态）不丢失
- [x] 单词浏览页能按 N5~N1 级别筛选
- [x] 点击"刷题"进入 `/exercise`，能选择级别和题型
- [x] 答错的题目自动加入错题本
- [x] 错题重练模式只显示错题
- [x] 练习结果页正确显示正确率和错题列表

### 8.2 技术验收

- [x] `npm run dev` 启动无报错
- [x] `npm run build` 构建成功，无 TypeScript 类型错误
- [x] localStorage 中能看到 `srs-progress` 和 `exercise-progress` 数据
- [x] 所有存储操作通过 `storage.ts` 封装，无直接 `localStorage` 调用

---

## 9. 未来规划

### 9.1 短期（后续迭代）

- 补充更多真实单词和题目数据
- 添加学习统计图表（ECharts）
- 番茄钟等学习辅助小工具

### 9.2 中期（uni-app 迁移）

- 将日语学习模块剥离为独立项目
- 使用 uni-app 打包为 iOS/Android App
- 替换 `storage.ts` 为 uni-app 存储 API

### 9.3 长期

- 后端服务 + 用户系统（支持跨设备同步）
- 语音播放（TTS）
- 社区功能（分享词单、讨论题目）

---

## 10. 附录

### 10.1 参考资料

- [SM-2 算法原文](https://www.supermemo.com/en/archives1990-2015/english/ol/sm2)
- [Anki 文档](https://docs.ankiweb.net/)
- [uni-app 文档](https://uniapp.dcloud.net.cn/)

### 10.2 术语表

| 术语 | 说明 |
|------|------|
| SRS | Spaced Repetition System，间隔重复系统 |
| SM-2 | SuperMemo-2，一种间隔重复算法 |
| EF | Easiness Factor，简易度系数 |
| JLPT | Japanese Language Proficiency Test，日本语能力测试 |
| N5~N1 | JLPT 级别，N5 最低，N1 最高 |
