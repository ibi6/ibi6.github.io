# 个人作品集 · Alex Chen

单页个人作品集网站。零构建、零依赖，原生 HTML / CSS / JS。

## 改内容：只动一个文件

**所有文案都在 `content.js` 里**，不需要碰 HTML。

打开 `content.js`，改完保存，刷新浏览器即可看到效果。

| 想改什么 | 改哪里 |
|---------|--------|
| 姓名 / 职位 / 一句话简介 / 打字机句子 | `profile` |
| 头像与 logo 缩写 | `profile.initials` |
| 关于我段落、数据卡（年限/项目数等） | `about` |
| 技能分组、条目、熟练度百分比 | `skills.groups` |
| 项目卡片（增删改） | `projects.items` |
| 工作/教育时间线 | `timeline.items` |
| 邮箱、社交链接 | `contact` + `profile.email` |
| 页脚署名 | `footer.note` |

### 常见改动示例

项目链接是空的就显示灰色占位，填上就变成可点外链：

```js
{
  name: 'Nebula UI', year: '2025',
  desc: '一句话描述。',
  tags: ['Vue3', 'TypeScript'],
  colors: ['#22d3ee', '#8b5cf6'],   // 缩略图渐变色
  github: 'https://github.com/you/nebula-ui',
  demo: 'https://nebula-ui.pages.dev'
}
```

关于我段落支持 `**加粗**`，也可以直接写 HTML：

```js
paragraphs: [
  '我是 **张三**，做前端。',
  '喜欢 <span class="mono grad-text">Rust</span>。'
]
```

社交图标可选：`github` `mail` `telegram` `rss` `link`（`link` 是通用兜底图标）。
`mail` 的 `url` 留空会自动变成 `mailto:` 加 `profile.email`。

## 本地预览

直接双击 `index.html`，或在目录里起个静态服务：

```bash
python -m http.server 8000   # 然后访问 http://localhost:8000
```

## 部署到 GitHub Pages

```bash
# 1. 在 github.com 新建仓库（例：my-portfolio），不要勾选 README
# 2. 关联并推送
git remote add origin https://github.com/<你的用户名>/my-portfolio.git
git branch -M main
git push -u origin main
# 3. 仓库 Settings → Pages → Source 选 "Deploy from a branch"
#    Branch 选 main，目录选 / (root)，Save
```

约 1 分钟后访问 `https://<你的用户名>.github.io/my-portfolio/`。

之后改内容：

```bash
# 改完 content.js
git add content.js && git commit -m "更新项目经历" && git push
```

### 想在浏览器里改（手机也能改）

GitHub 网页打开仓库 → 点 `content.js` → 右上角铅笔图标 → 改完点 **Commit changes** → 1 分钟后线上自动更新。这就是最省事的"后台"。

## 文件说明

```
index.html      页面结构 + 样式 + 交互逻辑（一般不用改）
content.js      全部文案内容 ★ 只改这个
test-smoke.js   渲染冒烟测试（node test-smoke.js）
docs/           设计文档
```

## 测试

```bash
npm install jsdom     # 首次
node test-smoke.js    # 21 项检查：内容渲染、图标、链接、页脚
```
