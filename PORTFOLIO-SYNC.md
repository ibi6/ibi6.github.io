# Hang 个人网站

启动：`node server.mjs`，打开 http://127.0.0.1:4173 。

项目和贡献数据来自 @ibi6 的公开 GitHub 数据快照。页面尝试在线刷新仓库信息。贡献数据的时间范围以 data.js 为准。

示例笔记已清空。添加或修改 notes/*.md 后运行 `node build-notes.mjs`。

默认浅色主题，右上角可切换。支持 Ctrl/Cmd K 搜索、键盘导航和减少动态效果偏好。

旧工作室页面在 studio/，黑洞在 blackhole.html。

导航现在按页面切换：首页、项目、GitHub、笔记、联系。URL hash 可直达对应页面，浏览器前进后退可用。

每个分页可独立滚动：首页含精选项目、技术概览和笔记入口；项目支持语言筛选；GitHub 含推送时间线；笔记支持关键词搜索及阅读目录。增强内容由 js/enrich.js 提供。

## 自动同步与发布

- `node scripts/sync-github.mjs`：更新公开原创仓库、语言字节数、星标、分叉、最近推送时间和贡献日历。本机使用已登录的 `gh`，自动任务使用 GitHub 内置临时凭据，浏览器不存放凭据。
- `sync.config.json`：设置账号、排除项和首页优先项目。新增公开原创仓库会自动加入；Fork、归档仓库和个人 Profile 仓库默认排除。
- `node scripts/build-site.mjs`：打包笔记和公开静态文件到 `dist/`。私有仓库信息、脚本运行凭据、本地工具不会进入发布包。
- `.github/workflows/sync-and-deploy.yml`：推送到 main、手动触发或每 6 小时自动拉取数据并部署。定时任务可能由 GitHub 排队延后，并非实时推送。
- 在网站仓库 `notes/` 中添加或修改 Markdown 后提交，会自动打包发布。不会自动抓取其他仓库的 Issues、Discussions 或文章。
- GitHub 仓库 Settings → Pages → Source 需要选择 GitHub Actions。配置未合并、未启用前，线上旧站不会自动变成新版。
- 同步失败会使该次构建失败，保留上一次成功发布，不会用空数据覆盖网站。
- 贡献日历只导出日期与计数，不导出私有仓库名称或活动详情；可见贡献计数受 GitHub 账号隐私设置影响。

写作方法见 NOTES.md，网站笔记页提供带浏览器本地草稿的写作入口。
