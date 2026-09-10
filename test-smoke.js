/* 冒烟测试：用 jsdom 加载 index.html，验证 content.js 渲染结果 */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const dir = __dirname;
const indexFile = path.join(dir, 'index.html');

// jsdom 缺失的浏览器 API，补桩（file:// 加载，content.js 才会被真实读取）
const fileUrl = require('url').pathToFileURL(indexFile).href;
const dom = new JSDOM(fs.readFileSync(indexFile, 'utf8'), {
  url: fileUrl,
  runScripts: 'dangerously',
  resources: 'usable',
  beforeParse(window) {
    window.matchMedia = window.matchMedia || (q => ({
      matches: /min-width:\s*641px/.test(q), media: q,
      addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}
    }));
    window.IntersectionObserver = class {
      constructor(cb) { this.cb = cb; }
      observe(el) { this.cb([{ isIntersecting: true, target: el }], this); }
      unobserve() {} disconnect() {}
    };
    window.HTMLCanvasElement.prototype.getContext = () => ({
      setTransform() {}, clearRect() {}, beginPath() {}, arc() {}, fill() {},
      moveTo() {}, lineTo() {}, stroke() {}
    });
    window.requestAnimationFrame = cb => setTimeout(() => cb(Date.now()), 0);
    window.scrollTo = () => {};
  }
});

const errors = [];
dom.window.addEventListener('error', e => errors.push(String(e.error || e.message)));

setTimeout(() => {
  const d = dom.window.document;
  const checks = [];
  const t = (name, cond, got) => checks.push({ name, ok: !!cond, got });

  t('无 JS 运行错误', errors.length === 0, errors.join(' | ') || '无');
  t('页面标题来自 content.js', d.title.includes('Alex Chen'), d.title);
  t('Hero 姓名', /Alex/.test(d.getElementById('heroName').textContent) && /Chen/.test(d.getElementById('heroName').textContent), d.getElementById('heroName').textContent.trim());
  t('Hero 副标题', d.getElementById('heroSub').textContent.length > 10, d.getElementById('heroSub').textContent.slice(0, 20) + '…');
  t('导航缩写', d.getElementById('brandInitials').textContent === 'AC', d.getElementById('brandInitials').textContent);
  t('关于段落 = 3 段', d.querySelectorAll('#aboutText p').length === 3, d.querySelectorAll('#aboutText p').length);
  t('关于加粗渲染', d.querySelectorAll('#aboutText strong').length >= 3, d.querySelectorAll('#aboutText strong').length);
  t('数据卡 = 3 张', d.querySelectorAll('#statsWrap .stat').length === 3, d.querySelectorAll('#statsWrap .stat').length);
  t('技能卡 = 3 组', d.querySelectorAll('#skillsGrid .skill-card').length === 3, d.querySelectorAll('#skillsGrid .skill-card').length);
  t('技能条 = 12 条', d.querySelectorAll('#skillsGrid .bar').length === 12, d.querySelectorAll('#skillsGrid .bar').length);
  t('技能条宽度变量', /--w:95%/.test(d.querySelector('#skillsGrid .bar i').getAttribute('style')), d.querySelector('#skillsGrid .bar i').getAttribute('style'));
  t('项目卡 = 4 个', d.querySelectorAll('#projectsGrid .project').length === 4, d.querySelectorAll('#projectsGrid .project').length);
  t('项目标签 = 13 个', d.querySelectorAll('#projectsGrid .tag').length === 13, d.querySelectorAll('#projectsGrid .tag').length);
  t('项目渐变变量', /--t1:#22d3ee/.test(d.querySelector('#projectsGrid .w-body').getAttribute('style')), d.querySelector('#projectsGrid .w-body').getAttribute('style'));
  t('空链接渲染为占位', d.querySelector('#projectsGrid .project-links a').getAttribute('href') === '#', d.querySelector('#projectsGrid .project-links a').getAttribute('href'));
  t('时间线 = 4 条', d.querySelectorAll('#timelineWrap .t-item').length === 4, d.querySelectorAll('#timelineWrap .t-item').length);
  t('社交图标 = 4 个', d.querySelectorAll('#socialsWrap .social').length === 4, d.querySelectorAll('#socialsWrap .social').length);
  t('邮箱自动 mailto', d.querySelectorAll('#socialsWrap .social')[1].getAttribute('href') === 'mailto:hello@alexchen.dev', d.querySelectorAll('#socialsWrap .social')[1].getAttribute('href'));
  t('联系邮箱显示', d.getElementById('contactEmail').textContent === 'hello@alexchen.dev', d.getElementById('contactEmail').textContent);
  t('页脚含姓名与年份', /Alex Chen/.test(d.getElementById('footerWrap').textContent) && new RegExp(String(new Date().getFullYear())).test(d.getElementById('footerWrap').textContent), d.getElementById('footerWrap').textContent.trim());
  t('数字滚动挂载', d.querySelectorAll('[data-count]').length === 3, d.querySelectorAll('[data-count]').length);

  let pass = 0;
  for (const c of checks) {
    console.log((c.ok ? 'PASS  ' : 'FAIL  ') + c.name + '  →  ' + c.got);
    if (c.ok) pass++;
  }
  console.log('\n结果: ' + pass + '/' + checks.length + ' 通过');
  process.exit(pass === checks.length ? 0 : 1);
}, 600);
