/* 冒烟：Hub SPA 多视图 + 组件实验室（ui-components-oss 动态移植） */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const dir = __dirname;
const indexFile = path.join(dir, 'index.html');
const contentJs = fs.readFileSync(path.join(dir, 'content.js'), 'utf8');
const uiKitJs = fs.readFileSync(path.join(dir, 'vendor', 'ui-kit.js'), 'utf8');
const uiKitCss = fs.readFileSync(path.join(dir, 'vendor', 'ui-kit.css'), 'utf8');
const galJs = fs.readFileSync(path.join(dir, 'vendor', 'gallery-dynamics.js'), 'utf8');
const galCss = fs.readFileSync(path.join(dir, 'vendor', 'gallery-dynamics.css'), 'utf8');
let html = fs.readFileSync(indexFile, 'utf8');
html = html
  .replace(/<link\s+rel="stylesheet"\s+href="\.\/vendor\/ui-kit\.css"\s*\/>/i, '<style>' + uiKitCss + '</style>')
  .replace(/<link\s+rel="stylesheet"\s+href="\.\/vendor\/gallery-dynamics\.css"\s*\/>/i, '<style>' + galCss + '</style>')
  .replace(/<script\s+src="\.\/vendor\/ui-kit\.js"><\/script>/i, '<script>' + uiKitJs + '</script>')
  .replace(/<script\s+src="\.\/vendor\/gallery-dynamics\.js"><\/script>/i, '<script>' + galJs + '</script>')
  .replace(/<script\s+src="\.\/content\.js"><\/script>/i, '<script>' + contentJs + '</script>');

const dom = new JSDOM(html, {
  url: 'https://ibi6.github.io/#/home',
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
    Object.defineProperty(window.navigator, 'clipboard', {
      value: { writeText: () => Promise.resolve() },
      configurable: true
    });
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
  t('品牌 logo 为 ibi6', /ibi6/.test(d.getElementById('brandName').textContent), d.getElementById('brandName').textContent.trim());
  t('UIC 主题 Switch 存在', !!d.querySelector('#themeSwitchHost .uic-switch'), 'uic-switch');
  t('搜索芯片存在', !!d.getElementById('searchChip'), 'searchChip');

  /* SPA views */
  t('视图容器 #views 存在', !!d.getElementById('views'), 'views');
  t('五视图齐全', ['home','lab','projects','recommends','about'].every(v => !!d.getElementById('view-' + v)), '5 views');
  t('首页视图默认激活', d.getElementById('view-home').classList.contains('active'), 'home active');
  t('导航含 hash 路由', Array.from(d.querySelectorAll('#navLinks a')).some(a => (a.getAttribute('href')||'').startsWith('#/')) , 'hash nav');
  t('导航含组件锚点', Array.from(d.querySelectorAll('#navLinks a')).some(a => a.getAttribute('href') === '#/lab'), 'lab nav');
  t('源码无 fullpage/粒子', !/fullpage|heroCanvas|starfield|fpTrack|fp-lock/i.test(src), 'no fullpage');

  /* switch to lab via hash */
  dom.window.location.hash = '#/lab';
  dom.window.dispatchEvent(new dom.window.Event('hashchange'));

  setTimeout(() => {
    t('切到实验室视图', d.getElementById('view-lab').classList.contains('active') && !d.getElementById('view-home').classList.contains('active'), 'lab active');
    t('实验室容器 #lab 存在', !!d.getElementById('lab'), 'lab');
    t('lab 带 uic-lab class', d.getElementById('lab').classList.contains('uic-lab'), 'uic-lab');
    t('tilt 演示根节点', !!d.getElementById('labTilt'), 'labTilt');
    t('流体按钮演示', !!d.getElementById('labSubmit') && d.querySelectorAll('#lab [data-lab-demo="buttons"] .btn').length >= 2, 'fluid btns');
    t('Toast 触发按钮', d.querySelectorAll('#lab [data-lab-toast]').length >= 3, d.querySelectorAll('#lab [data-lab-toast]').length);
    t('Switch 演示', d.querySelectorAll('#lab .sw').length >= 2, d.querySelectorAll('#lab .sw').length);
    t('Tabs 演示', !!d.getElementById('labTabs') && !!d.getElementById('labPane'), 'tabs');
    t('Drawer 打开按钮', !!d.getElementById('labOpenDrawer'), 'drawer btn');
    t('Marquee 演示', !!d.getElementById('labMq'), 'mq');
    t('demo 根节点 >= 5', d.querySelectorAll('#lab [data-lab-demo]').length >= 5, d.querySelectorAll('#lab [data-lab-demo]').length);
    t('vendor gallery css 存在', fs.existsSync(path.join(dir, 'vendor', 'gallery-dynamics.css')), 'css');
    t('vendor gallery js 存在', fs.existsSync(path.join(dir, 'vendor', 'gallery-dynamics.js')), 'js');
    t('源码引用 gallery-dynamics', /vendor\/gallery-dynamics\.css/.test(src) && /vendor\/gallery-dynamics\.js/.test(src), 'linked');
    t('content.js 含 lab 配置', /lab\s*:\s*\{/.test(contentJs) && /组件实验室/.test(contentJs), 'lab cfg');

    /* open lab drawer */
    const openBtn = d.getElementById('labOpenDrawer');
    if (openBtn) openBtn.click();

    setTimeout(() => {
      const mask = d.getElementById('labDrawerMask');
      t('实验室抽屉可打开', mask && mask.classList.contains('on'), mask && mask.className);

      /* toast */
      const toastBtn = d.querySelector('#lab [data-lab-toast="success"]');
      if (toastBtn) toastBtn.click();

      setTimeout(() => {
        t('Toast 可弹出', d.querySelectorAll('.uic-toast').length >= 1, d.querySelectorAll('.uic-toast').length);

        /* switch projects */
        dom.window.location.hash = '#/projects';
        dom.window.dispatchEvent(new dom.window.Event('hashchange'));

        setTimeout(() => {
          t('切到项目视图', d.getElementById('view-projects').classList.contains('active'), 'projects');
          t('Hub 分类卡 = 4', d.querySelectorAll('#hubGrid .grid-card').length === 4, d.querySelectorAll('#hubGrid .grid-card').length);
          t('关于段落 = 3 段', d.querySelectorAll('#aboutText p').length === 3, d.querySelectorAll('#aboutText p').length);
          t('关于加粗渲染', d.querySelectorAll('#aboutText strong').length >= 3, d.querySelectorAll('#aboutText strong').length);
          t('数据卡 = 3 张', d.querySelectorAll('#statsWrap .stat').length === 3, d.querySelectorAll('#statsWrap .stat').length);
          t('数字滚动挂载', d.querySelectorAll('[data-count]').length === 3, d.querySelectorAll('[data-count]').length);
          t('能力卡 = 4 组', d.querySelectorAll('#skillsGrid .skill-card').length === 4, d.querySelectorAll('#skillsGrid .skill-card').length);
          t('项目卡 >= 6', d.querySelectorAll('#projectsGrid .project-card').length >= 6, d.querySelectorAll('#projectsGrid .project-card').length);
          t('项目筛选存在', d.querySelectorAll('#projectFilter [data-filter]').length >= 4, d.querySelectorAll('#projectFilter [data-filter]').length);
          t('推荐项 >= 6', d.querySelectorAll('#recommendsList .rec-item').length >= 6, d.querySelectorAll('#recommendsList .rec-item').length);
          t('社交图标 >= 2 个', d.querySelectorAll('#socialsWrap .social').length >= 2, d.querySelectorAll('#socialsWrap .social').length);
          t('无假邮箱', !/alexchen\.dev|yang92636@qq\.com/i.test(d.body.textContent), 'no fake email');
          t('敏感仓库未展示', !/gpt-plus2|adobe|flow2api|ai-register-machine|fuck-your-ai|claude-zhuce|outlook-icloud|153-tilian|fast-pay/i.test(d.getElementById('projectsGrid').textContent), 'clean');
          t('页脚含姓名与年份', /Hang/.test(d.getElementById('footerWrap').textContent) && new RegExp(String(new Date().getFullYear())).test(d.getElementById('footerWrap').textContent), 'footer');
          t('侧栏存在', !!d.getElementById('sidebar'), 'sidebar');
          t('打字机节点存在', !!d.getElementById('typewriter'), 'typewriter');
          t('GitHub 头像或首字母', !!d.querySelector('#avatarWrap img') || !!d.getElementById('avatarLetter'), 'avatar');
          t('vendor/ui-kit 存在', fs.existsSync(path.join(dir, 'vendor', 'ui-kit.css')) && fs.existsSync(path.join(dir, 'vendor', 'ui-kit.js')), 'kit');
          t('.nojekyll 存在', fs.existsSync(path.join(dir, '.nojekyll')), 'yes');

          const firstCard = d.querySelector('#projectsGrid .project-card');
          if (firstCard) firstCard.click();
          t('项目抽屉打开', !!d.querySelector('.uic-drawer-mask.on') || (!!d.querySelector('.uic-drawer-mask') && !d.querySelector('.uic-drawer-mask').hidden), 'proj drawer');

          let pass = 0;
          for (const c of checks) {
            console.log((c.ok ? 'PASS  ' : 'FAIL  ') + c.name + '  →  ' + c.got);
            if (c.ok) pass++;
          }
          console.log('\n结果: ' + pass + '/' + checks.length + ' 通过');
          process.exit(pass === checks.length ? 0 : 1);
        }, 80);
      }, 100);
    }, 100);
  }, 80);
}, 1100);
