---
title: 滚动动效不用库也能做（示例）
date: 2026-11-12
tags: 前端, 动效
summary: 一个 IntersectionObserver 加一个 requestAnimationFrame，就够撑起整站的入场和视差。
---
这个站没有引入任何动效库。所有会动的东西只靠两样：

## 入场：交给 IntersectionObserver

给要出现的元素加一个类，进入视口时再加一个 `on`，过渡写在 CSS 里。

```js
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
}), { threshold: 0.15 });
```

好处是 **JS 只管开关，样子全在 CSS**，改动效不用碰脚本。

## 跟手：只开一个 rAF

进度条、导航胶囊、视差都放在同一个循环里读 `scrollY`，不要每个效果各挂一个 scroll 监听。

- 只读一次布局，再统一写样式
- 用 `transform` 和 `opacity`，别动 `top` / `width`
- 尊重 `prefers-reduced-motion`，关掉就直接显示终态
