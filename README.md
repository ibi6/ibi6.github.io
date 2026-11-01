# 个人主页 · Hang

单页个人知识 Hub。零构建，原生 HTML / CSS / JS（Google Fonts CDN）+ 本地 `vendor/`（从 [ui-components-oss](https://github.com/ibi6/ui-components-oss) 抽取的轻量 Switch / Toast / Drawer）。

**线上地址：<https://ibi6.github.io/>**

## 风格

Sufine Hub 式窄栏知识站布局（顶栏 + 侧栏 + 分类瓷砖），视觉对齐自己的组件库：`--uic-primary` 紫系、圆角描边、主题 Switch、项目筛选与详情抽屉、复制链接 Toast。

## 改内容

只改 `content.js` 里的 `PORTFOLIO_DATA`，保存后刷新即可。

## 本地预览

直接打开 `index.html`，或：

```bash
python -m http.server 8080
```

## 冒烟

```bash
ln -sfn /tmp/jsdom-install/node_modules ./node_modules   # 如有
node test-smoke.js
```
