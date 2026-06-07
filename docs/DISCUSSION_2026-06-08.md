---
date: 2026-06-08
participants: palmsugar, Claude Code
topic: 日语学习模块词库扩充 + 开发规范讨论
aliases: ["2026-06-08 会话留档"]
---

# 会话留档：日语学习模块词库扩充与功能讨论

## 一、会话背景

- **项目**：palmsugar-lab（Vue 3 + TypeScript 个人学习站）
- **模块**：日语学习（Japanese Learning Module）
- **前期状态**：v2.0 已实现 SRS 单词卡、练习题库、学习仪表盘，但词库仅有每级别 5~10 个示例单词
- **本次目标**：补充 N1~N5 全级别真实词库，为后续"分级别背单词"功能做准备

## 二、本次完成的工作

### 2.1 词库扩充（N1~N5）

| 级别 | 单词数 | 来源 | 处理要点 |
|------|--------|------|----------|
| N5 | 601 | 用户自整理 `N5words.json` | 字段标准化、词性保留（含动词自他分类） |
| N4 | 1229 | `TRYN4词汇表.xlsx`（6 sheet） | 多 sheet 逐 sheet 映射 |
| N3 | 1026 | `TRYN3词汇表.xlsx`（6 sheet） | 同上 |
| N2 | 4386 | `日语N2(二级)单词表.xls` | B 列空缺用 A 列填充；type/accent 留空 |
| N1 | 9185 | `日语N1单词表.xls` | 词性标准化；修复列错位脏数据 |
| **合计** | **16,427** | — | — |

### 2.2 数据格式统一

- 删除冗余 `level` 字段（级别已体现在文件名）
- 统一字段顺序：`id → word → reading → meaning → type → accent → example → exampleTranslation`
- 例句（example/exampleTranslation）全部留空，待后续补充

### 2.3 文档与规范

- 创建/更新 `docs/2026-06-08_开发日志.md`
- 创建踩坑记录 `docs/pitfalls/001_python-stdout-encoding-windows.md`
- 创建踩坑记录 `docs/pitfalls/002_xls-column-shift-dirty-data.md`
- 创建学习笔记 `docs/learnings/bulk-excel-import-patterns.md`
- Obsidian vault 同步完成

## 三、讨论过程中的决策

| # | 决策点 | 结论 | 理由 |
|---|--------|------|------|
| 1 | 复习模式级别隔离 | **赞同改造** | 当前全级别混排体验差，需支持按 N5/N4/N3/N2/N1 分别复习 |
| 2 | 新词上限计算方式 | **按级别各自算** | 全局 10 个上限对高级别不公平 |
| 3 | 默认学习级别 | **等用户系统上线再说** | 目前先做功能，配置延后 |
| 4 | 例句生成方式 | **暂不处理** | 1830+4386+9185=15401 条例句，批量 AI 生成成本高，模板生成质量差 |
| 5 | N1 复合词性处理 | **自/他→V，名/形/形动→N/A/Na，其余保持原样** | 用户明确指令 |
| 6 | 数据源格式选择 | **Excel/Word 远优于图片** | 无 OCR 误差、token 成本低、可脚本自动化 |

## 四、踩坑记录

### 4.1 Python stdout 中文编码问题

- **现象**：openpyxl/pandas 读取后 `print()` 输出乱码
- **根因**：Windows bash 默认代码页非 UTF-8
- **解决**：写临时 JSON 文件 → 外部 Read 工具查看，绕过 stdout
- **文档**：[[001_python-stdout-encoding-windows]]

### 4.2 Excel 列错位（N1 第 634 行）

- **现象**：`売れ行き  うれゆき` 的 A 列同时包含单词和读音，导致 B/C/D 列整体错位
- **根因**：源数据人工录入异常
- **解决**：脚本检测双空格并 split 拆分
- **文档**：[[002_xls-column-shift-dirty-data]]

### 4.3 xlrd 版本兼容性

- **现象**：N2/N1 的 `.xls` 文件无法读取
- **根因**：未安装 xlrd，且 xlrd 2.0+ 已移除 xlsx 支持
- **解决**：`pip install xlrd`

## 五、遗留问题与下一步

### 5.1 功能开发（P0）

- [ ] **分级别背单词**：SRS `getTodayQueue` / `getTodayReviews` / `getNewWords` 增加 `level` 过滤参数
- [ ] **Dashboard 级别入口**：每个级别一个卡片，显示该级别今日待复习数 + 新词数，点击进入该级别专属队列
- [ ] **浏览模式保持**：已有级别筛选，无需改动

### 5.2 数据完善（P1）

- [ ] **例句批量生成**：15401 条空例句待填充（N2+N1 为主）
- [ ] **type/accent 补充**：N2 全部、N1 部分（复合词性需确认是否进一步简化）
- [ ] **N1 脏数据复查**：确认 4 条空 type 单词（`修業`、`舅`、`姑`、`傍`）

### 5.3 性能优化（P2）

- [ ] **构建体积**：N1(9185) + N2(4386) 全量 `import.meta.glob` 加载可能导致 bundle 过大
- [ ] **懒加载方案**：按级别分块加载，或首屏仅加载当前级别数据
- [ ] **localStorage 容量**：SRS 进度 + 错题本，数据量大时需考虑 IndexedDB

### 5.4 未来规划（P3）

- [ ] **用户系统**：支持默认学习级别、学习偏好配置
- [ ] **uni-app 迁移**：替换 `storage.ts` 为 uni-app 存储 API
- [ ] **图表增强**：统计页接入 ECharts

## 六、技术要点备忘

- **批量 Excel 导入模式**：见 `docs/learnings/bulk-excel-import-patterns.md`
- **词性映射规则**：`自/他 → V`，`名 → N`，`形 → A`，`形动 → Na`
- **JSON 字段规范**：`id` 前缀 `n{级别}-{序号}`（N5/N4/N3 用 3 位，N2/N1 用 4 位）
- **Git 提交规范**：`feat(vocabulary): ...`

---

*本次会话的所有代码变更已提交至 Git：`ac9472e`*
