/* =========================================================
 *  站点内容配置 —— 想改网页内容，只改这个文件
 *  · 改完保存，刷新浏览器即可看到效果
 *  · 部署到 GitHub 后，修改本文件并 push，网站自动更新
 *  · 段落文字支持 **加粗** 语法，也可直接写 HTML
 * ========================================================= */
window.PORTFOLIO_DATA = {

  /* ---------- 基本信息（Hero + 页脚 + 标题） ---------- */
  profile: {
    firstName: 'Alex',
    lastName: 'Chen',
    initials: 'AC',                     // 头像与导航 logo 显示的缩写
    siteTitle: 'Alex Chen · 全栈开发工程师',
    siteUrl: 'https://ibi6.github.io/',  // 部署后的网址（用于分享卡片）
    role: '全栈开发工程师',
    kicker: '你好，我是 👋',
    summary: '6 年全栈开发经验，热爱把复杂问题变简单。目前在 TechNova 负责核心交易系统前端架构与性能优化。',
    typing: [                           // Hero 打字机轮播句
      '高性能 Web 应用',
      'Vue / React 技术栈',
      '可维护的后端服务',
      '优雅的交互体验'
    ],
    email: 'hello@alexchen.dev'
  },

  /* ---------- 关于我 ---------- */
  about: {
    desc: '写代码的人，也写人生。',
    paragraphs: [
      '你好，我是 **Alex Chen**，一名全栈开发工程师，现居上海。我的日常在 **TypeScript、Vue 与 Go** 之间切换，喜欢从 0 到 1 把想法变成跑得起来的产品。',
      '过去 6 年，我在创业团队和一线大厂之间反复横跳：做过从零起步的 SaaS，也维护过日请求上亿的交易系统。相信**代码是写给下一个人看的**，所以对可维护性和自动化有执念。',
      '业余时间混迹开源社区，维护组件库、写技术博客，偶尔打打羽毛球。最近在折腾 <span class="mono grad-text">Rust</span> 和边缘计算。'
    ],
    stats: [
      { value: 6,    suffix: '+', label: '年开发经验' },
      { value: 40,   suffix: '+', label: '交付项目' },
      { value: 2400, suffix: '+', label: 'GitHub 贡献' }
    ]
  },

  /* ---------- 技能栈 ---------- */
  skills: {
    desc: '熟练度基于日常使用频率，非客观评级。',
    groups: [
      { name: '前端', items: [
        { name: 'JavaScript / TypeScript', level: 95 },
        { name: 'Vue 3',    level: 92 },
        { name: 'CSS / 动画', level: 88 },
        { name: 'React',    level: 85 }
      ]},
      { name: '后端', items: [
        { name: 'Node.js',    level: 90 },
        { name: 'PostgreSQL', level: 82 },
        { name: 'Go',         level: 80 },
        { name: 'Python',     level: 78 }
      ]},
      { name: '工具 / DevOps', items: [
        { name: 'Git',     level: 90 },
        { name: 'Linux',   level: 88 },
        { name: 'Docker',  level: 85 },
        { name: 'CI / CD', level: 80 }
      ]}
    ]
  },

  /* ---------- 精选项目（增删条目直接改数组） ---------- */
  projects: {
    desc: '几个有代表性的作品，均可在 GitHub 找到。',
    items: [
      {
        name: 'Nebula UI', year: '2025',
        desc: 'Vue 3 + TypeScript 企业级组件库，40+ 组件，主题定制系统，npm 周下载 2w+。',
        tags: ['Vue3', 'TypeScript', 'Vite', 'Monorepo'],
        colors: ['#22d3ee', '#8b5cf6'],           // 缩略图渐变
        github: '', demo: ''                      // 填真实链接，留空则显示占位
      },
      {
        name: 'TaskFlow', year: '2024',
        desc: 'React + Node.js 团队协作平台，WebSocket 实时看板，支持 2000 人同时在线协作。',
        tags: ['React', 'Node.js', 'WebSocket'],
        colors: ['#f472b6', '#fb923c'],
        github: '', demo: ''
      },
      {
        name: 'QuantBot', year: '2024',
        desc: 'Go 语言量化交易机器人：事件驱动回测引擎 + 实时风控，个人长期维护。',
        tags: ['Go', 'Python', 'Docker'],
        colors: ['#34d399', '#14b8a6'],
        github: '', demo: ''
      },
      {
        name: 'PixelPress', year: '2023',
        desc: '图片压缩 SaaS：WASM 本地压缩，隐私优先，压缩率比同类高 15%，日处理 50w 张。',
        tags: ['Go', 'WASM', 'Redis'],
        colors: ['#fbbf24', '#f43f5e'],
        github: '', demo: ''
      }
    ]
  },

  /* ---------- 经历 ---------- */
  timeline: {
    desc: '一路走来，每一步都算数。',
    items: [
      { date: '2024.03 — 至今', title: '高级全栈工程师', org: 'TechNova 科技 · 上海',
        desc: '负责核心交易系统前端架构，重构后首屏性能提升 40%；带领 5 人小组，建立组件库与 CI/CD 规范。' },
      { date: '2021.06 — 2024.02', title: '前端工程师', org: 'ByteWorks · 杭州',
        desc: '主导内部组件库建设，支撑 20+ 业务线；推动 TypeScript 全面落地，线上缺陷率下降 60%。' },
      { date: '2019.07 — 2021.05', title: '全栈开发（创始团队）', org: '星云创业团队 · 深圳',
        desc: '从 0 到 1 构建 SaaS 产品，独立负责前后端与部署；产品上线一年日活 5w+。' },
      { date: '2015.09 — 2019.06', title: '计算机科学与技术 · 学士', org: '某理工大学',
        desc: '主修软件工程，校级 ACM 集训队队长，获省程序设计竞赛金奖。' }
    ]
  },

  /* ---------- 联系方式 ---------- */
  contact: {
    desc: '有想法就聊聊，通常在 24 小时内回复。',
    heading: '合作 / 交流 / 约咖啡 ☕',
    intro: '开源合作、技术咨询或只是想聊聊技术，都欢迎来信。',
    socials: [
      { icon: 'github',   label: 'GitHub',   url: '' },   // 例：https://github.com/yourname
      { icon: 'mail',     label: '邮箱',     url: '' },   // 留空则自动用 profile.email
      { icon: 'telegram', label: 'Telegram', url: '' },
      { icon: 'rss',      label: 'RSS 订阅', url: '' }
    ]
  },

  /* ---------- 页脚 ---------- */
  footer: { note: '示例作品集' }
};
