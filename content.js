/* =========================================================
 *  站点内容配置 —— 想改网页内容，只改这个文件
 *  · 改完保存，刷新浏览器即可看到效果
 *  · 部署到 GitHub 后，修改本文件并 push，网站自动更新
 *  · 段落文字支持 **加粗** 语法
 * ========================================================= */
window.PORTFOLIO_DATA = {

  /* ---------- 基本信息（Hero + 页脚 + 标题） ---------- */
  profile: {
    firstName: 'Hang',
    lastName: '',
    brand: 'ibi6',
    siteTitle: 'Hang · 独立开发者',
    kicker: '独立开发者 / 开源与工具作者',
    role: '独立开发者',
    summary: '喜欢把重复的、繁琐的事情做成好用的工具。专注桌面应用、安全与运维小工具、开源作品，追求轻量、可维护、真正可用。',
    motto: '做一点小而可靠的东西，顺便把日常省下来。',
    welcome: 'Welcome to my hub! 👋',
    typing: [
      'A Tool Builder!',
      'Desktop & OSS',
      '安全与运维小工具',
      '零依赖也能跑'
    ],
    avatar: 'https://avatars.githubusercontent.com/u/195998689?v=4',
    email: '',
    footerName: 'Hang',
    github: 'https://github.com/ibi6'
  },

  /* ---------- 首页分类磁贴（Hub） ---------- */
  hubCategories: [
    {
      icon: '🖥️',
      title: '桌面工具',
      desc: 'Tauri / Python 本地桌面应用，把重复操作收成一键。',
      href: '#projects',
      linkLabel: '看项目',
      tags: ['Tauri', '桌面', '本地']
    },
    {
      icon: '🧩',
      title: 'Web 与组件',
      desc: '纯前端组件、可视化与可交互学习页，零构建也能预览。',
      href: '#projects',
      linkLabel: '逛逛',
      tags: ['前端', '组件', 'Pages']
    },
    {
      icon: '🛡️',
      title: '安全运维',
      desc: '巡检、自查、诊断类小工具——偏实用，少折腾。',
      href: '#projects',
      linkLabel: '打开',
      tags: ['运维', '安全', 'CLI']
    },
    {
      icon: '✨',
      title: '开源实验',
      desc: '收藏与实验向作品：信号花园、代码城市、OSS 导航。',
      href: '#recommends',
      linkLabel: '去看看',
      tags: ['实验', '可视化', 'OSS']
    }
  ],

  /* ---------- 关于我 ---------- */
  about: {
    desc: '写代码、做工具、解决实际问题。',
    paragraphs: [
      '我是 **Hang**，GitHub 上的 **@ibi6**。做的事情很杂但目标一致：把繁琐的东西做成好用的工具——桌面应用、运维巡检、安全自查、可交互的学习页，都有涉足。',
      '我偏爱 **小而可靠** 的方案：能上原生就用原生，能少一个依赖就少一个。相信工具应该轻、快、可维护，而不是堆功能。',
      '近两年重点折腾 **本地桌面工具**（Tauri/Python）和 **安全 / 运维向小项目**，也维护了几个开源与个人作品。欢迎看看下面的项目，任何反馈都欢迎。'
    ],
    stats: [
      { value: 2,  suffix: '',  label: '公开仓库' },
      { value: 12, suffix: '+', label: '个人项目' },
      { value: 3,  suffix: '+', label: '桌面应用' }
    ]
  },

  /* ---------- 技术能力 ---------- */
  skills: {
    desc: '日常最常碰的技术栈，按使用频率大致分组。',
    groups: [
      { name: '语言', items: [ 'Python', 'TypeScript', 'JavaScript', 'HTML/CSS' ] },
      { name: '桌面', items: [ 'Tauri', 'React', 'Desktop GUI', 'Rust' ] },
      { name: '后端', items: [ 'Node.js', 'Express', 'PostgreSQL', 'REST / API' ] },
      { name: '工具', items: [ 'Git', 'Docker', 'Linux', 'GitHub Pages' ] }
    ]
  },

  /* ---------- 我的项目 ---------- */
  projects: {
    desc: '挑选一些体面、可公开聊的作品。Private 仓库对访客可能 404，主人登录后可开。',
    items: [
      {
        name: 'ui-components-oss',
        tagline: '纯前端动态 UI 组件集，零构建可预览。',
        tags: ['UI', '前端', '组件'],
        github: 'https://github.com/ibi6/ui-components-oss',
        homepage: 'https://ibi6.github.io/ui-components-oss/',
        featured: true,
        visibility: 'public'
      },
      {
        name: 'MatrixHunter',
        tagline: 'Windows 桌面授权检查台，内置白名单工具引导。',
        tags: ['桌面', '安全', 'Tauri'],
        github: 'https://github.com/ibi6/MatrixHunter',
        featured: true,
        visibility: 'private'
      },
      {
        name: 'cloud-host-ops-diag',
        tagline: '云主机运维巡检与智能诊断，带前端 Demo。',
        tags: ['运维', '诊断', 'Web'],
        github: 'https://github.com/ibi6/cloud-host-ops-diag',
        featured: true,
        visibility: 'private'
      },
      {
        name: 'how-it-works-cn',
        tagline: '全中文可交互互联网与 Web 安全基本功课。',
        tags: ['教育', '安全', '交互'],
        github: 'https://github.com/ibi6/how-it-works-cn',
        featured: true,
        visibility: 'private'
      },
      {
        name: 'secscan-lite',
        tagline: '零依赖本地代码自查，开箱即用。',
        tags: ['安全', '静态分析', 'CLI'],
        github: 'https://github.com/ibi6/secscan-lite',
        featured: true,
        visibility: 'private'
      },
      {
        name: 'commit-city',
        tagline: '把 git 历史渲染成等距代码城市。',
        tags: ['可视化', 'Git', '创意'],
        github: 'https://github.com/ibi6/commit-city',
        featured: true,
        visibility: 'private'
      },
      {
        name: 'signal-garden',
        tagline: '生成式信号花园，本地可玩的视觉实验。',
        tags: ['生成式', '视觉', '实验'],
        github: 'https://github.com/ibi6/signal-garden',
        featured: true,
        visibility: 'private'
      },
      {
        name: 'open-source-treasure',
        tagline: 'OSS Radar 宝藏导航，收藏优质开源。',
        tags: ['导航', 'OSS', '收藏'],
        github: 'https://github.com/ibi6/open-source-treasure',
        featured: true,
        visibility: 'private'
      }
    ]
  },

  /* ---------- 推荐项目 ---------- */
  recommends: {
    desc: '日常真正在用或真心觉得值得安利的开源。',
    note: '部分灵感来自收藏站 open-source-treasure',
    noteUrl: 'https://github.com/ibi6/open-source-treasure',
    items: [
      {
        name: 'Tauri',
        tagline: '用 Web 前端做轻量跨平台桌面应用的现代方案。',
        url: 'https://github.com/tauri-apps/tauri',
        tags: ['桌面', 'Rust', '跨平台']
      },
      {
        name: 'Excalidraw',
        tagline: '手绘风白板，架构图、脑暴随手画。',
        url: 'https://github.com/excalidraw/excalidraw',
        tags: ['白板', '协作', '前端']
      },
      {
        name: 'Scoop',
        tagline: 'Windows 命令行包管理，装工具像 brew 一样爽。',
        url: 'https://github.com/ScoopInstaller/Scoop',
        tags: ['Windows', '包管理']
      },
      {
        name: 'Vite',
        tagline: '极速前端开发服务器与构建工具。',
        url: 'https://github.com/vitejs/vite',
        tags: ['前端', '构建']
      },
      {
        name: 'ripgrep',
        tagline: '比 grep 快一个数量级的代码搜索。',
        url: 'https://github.com/BurntSushi/ripgrep',
        tags: ['CLI', '搜索', 'Rust']
      },
      {
        name: 'uv',
        tagline: 'Astral 出品的超快 Python 包与项目管理器。',
        url: 'https://github.com/astral-sh/uv',
        tags: ['Python', '包管理']
      },
      {
        name: 'Ruff',
        tagline: '用 Rust 写的 Python linter / formatter，又快又全。',
        url: 'https://github.com/astral-sh/ruff',
        tags: ['Python', 'Lint']
      },
      {
        name: 'Claude Code',
        tagline: '终端里的 AI 编程助手，适合长任务与仓库级改动。',
        url: 'https://github.com/anthropics/claude-code',
        tags: ['AI', 'CLI', '开发']
      }
    ]
  },

  /* ---------- 联系方式 ---------- */
  contact: {
    desc: '想交流、合作，或者发现了 bug，都欢迎。',
    heading: '聊聊技术，一起做点东西',
    intro: '开源、桌面工具、安全与运维小项目……任何想法都欢迎。平时 GitHub 回复会比较及时。',
    socials: [
      { icon: 'github', label: 'GitHub', url: 'https://github.com/ibi6' },
      { icon: 'link',   label: '博客',   url: 'https://github.com/ibi6/hang-blog' }
    ]
  },

  /* ---------- 页脚 ---------- */
  footer: { note: '手工制作 · 原生 HTML / CSS / JS · Material Hub 风' }
};
