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
    lastName: '',                       // 留空则 Hero 只显示 firstName
    brand: 'ibi6',
    siteTitle: 'Hang · 独立开发者',
    kicker: '独立开发者 / 自动化工具作者',
    role: '独立开发者',
    summary: '喜欢把重复的、繁琐的事情自动化。专注桌面工具、Web 服务与开源项目，追求轻量、可维护、真正可用。',
    typing: [
      '桌面工具',
      'API 网关与代理',
      '自动化与注册工具',
      '高效开源项目'
    ],
    email: 'hello@alexchen.dev',
    footerName: 'Hang'
  },

  /* ---------- 关于我 ---------- */
  about: {
    desc: '写代码、做工具、解决实际问题。',
    paragraphs: [
      '我是 **Hang**，GitHub 上的 **@ibi6**。做的事情很杂但目标一致：把繁琐的东西做成好用的工具——桌面应用、代理服务、自动化流程，都有涉足。',
      '我偏爱 **小而可靠** 的方案：能上原生就用原生，能少一个依赖就少一个。相信工具应该轻、快、可维护，而不是堆功能。',
      '近两年重点折腾 **本地桌面工具**（Tauri/Python）和 **API 网关与代理**，也维护了几个开源项目。欢迎看看下面的作品，任何反馈或合作都欢迎。'
    ],
    stats: [
      { value: 10, suffix: '+', label: '公开仓库' },
      { value: 12, suffix: '+', label: '开源/个人项目' },
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

  /* ---------- 联系方式 ---------- */
  contact: {
    desc: '想交流、合作，或者发现了 bug，都欢迎。',
    heading: '聊聊技术，<em>一起做点东西</em>',
    intro: '开源、自动化、桌面工具……任何想法都欢迎。平时 GitHub 回复会比较及时。',
    socials: [
      { icon: 'github', label: 'GitHub', url: 'https://github.com/ibi6' },
      { icon: 'mail',   label: '邮箱',   url: '' },
      { icon: 'link',   label: '博客',   url: 'https://github.com/ibi6/hang-blog' }
    ]
  },

  /* ---------- 页脚 ---------- */
  footer: { note: '手工制作 · 原生 HTML / CSS / JS' }
};
