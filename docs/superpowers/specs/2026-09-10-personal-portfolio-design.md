# 个人作品集网页 · 设计文档

日期：2026-09-10
状态：已批准（聊天内确认）
分类：新项目 Architectural

## 1. 目标

单文件个人作品集/简历页，示例内容，展示前端实力。
零依赖、可离线双击打开、易部署（GitHub Pages / 任意静态服务器）。

## 2. 范围

- 交付物：`C:\Users\hang\portfolio\index.html` 单个文件
- 内联 CSS / JS，无外部依赖（字体用系统栈，图标用内联 SVG）
- 单页滚动，8 个区块，锚点导航

## 3. 架构

纯静态三层，JS 模块按职责划分（单文件内分节）：

| 模块 | 职责 |
|------|------|
| theme | 主题三态切换 + localStorage 持久化 |
| nav | 锚点导航、汉堡菜单、scrollspy 高亮 |
| reveal | IntersectionObserver 滚动入场 |
| typing | Hero 打字机效果 |
| contact | 表单前端校验（不发送） |

无构建、无框架、无运行时依赖。

## 4. 页面结构

1. **nav** — logo、锚点链接（关于/技能/项目/经历/联系）、主题切换按钮
2. **hero** — SVG 占位头像、姓名、一句介绍、打字机句、CTA 按钮
3. **about** — 简介段落 + 3 张数据卡（年限/项目数/开源贡献）
4. **skills** — 三组技能卡（前端/后端/工具），每组含熟练度条
5. **projects** — 4 张示例项目卡：图占位、名称、描述、技术标签、链接
6. **timeline** — 工作/教育时间线
7. **contact** — 社交链接图标 + 联系表单（前端校验，不真实发送）
8. **footer** — 版权声明

## 5. 主题系统

- CSS 变量两套：`[data-theme="dark"]` / `[data-theme="light"]`
- 三态循环：auto（跟随系统）→ light → dark，localStorage 记忆
- 防闪烁：`<head>` 内联脚本在首帧前应用主题
- 配色：
  - dark：背景 `#0b0f1a`，玻璃拟态卡片 `rgba` 半透明 + 边框高光，强调色青紫渐变
  - light：背景 `#fafafa` 白底大留白，同强调色，卡片浅灰描边
- 排版：`system-ui` 栈 + `ui-monospace` 点缀；中文为主，英文点缀

## 6. 动效

- IntersectionObserver 滚动入场（fade-up，只触发一次）
- Hero 打字机效果
- 项目卡 hover 浮起 + 边框发光
- 平滑滚动（`scroll-behavior`）+ 导航当前区块高亮
- 主题切换过渡动画

## 7. 响应式

- 桌面 >768px：完整导航
- 移动 ≤768px：汉堡菜单
- ≤480px：单列布局

## 8. 示例内容

- 人物「Alex Chen」，全栈开发者
- 技能：前端（JavaScript/TypeScript/Vue/React）、后端（Node.js/Python/Go）、工具（Docker/Git/Linux）
- 4 个示例项目、工作/教育时间线各 2-3 条

## 9. 测试清单

- [ ] 双击打开，控制台无报错
- [ ] 主题三态循环切换 + 刷新后持久化 + 首帧无闪烁
- [ ] 锚点跳转平滑、scrollspy 正确高亮
- [ ] DevTools 下 768/480 断点布局正常、汉堡菜单可用
- [ ] 表单空值/邮箱格式校验提示正常

## 10. 非目标（YAGNI）

- 真实个人信息与头像（用户后续自行替换）
- 表单后端发送、SEO 多页结构、框架迁移
