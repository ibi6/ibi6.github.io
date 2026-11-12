// 自动生成，别手改。改 .md 后运行 node build-notes.mjs
window.SITE_NOTES = [
 {
  "slug": "2026-10-28-readme",
  "title": "怎么往这里加笔记（示例）",
  "date": "2026-11-12",
  "tags": [
   "说明"
  ],
  "summary": "在 notes 目录放一个 Markdown 文件，跑一条命令，就上线了。",
  "minutes": 1,
  "body": "笔记就是 `notes/` 目录里的 Markdown 文件。\n\n## 步骤\n\n- 新建一个 `.md`，文件名随意，建议用日期开头\n- 文件顶部写上标题、日期、标签和一句摘要\n- 运行 `node build-notes.mjs`，它会重新生成 `notes/notes.js`\n\n## 支持的写法\n\n二级标题、列表、**加粗**、`行内代码` 和代码块。够记技术笔记用了。"
 },
 {
  "slug": "2026-11-05-command-palette",
  "title": "给个人站加一个命令面板（示例）",
  "date": "2026-11-12",
  "tags": [
   "前端",
   "交互"
  ],
  "summary": "Ctrl K 呼出，模糊搜索项目和笔记。一百行以内，键盘党会喜欢。",
  "minutes": 1,
  "body": "内容一多，导航栏就不够用了。命令面板是最省地方的全站入口。\n\n## 模糊匹配\n\n不需要搜索库。按顺序在目标串里找每个字符，命中连续的加分：\n\n```js\nfunction score(q, s) {\n  let i = 0, pts = 0, run = 0;\n  for (const ch of s.toLowerCase()) {\n    if (ch === q[i]) { i++; run++; pts += run * 2; } else run = 0;\n    if (i === q.length) return pts;\n  }\n  return -1;\n}\n```\n\n## 几个容易漏的细节\n\n- 打开时记住原来的焦点，关闭后还回去\n- `Esc` 关闭，上下键选择时要把选中项滚进可视区\n- 面板打开期间锁住页面滚动"
 },
 {
  "slug": "2026-11-10-contribution-city",
  "title": "把贡献日历画成一座城（示例）",
  "date": "2026-11-12",
  "tags": [
   "前端",
   "Canvas"
  ],
  "summary": "首屏那片小楼是真实的提交记录，每一栋是一天。记一下等距投影怎么画。",
  "minutes": 1,
  "body": "首屏背景不是装饰图，是过去一年的 GitHub 贡献：一格一天，提交越多楼越高。\n\n## 等距投影就两行\n\n把格子坐标 `(col, row)` 换成屏幕坐标：\n\n```js\nconst sx = (col - row) * tileW / 2;\nconst sy = (col + row) * tileH / 2 - height;\n```\n\n每栋楼画三个面：顶面最亮，左右两个侧面依次变暗，立体感就出来了。\n\n## 画的顺序很重要\n\n从远到近画（`col + row` 小的先画），近处的楼才能盖住远处的。顺序错了会出现穿模。\n\n## 让它活起来\n\n- 楼按距离依次长出来，用一个带延迟的缓动\n- 鼠标指到哪栋，哪栋抬高并显示日期和次数"
 },
 {
  "slug": "2026-11-12-scroll-driven-motion",
  "title": "滚动动效不用库也能做（示例）",
  "date": "2026-11-12",
  "tags": [
   "前端",
   "动效"
  ],
  "summary": "一个 IntersectionObserver 加一个 requestAnimationFrame，就够撑起整站的入场和视差。",
  "minutes": 1,
  "body": "这个站没有引入任何动效库。所有会动的东西只靠两样：\n\n## 入场：交给 IntersectionObserver\n\n给要出现的元素加一个类，进入视口时再加一个 `on`，过渡写在 CSS 里。\n\n```js\nconst io = new IntersectionObserver(es => es.forEach(e => {\n  if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }\n}), { threshold: 0.15 });\n```\n\n好处是 **JS 只管开关，样子全在 CSS**，改动效不用碰脚本。\n\n## 跟手：只开一个 rAF\n\n进度条、导航胶囊、视差都放在同一个循环里读 `scrollY`，不要每个效果各挂一个 scroll 监听。\n\n- 只读一次布局，再统一写样式\n- 用 `transform` 和 `opacity`，别动 `top` / `width`\n- 尊重 `prefers-reduced-motion`，关掉就直接显示终态"
 }
];
