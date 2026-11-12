# 站主写作说明

公开网站只提供阅读，不提供访客投稿或写作表单。发布权限由 GitHub 的仓库写权限控制；没有写权限的访客不能直接发布文章。

## 新建

打开 https://github.com/ibi6/ibi6.github.io/tree/main/notes ，用你自己的账号登录。

1. 点 Add file → Create new file。
2. 文件名填 `YYYY-MM-DD-标题.md`，正文写普通 Markdown（第一行 `# 标题`）。
3. 点 Commit changes，提交到 main。GitHub Actions 会自动打包和发布。

也可以上传本地 `.md` 文件：Add file → Upload files。

## 修改和删除

在 notes/ 中打开原文件，再编辑或删除并提交。网站会同步更新。

## 标签与摘要（可选）

文件头可加 title、date、tags、summary；不写也可以，标题取一级标题，日期取文件名日期或最后提交日期，摘要自动提取。

README.md 不会被当作文章发布。本地修改后运行 `node build-notes.mjs` 预览。
