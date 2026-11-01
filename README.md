# 个人主页 · Hang

单页个人作品集网站。零构建、零依赖，原生 HTML / CSS / JS（Google Fonts CDN）。

**线上地址：<https://ibi6.github.io/>**

## 风格

暗色沉浸式：粒子/光晕 Hero、滚动进度条、横向 snap 项目画廊（光斑跟随）、可拖推荐胶囊轨道。

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
