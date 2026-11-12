---
title: 给个人站加一个命令面板（示例）
date: 2026-11-12
tags: 前端, 交互
summary: Ctrl K 呼出，模糊搜索项目和笔记。一百行以内，键盘党会喜欢。
---
内容一多，导航栏就不够用了。命令面板是最省地方的全站入口。

## 模糊匹配

不需要搜索库。按顺序在目标串里找每个字符，命中连续的加分：

```js
function score(q, s) {
  let i = 0, pts = 0, run = 0;
  for (const ch of s.toLowerCase()) {
    if (ch === q[i]) { i++; run++; pts += run * 2; } else run = 0;
    if (i === q.length) return pts;
  }
  return -1;
}
```

## 几个容易漏的细节

- 打开时记住原来的焦点，关闭后还回去
- `Esc` 关闭，上下键选择时要把选中项滚进可视区
- 面板打开期间锁住页面滚动
