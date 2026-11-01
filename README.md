# 个人主页 · Hang

单页个人知识 Hub。零构建、零依赖，原生 HTML / CSS / JS（Google Fonts CDN）。

**线上地址：<https://ibi6.github.io/>**

## 风格

Material / 文档站气质：Inter + JetBrains Mono、indigo 主色、浅色默认 / 深色 slate、顶栏 + 侧栏、窄栏纵向滚动。  
**已去掉** fullpage 整页分镜与霓虹粒子那套。

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
