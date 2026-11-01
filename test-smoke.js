/* 冒烟测试：jsdom 加载 index.html，验证 Hub 风格渲染（无 fullpage / 无粒子） */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const dir = __dirname;
const indexFile = path.join(dir, 'index.html');
const contentJs = fs.readFileSync(path.join(dir, 'content.js'), 'utf8');
let html = fs.readFileSync(indexFile, 'utf8');
html = html.replace(
  /<script\s+src="\.\/content\.js"><\/script>/i,
  '<script>' + contentJs + '</script>'
);

const dom = new JSDOM(html, {
  url: 'https://ibi6.github.io/',
  runScripts: 'dangerously',
  resources: 'usable',
  beforeParse(window) {
    window.matchMedia = window.matchMedia || (q => ({
      matches: false, media: q,
      addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}
    }));
    window.IntersectionObserver = class {
      constructor(cb) { this.cb = cb; }
      observe(el) { this.cb([{ isIntersecting: true, target: el, intersectionRatio: 1 }], this); }
      unobserve() {} disconnect() {}
    };
    window.requestAnimationFrame = cb => setTimeout(() => cb(Date.now()), 0);
    window.cancelAnimationFrame = id => clearTimeout(id);
    window.scrollTo = () => {};
    window.HTMLElement.prototype.scrollIntoView = function () {};
    const store = {
      _d: Object.create(null),
      getItem(k) { return Object.prototype.hasOwnProperty.call(this._d, k) ? this._d[k] : null; },
      setItem(k, v) { this._d[k] = String(v); },
      removeItem(k) { delete this._d[k]; },
      clear() { this._d = Object.create(null); },
      key(i) { return Object.keys(this._d)[i] ?? null; },
      get length() { return Object.keys(this._d).length; }
    };
    Object.defineProperty(window, 'localStorage', { value: store, configurable: true });
    Object.defineProperty(window, 'sessionStorage', { value: {
      _d: Object.create(null),
      getItem(k) { return Object.prototype.hasOwnProperty.call(this._d, k) ? this._d[k] : null; },
      setItem(k, v) { this._d[k] = String(v); },
      removeItem(k) { delete this._d[k]; },
      clear() { this._d = Object.create(null); },
      key(i) { return Object.keys(this._d)[i] ?? null; },
      get length() { return Object.keys(this._d).length; }
    }, configurable: true });
  }
});

const errors = [];
dom.window.addEventListener('error', e => errors.push(String(e.error || e.message)));

setTimeout(() => {
  const d = dom.window.document;
  const src = fs.readFileSync(indexFile, 'utf8');
  const checks = [];
  const t = (name, cond, got) => checks.push({ name, ok: !!cond, got });

  t('无 JS 运行错误', errors.length === 0, errors.join(' | ') || '无');
  t('页面标题来自 content.js', d.title.includes('Hang'), d.title);
  t('Hero 姓名含 Hang', /Hang/.test(d.getElementById('heroName').textContent), d.getElementById('heroName').textContent.trim());
  t('Hero 副标题/motto 非空', d.getElementById('heroSub').textContent.length > 6, d.getElementById('heroSub').textContent.slice(0, 24) + '…');
  t('品牌 logo 为 ibi6', /ibi6/.test(d.getElementById('brandName').textContent), d.getElementById('brandName').textContent.trim());
  t('主题切换按钮存在', !!d.getElementById('themeBtn'), 'themeBtn');
  t('Hub 分类卡 = 4', d.querySelectorAll('#hubGrid .grid-card').length === 4, d.querySelectorAll('#hubGrid .grid-card').length);
  t('关于段落 = 3 段', d.querySelectorAll('#aboutText p').length === 3, d.querySelectorAll('#aboutText p').length);
  t('关于加粗渲染', d.querySelectorAll('#aboutText strong').length >= 3, d.querySelectorAll('#aboutText strong').length);
  t('数据卡 = 3 张', d.querySelectorAll('#statsWrap .stat').length === 3, d.querySelectorAll('#statsWrap .stat').length);
  t('能力卡 = 4 组', d.querySelectorAll('#skillsGrid .skill-card').length === 4, d.querySelectorAll('#skillsGrid .skill-card').length);
  t('能力标签挂载', d.querySelectorAll('#skillsGrid .thing').length >= 12, d.querySelectorAll('#skillsGrid .thing').length);
  t('社交图标 >= 2 个', d.querySelectorAll('#socialsWrap .social').length >= 2, d.querySelectorAll('#socialsWrap .social').length);
  t('GitHub 链接直达', Array.from(d.querySelectorAll('#socialsWrap .social')).some(a => a.getAttribute('href') === 'https://github.com/ibi6'), 'github social present');
  t('联系区含 GitHub', /github\.com\/ibi6/.test(d.getElementById('socialsWrap').innerHTML), 'socials');
  t('无假邮箱', !/alexchen\.dev|yang92636@qq\.com/i.test(d.body.textContent), 'no fake email');
  t('项目卡 >= 6', d.querySelectorAll('#projectsGrid .project-card').length >= 6, d.querySelectorAll('#projectsGrid .project-card').length);
  t('推荐项 >= 6', d.querySelectorAll('#recommendsList .rec-item').length >= 6, d.querySelectorAll('#recommendsList .rec-item').length);
  t('导航含项目与推荐', Array.from(d.querySelectorAll('#navLinks a')).some(a => a.getAttribute('href')==='#projects') && Array.from(d.querySelectorAll('#navLinks a')).some(a => a.getAttribute('href')==='#recommends'), 'nav anchors');
  t('敏感仓库未展示', !/gpt-plus2|adobe|flow2api|ai-register-machine|fuck-your-ai|claude-zhuce|outlook-icloud|153-tilian|fast-pay/i.test(d.getElementById('projectsGrid').textContent), 'clean featured list');
  t('页脚含姓名与年份', /Hang/.test(d.getElementById('footerWrap').textContent) && new RegExp(String(new Date().getFullYear())).test(d.getElementById('footerWrap').textContent), d.getElementById('footerWrap').textContent.trim());
  t('数字滚动挂载', d.querySelectorAll('[data-count]').length === 3, d.querySelectorAll('[data-count]').length);
  t('.nojekyll 存在', fs.existsSync(path.join(dir, '.nojekyll')), 'yes');
  t('侧栏存在', !!d.getElementById('sidebar'), 'sidebar');
  t('打字机节点存在', !!d.getElementById('typewriter'), 'typewriter');

  t('已去掉 fullpage 轨道', !d.getElementById('fpTrack') && !d.getElementById('fpViewport'), 'no fp');
  t('已去掉粒子 canvas', !d.getElementById('heroCanvas') && !/heroCanvas/.test(src), 'no canvas');
  t('未锁定 fullpage 滚动', !d.documentElement.classList.contains('fp-lock') && !/fp-lock/.test(src), 'no fp-lock');
  t('源码无 fullpage/霓虹粒子', !/fullpage|heroCanvas|starfield|particle-field/i.test(src), 'clean source');

  let pass = 0;
  for (const c of checks) {
    console.log((c.ok ? 'PASS  ' : 'FAIL  ') + c.name + '  →  ' + c.got);
    if (c.ok) pass++;
  }
  console.log('\n结果: ' + pass + '/' + checks.length + ' 通过');
  process.exit(pass === checks.length ? 0 : 1);
}, 900);
