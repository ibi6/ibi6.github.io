/* =========================================================
 * gallery-dynamics.js
 * 精简移植自 ui-components-oss/js/main.js
 * 驱动个人站「组件实验室」：tilt / 流体按钮 / tabs / marquee / lab drawer
 * 依赖：可选 window.UIC.toast（来自 vendor/ui-kit.js）
 * ========================================================= */
(function (global) {
  'use strict';

  function qs(root, sel) { return root.querySelector(sel); }
  function qsa(root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }

  function initTilt(root) {
    var t = qs(root, '#labTilt');
    if (!t) return;
    var reduce = global.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    t.addEventListener('pointermove', function (e) {
      var r = t.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      var y = (e.clientY - r.top) / r.height;
      t.style.transform = 'rotateY(' + ((x - 0.5) * 16) + 'deg) rotateX(' + ((0.5 - y) * 16) + 'deg)';
      t.style.setProperty('--mx', (x * 100) + '%');
      t.style.setProperty('--my', (y * 100) + '%');
    });
    t.addEventListener('pointerleave', function () { t.style.transform = ''; });
  }

  function initFluidButtons(root) {
    qsa(root, '.btn').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.setProperty('--cx', (e.clientX - r.left) + 'px');
        b.style.setProperty('--cy', (e.clientY - r.top) + 'px');
      });
      b.addEventListener('click', function (e) {
        var r = b.getBoundingClientRect();
        var s = document.createElement('span');
        s.className = 'rip';
        s.style.left = (e.clientX - r.left) + 'px';
        s.style.top = (e.clientY - r.top) + 'px';
        b.appendChild(s);
        s.addEventListener('animationend', function () { s.remove(); });
      });
    });

    var sb = qs(root, '#labSubmit');
    var sl = qs(root, '#labSubmitLabel');
    if (sb && sl) {
      sb.addEventListener('click', function () {
        if (sb.classList.contains('busy') || sb.classList.contains('done')) return;
        sb.classList.add('busy');
        sl.textContent = '处理中';
        setTimeout(function () {
          sb.classList.replace('busy', 'done');
          sl.textContent = '已提交';
          setTimeout(function () {
            sb.classList.remove('done');
            sl.textContent = '提交订单';
          }, 1500);
        }, 1200);
      });
    }
  }

  function initTabs(root) {
    var panes = [
      '本周新增 128 位访客，停留时长比上周多了 12%。',
      '最近一次更新发生在 2 小时前，共 6 条记录。',
      '在这里管理账号、通知和隐私选项。'
    ];
    var tabHost = qs(root, '#labTabs');
    if (!tabHost) return;
    var tabs = qsa(tabHost, 'button[role="tab"]');
    var ind = qs(tabHost, '.ind');
    var pane = qs(root, '#labPane');
    if (!tabs.length || !ind || !pane) return;

    function place(i) {
      var b = tabs[i];
      if (!b) return;
      ind.style.width = b.offsetWidth + 'px';
      ind.style.transform = 'translateX(' + b.offsetLeft + 'px)';
    }
    function pick(i) {
      tabs.forEach(function (b, j) {
        b.setAttribute('aria-selected', j === i ? 'true' : 'false');
      });
      place(i);
      pane.style.animation = 'none';
      // force reflow
      void pane.offsetWidth;
      pane.style.animation = '';
      pane.textContent = panes[i] || '';
    }
    tabs.forEach(function (b, i) {
      b.addEventListener('click', function () { pick(i); });
    });
    global.addEventListener('resize', function () {
      var i = tabs.findIndex(function (b) { return b.getAttribute('aria-selected') === 'true'; });
      place(i < 0 ? 0 : i);
    });
    pick(0);
  }

  function initMarquee(root) {
    var mq = qs(root, '#labMq > div');
    if (!mq || mq.dataset.duped) return;
    mq.innerHTML += mq.innerHTML;
    mq.dataset.duped = '1';
  }

  function initToasts(root) {
    var UIC = global.UIC;
    qsa(root, '[data-lab-toast]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var type = btn.getAttribute('data-lab-toast') || 'info';
        var title = btn.getAttribute('data-lab-toast-title') || '通知';
        var msg = btn.getAttribute('data-lab-toast-msg') || '来自组件实验室';
        if (UIC && UIC.toast) {
          if (UIC.toast[type]) UIC.toast[type](msg, title);
          else UIC.toast({ type: type, message: msg, title: title });
        }
      });
    });
  }

  function initLabDrawer(root) {
    var mask = document.getElementById('labDrawerMask');
    var openL = qs(root, '#labOpenDrawer');
    var openR = qs(root, '#labOpenDrawerRight');
    if (!mask) return;

    function open(side) {
      mask.classList.toggle('right', side === 'right');
      mask.hidden = false;
      requestAnimationFrame(function () { mask.classList.add('on'); });
      var closeBtn = mask.querySelector('.uic-lab-drawer-x');
      if (closeBtn) closeBtn.focus();
    }
    function close() {
      mask.classList.remove('on');
      setTimeout(function () { mask.hidden = true; }, 280);
    }
    if (openL) openL.addEventListener('click', function () { open('left'); });
    if (openR) openR.addEventListener('click', function () { open('right'); });
    var x = mask.querySelector('.uic-lab-drawer-x');
    if (x) x.addEventListener('click', close);
    mask.querySelectorAll('[data-lab-drawer-close]').forEach(function (b) {
      b.addEventListener('click', close);
    });
    mask.addEventListener('click', function (e) { if (e.target === mask) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !mask.hidden) close();
    });
  }

  function initProjectTilt() {
    var reduce = global.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    var cards = document.querySelectorAll('#projectsGrid .project-card');
    cards.forEach(function (card) {
      card.classList.add('tilt-lite');
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        card.classList.add('is-tilting');
        card.style.transform = 'perspective(700px) rotateY(' + ((x - 0.5) * 6) + 'deg) rotateX(' + ((0.5 - y) * 6) + 'deg) translateY(-2px)';
        card.style.setProperty('--mx', (x * 100) + '%');
        card.style.setProperty('--my', (y * 100) + '%');
      });
      card.addEventListener('pointerleave', function () {
        card.classList.remove('is-tilting');
        card.style.transform = '';
      });
    });
  }

  function initHeroFluid() {
    /* 给 Hero 上的 .uic-btn 也挂一点流体光标感，不改结构 */
    document.querySelectorAll('#heroBtns .uic-btn').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.setProperty('--cx', (e.clientX - r.left) + 'px');
        b.style.setProperty('--cy', (e.clientY - r.top) + 'px');
      });
    });
  }

  function fillLabCopy(D) {
    var lab = (D && D.lab) || {};
    var title = document.getElementById('labTitle');
    var desc = document.getElementById('labDesc');
    var link = document.getElementById('labLibraryLink');
    if (title && lab.title) title.textContent = lab.title;
    if (desc && lab.desc) desc.textContent = lab.desc;
    if (link && lab.libraryUrl) link.href = lab.libraryUrl;
    var tiltTitle = document.getElementById('labTiltTitle');
    var tiltDesc = document.getElementById('labTiltDesc');
    if (tiltTitle && lab.tiltTitle) tiltTitle.textContent = lab.tiltTitle;
    if (tiltDesc && lab.tiltDesc) tiltDesc.textContent = lab.tiltDesc;
    var mq = document.querySelector('#labMq > div');
    if (mq && lab.marquee && lab.marquee.length) {
      mq.innerHTML = lab.marquee.map(function (s) {
        return '<span>' + String(s).replace(/[&<>"']/g, function (c) {
          return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
        }) + '</span>';
      }).join('');
      delete mq.dataset.duped;
    }
  }

  function init(opts) {
    opts = opts || {};
    var root = document.getElementById('lab');
    if (!root) return;
    if (opts.data) fillLabCopy(opts.data);
    initTilt(root);
    initFluidButtons(root);
    initTabs(root);
    initMarquee(root);
    initToasts(root);
    initLabDrawer(root);
    initProjectTilt();
    initHeroFluid();
  }

  global.UICGallery = { init: init };
})(typeof window !== 'undefined' ? window : this);
