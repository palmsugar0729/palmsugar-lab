---
date: 2026-06-08
tags: [pitfall, python, encoding, windows]
project: palmsugar-lab
status: resolved
aliases: ["Python stdout 中文乱码"]
---

# Python stdout 中文输出乱码（Windows bash 环境）

**状态**：🟢 已解决  
**发现日期**：2026-06-08  
**关联**：[[2026-06-08 开发日志]] · N1/N2 词库导入

## 现象

使用 Python + openpyxl/pandas 读取含有中文的 Excel 文件后，`print()` 输出全部为乱码：

```
���� 600 rows
�����ݴ� 46 rows
```

## 根因

Windows 下的 bash（MSYS2/Git Bash）默认代码页不是 UTF-8，Python 的 stdout 编码跟随系统 locale，导致 UTF-8 中文字符无法正确显示。**这不是 openpyxl/pandas 的读取问题**，数据本身在内存中是完全正确的 Unicode 字符串。

## 解决方案

### 方案A：绕过 stdout（推荐）

不再依赖 `print()` 查看中文，而是将数据写入临时 JSON 文件，再用外部工具（如 Claude Code 的 Read 工具）查看：

```python
import json
with open('temp_preview.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
```

### 方案B：修改代码页（临时）

在 bash 中执行：
```bash
chcp 65001
export PYTHONIOENCODING=utf-8
```

### 方案C：Python 脚本内重定向 stdout

```python
import sys
sys.stdout.reconfigure(encoding='utf-8')
```

## 预防

- [ ] 在 Windows 项目的数据处理脚本中，优先采用"写文件 → 外部查看"模式
- [ ] 将 `PYTHONIOENCODING=utf-8` 加入项目 `.env` 或 CI 环境变量
- [ ] 避免在数据处理阶段依赖终端输出做验证
