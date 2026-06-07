---
date: 2026-06-08
tags: [pitfall, excel, data-import, dirty-data]
project: palmsugar-lab
status: resolved
aliases: ["Excel 数据列错位"]
---

# Excel 源数据列错位导致字段混乱

**状态**：🟢 已解决  
**发现日期**：2026-06-08  
**关联**：[[2026-06-08 开发日志]] · N1 词库导入

## 现象

N1 单词表第 634 行（`売れ行き`）导入后数据完全错位：

| 字段 | 正常行 | 错位行 |
|------|--------|--------|
| word | `憂い` | `売れ行き  うれゆき` |
| reading | `うれい` | `名` ← 词性跑到了读音列 |
| type | `名` | `（商品的）销售情况、销路` ← 意思跑到了词性列 |
| meaning | `担心、忧虑` | `` ← 空 |

## 根因

源 xls 文件里，该行的 A 列单元格同时填写了**单词 + 两个空格 + 读音**，导致后续列整体左移一位（B 列实际为词性，C 列为意思，D 列为空）。

属于人工录入时的格式异常，非系统性问题（仅 1 行）。

## 解决方案

在 Python 导入脚本中增加**双空格检测 + 自动 split** 逻辑：

```python
if '  ' in a:  # A 列包含双空格
    parts = a.split('  ')
    word = parts[0].strip()
    reading = parts[1].strip()
    pos = b        # B 列实为词性
    meaning = c    # C 列实为意思
else:
    word = a
    reading = b
    pos = c
    meaning = d
```

## 预防

- [ ] 批量导入前先抽样检查前 10 行、中间 10 行、末尾 10 行
- [ ] 对关键字段做合理性校验（如 reading 字段不应等于 "名"/"形"/"形动"）
- [ ] 导入后统计 `type` 字段的异常值（长度 > 10 或包含中文意思文本）
