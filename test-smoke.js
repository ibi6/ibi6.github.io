/* 冒烟测试：用 jsdom 加载 index.html，验证 content.js 渲染结果 */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const dir = __dirname;
const indexFile = path.join(dir, 'index.html');

const fileUrl = require('url').pathToFileURL(indexFile).href;
const dom = new JSDOM(fs.readFileSync(indexFile, 'utf8'), {
  url: fileUrl,
  runScripts: 'dangerously',
  resources: 'usable',
  beforeParse(window) {
    window.matchMedia = window.matchMedia || (q => ({
      matches: false, media: q,
      addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}
    }));
    window.IntersectionObserver = class {
      constructor(cb) { this.cb = cb; }
      observe(el) { this.cb([{ isIntersecting: true, target: el }], this); }
      unobserve() {} disconnect() {}
    };
    window.requestAnimationFrame = cb => setTimeout(() => cb(Date.now()), 0);
    window.scrollTo = () => {};
    // canvas stub for particle hero
    const _getContext = window.HTMLCanvasElement && window.HTMLCanvasElement.prototype.getContext;
    if (window.HTMLCanvasElement) {
      window.HTMLCanvasElement.prototype.getContext = function (type) {
        if (type === '2d') {
          return {
            setTransform() {}, clearRect() {}, fillRect() {}, beginPath() {}, arc() {}, fill() {},
            moveTo() {}, lineTo() {}, stroke() {},
            createRadialGradient() { return { addColorStop() {} }; },
            fillStyle: '', strokeStyle: ''
          };
        }
        return _getContext ? _getContext.call(this, type) : null;
      };
    }
  }
});

const errors = [];
dom.window.addEventListener('error', e => errors.push(String(e.error || e.message)));

setTimeout(() => {
  const d = dom.window.document;
  const checks = [];
  const t = (name, cond, got) => checks.push({ name, ok: !!cond, got });

  t('无 JS 运行错误', errors.length === 0, errors.join(' | ') || '无');
  t('页面标题来自 content.js', d.title.includes('Hang'), d.title);
  t('Hero 姓名含 Hang', /Hang/.test(d.getElementById('heroName').textContent), d.getElementById('heroName').textContent.trim());
  t('Hero 副标题非空', d.getElementById('heroSub').textContent.length > 10, d.getElementById('heroSub').textContent.slice(0, 20) + '…');
  t('品牌 logo 为 ibi6', /ibi6/.test(d.getElementById('brandName').textContent), d.getElementById('brandName').textContent.trim());
  t('关于段落 = 3 段', d.querySelectorAll('#aboutText p').length === 3, d.querySelectorAll('#aboutText p').length);
  t('关于加粗渲染', d.querySelectorAll('#aboutText strong').length >= 3, d.querySelectorAll('#aboutText strong').length);
  t('数据卡 = 3 张', d.querySelectorAll('#statsWrap .stat').length === 3, d.querySelectorAll('#statsWrap .stat').length);
  t('能力卡 = 4 组', d.querySelectorAll('#skillsGrid .skill-card').length === 4, d.querySelectorAll('#skillsGrid .skill-card').length);
  t('能力标签挂载', d.querySelectorAll('#skillsGrid .thing').length >= 12, d.querySelectorAll('#skillsGrid .thing').length);
  t('社交图标 >= 2 个', d.querySelectorAll('#socialsWrap .social').length >= 2, d.querySelectorAll('#socialsWrap .social').length);
  t('GitHub 链接直达', Array.from(d.querySelectorAll('#socialsWrap .social')).some(a => a.getAttribute('href') === 'https://github.com/ibi6'), 'github social present');
  t('联系区含 GitHub', /github\.com\/ibi6/.test(d.getElementById('socialsWrap').innerHTML), 'socials');
  t('无假邮箱', !/alexchen\.dev/.test(d.body.textContent), 'no alexchen');
  t('项目卡 >= 6', d.querySelectorAll('#projectsGrid .project-card').length >= 6, d.querySelectorAll('#projectsGrid .project-card').length);
  t('推荐项 >= 6', d.querySelectorAll('#recommendsList .rec-item').length >= 6, d.querySelectorAll('#recommendsList .rec-item').length);
  t('导航含项目与推荐', Array.from(d.querySelectorAll('#navLinks a')).some(a => a.getAttribute('href')==='#projects') && Array.from(d.querySelectorAll('#navLinks a')).some(a => a.getAttribute('href')==='#recommends'), 'nav anchors');
  t('敏感仓库未展示', !/gpt-plus2|adobe|flow2api|ai-register-machine|fuck-your-ai|claude-zhuce|outlook-icloud|153-tilian|fast-pay/i.test(d.getElementById('projectsGrid').textContent), 'clean featured list');
  t('页脚含姓名与年份', /Hang/.test(d.getElementById('footerWrap').textContent) && new RegExp(String(new Date().getFullYear())).test(d.getElementById('footerWrap').textContent), d.getElementById('footerWrap').textContent.trim());
  t('数字滚动挂载', d.querySelectorAll('[data-count]').length === 3, d.querySelectorAll('[data-count]').length);
  t('暗色沉浸 Hero canvas', !!d.getElementById('heroCanvas'), 'canvas present');
  t('滚动进度条', !!d.getElementById('scrollProgress'), 'progress present');
  t('.nojekyll 存在', fs.existsSync(path.join(dir, '.nojekyll')), 'yes');

  let pass = 0;
  for (const c of checks) {
    console.log((c.ok ? 'PASS  ' : 'FAIL  ') + c.name + '  →  ' + c.got);
    if (c.ok) pass++;
  }
  console.log('\n结果: ' + pass + '/' + checks.length + ' 通过');
  process.exit(pass === checks.length ? 0 : 1);
}, 800);
