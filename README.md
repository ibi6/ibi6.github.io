# 个人主页 · Hang

单页个人作品集网站。零构建、零依赖，原生 HTML / CSS / JS。

**线上地址：<https://ibi6.github.io/>**

## 改内容

所有文案都在 `content.js` 里，不需要碰 HTML。编辑型排版：衬线大标题 + 等宽字标注 + 纸张底色。

| 想改什么 | 改哪里 |
|---------|--------|
| 姓名 / 一句话简介 / 打字机句子 | `profile` |
| 品牌 logo、页脚署名 | `profile.brand` / `footerName` |
| 关于我段落、数据卡（年限/项目数等） | `about` |
| 技术标签分组（标签墙，无百分比） | `skills.groups` |
| 邮箱、社交链接 | `contact` + `profile.email` |
| 页脚署名 | `footer.note` |

改完保存，双击 `index.html` 看效果，满意后推送上线：

```bash
git add -A && git commit -m "更新内容" && git push
```

### 常见改动示例

关于我段落支持 `**加粗**`：

```js
paragraphs: [
  '我是 **Hang**，GitHub 上的 **@ibi6**。'
]
```

社交为文字胶囊按钮。
`mail` 的 `url` 留空会自动变成 `mailto:` 加 `profile.email`。
改配色或字体，编辑 `index.html` 顶部的 CSS 变量（`--accent` / `--serif` / `--paper`）。

## 本地预览

直接双击 `index.html`，或在目录里起个静态服务：

```bash
python -m http.server 8000   # 然后访问 http://localhost:8000
```

## 部署

仓库 `ibi6/ibi6.github.io` 是 GitHub Pages 的**根站点仓库**，推送 main 分支后约 1 分钟自动上线 <https://ibi6.github.io/>，无需再配置 Pages。

### 想在浏览器里改（手机也能改）

GitHub 网页打开 <https://github.com/ibi6/ibi6.github.io/blob/main/content.js> → 右上角铅笔图标 → 改完点 **Commit changes** → 1 分钟后线上自动更新。

### 首次部署备忘（换账号/换仓库时参考）

```bash
gh auth login --web --git-protocol https
gh repo create <用户名>.github.io --public --source=. --remote=origin --push
# 若仓库名不是 <用户名>.github.io，需在 Settings → Pages 里手动开启：
#   Source = Deploy from a branch，Branch = main，目录 = / (root)
```

## 文件说明

```
index.html      页面结构 + 样式 + 交互逻辑（一般不用改）
content.js      全部文案内容 ★ 改内容只动这个
test-smoke.js   jsdom 渲染冒烟测试（17 项）
shot.js         Playwright 截图（桌面 / 移动，需本地装 playwright-core）
check-interaction.js  表单 / 主题 / 滚动交互验证
docs/           设计文档
```

## 测试

```bash
npm install jsdom        # 首次
node test-smoke.js       # 17 项：内容渲染、链接、字段、页脚
```
