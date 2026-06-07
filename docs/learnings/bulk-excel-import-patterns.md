---
date: 2026-06-08
tags: [learning, python, excel, data-processing]
project: palmsugar-lab
aliases: ["批量 Excel 导入实战"]
---

# 批量 Excel 导入项目 JSON 的实战模式

## 背景

本次为日语学习模块一次性导入了 5 个级别的词库（N1~N5），合计 **16,427 个单词**。数据来源包括：
- 用户自整理的 JSON
- `.xlsx` 多 sheet 文件（N4、N3）
- `.xls` 单 sheet 文件（N2、N1）

## 核心模式

### 1. 库的选择

| 文件格式 | 推荐库 | 安装 |
|----------|--------|------|
| `.xlsx` | openpyxl / pandas | `pip install openpyxl` |
| `.xls` | xlrd（2.0+ 仍支持 xls） | `pip install xlrd` |

> ⚠️ xlrd 2.0+ 已**移除 xlsx 支持**，仅保留 xls。不要混用。

### 2. 多 sheet vs 单 sheet 处理

**多 sheet（如 N4：体言/イ形容/ナ形容/动词/外来语/其他）**

```python
wb = openpyxl.load_workbook('file.xlsx')
for name in wb.sheetnames:
    ws = wb[name]
    # 每个 sheet 的结构可能不同，需单独映射字段
```

优点：词性已按 sheet 分类，无需从单元格解析。  
缺点：不同 sheet 的列数/列名可能不一致，需逐 sheet 写映射逻辑。

**单 sheet（如 N2：A=读音, B=单词, C=意思）**

```python
ws = wb.sheet_by_index(0)
for i in range(1, ws.nrows):
    reading = ws.cell_value(i, 0)
    word = ws.cell_value(i, 1)
    meaning = ws.cell_value(i, 2)
```

优点：结构简单，代码量少。  
缺点：词性、声调等附加信息缺失，需要后续补充。

### 3. 词性标准化映射

不同来源的词性标注差异巨大，需在导入阶段统一：

```python
if '自' in pos or '他' in pos:
    t = 'V'
elif pos == '名':
    t = 'N'
elif pos == '形':
    t = 'A'
elif pos == '形动':
    t = 'Na'
else:
    t = pos  # 复合词性保持原样
```

**关键原则**：先处理优先级最高的规则（如 自/他动词），再处理单一词性，最后兜底保持原样。

### 4. 脏数据防御

| 异常类型 | 检测方法 | 处理 |
|----------|----------|------|
| 列错位 | 关键字段值不符合预期类型 | split 重映射、跳过、留空 |
| 空词性 | `pos == 'None'` 或 `pos == ''` | 设为空字符串，后续补充 |
| 编码问题 | stdout 乱码 | 写临时文件 + 外部查看 |
| 空单元格 | `cell.value is None` | 提供默认值或跳过 |

### 5. JSON 字段顺序控制

Python 3.7+ 的 dict 保持插入顺序，但为确保跨语言一致性，建议显式 reorder：

```python
output = {
    'id': w['id'],
    'word': w['word'],
    'reading': w['reading'],
    'meaning': w['meaning'],
    'type': w['type'],
    'accent': w['accent'],
    'example': w['example'],
    'exampleTranslation': w['exampleTranslation']
}
```

Node.js 侧也做同样的 reorder 作为 double-check。

## 踩过的坑

- [[001_python-stdout-encoding-windows]] — Windows bash 下 Python 中文输出乱码
- [[002_xls-column-shift-dirty-data]] — Excel 列错位导致字段混乱

## 参考

- `src/content/japanese/words/` — 本项目词库 JSON 目录
- `docs/DATA_TEMPLATE.md` — 数据格式规范
