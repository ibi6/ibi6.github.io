/* Lightweight vanilla ports of ui-components-oss Switch / Toast / Drawer */
(function (global) {
  'use strict';

  var ICON = { success: '✓', error: '!', warn: '!', info: 'i' };

  function toastContainer() {
    var box = document.querySelector('.uic-toasts');
    if (!box) {
      box = document.createElement('div');
      box.className = 'uic-toasts';
      document.body.appendChild(box);
    }
    return box;
  }

  function toast(opts) {
    var o = typeof opts === 'string' ? { message: opts } : (opts || {});
    var type = o.type || 'info';
    var dur = o.duration == null ? 3200 : o.duration;
    var el = document.createElement('div');
    el.className = 'uic-toast uic-t-' + type;
    var urgent = type === 'error' || type === 'warn';
    el.setAttribute('role', urgent ? 'alert' : 'status');
    el.setAttribute('aria-live', urgent ? 'assertive' : 'polite');
    el.style.setProperty('--uic-dur', dur + 'ms');
    var ico = document.createElement('i');
    ico.className = 'uic-t-ico';
    ico.setAttribute('aria-hidden', 'true');
    ico.textContent = ICON[type] || 'i';
    var body = document.createElement('div');
    body.className = 'uic-t-body';
    if (o.title) {
      var b = document.createElement('b');
      b.textContent = o.title;
      body.appendChild(b);
    }
    if (o.message) {
      var s = document.createElement('span');
      s.textContent = o.message;
      body.appendChild(s);
    }
    el.appendChild(ico);
    el.appendChild(body);
    toastContainer().appendChild(el);
    var timer;
    var dismiss = function () {
      clearTimeout(timer);
      if (el.classList.contains('out')) return;
      el.classList.add('out');
      el.addEventListener('animationend', function () { el.remove(); });
      setTimeout(function () { if (el.parentNode) el.remove(); }, 400);
    };
    el.addEventListener('click', dismiss);
    if (dur > 0) timer = setTimeout(dismiss, dur);
    return dismiss;
  }
  toast.success = function (message, title) { return toast({ type: 'success', message: message, title: title }); };
  toast.error = function (message, title) { return toast({ type: 'error', message: message, title: title }); };
  toast.warn = function (message, title) { return toast({ type: 'warn', message: message, title: title }); };
  toast.info = function (message, title) { return toast({ type: 'info', message: message, title: title }); };

  function Switch(host, opts) {
    opts = opts || {};
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'uic-switch';
    b.setAttribute('role', 'switch');
    if (opts.disabled) b.disabled = true;
    if (opts.label) b.setAttribute('aria-label', opts.label);
    var knob = document.createElement('span');
    knob.className = 'uic-switch-knob';
    b.appendChild(knob);
    var api = {
      el: b,
      get checked() { return b.getAttribute('aria-checked') === 'true'; },
      set: function (v, emit) {
        b.setAttribute('aria-checked', String(!!v));
        if (emit && opts.onChange) opts.onChange(!!v);
      },
      destroy: function () { b.remove(); }
    };
    b.addEventListener('click', function () { api.set(!api.checked, true); });
    api.set(!!opts.checked, false);
    host.appendChild(b);
    return api;
  }

  function Drawer(opts) {
    opts = opts || {};
    var mask = document.createElement('div');
    mask.className = 'uic-drawer-mask' + (opts.side === 'left' ? '' : ' right');
    mask.hidden = true;
    mask.innerHTML =
      '<div class="uic-drawer" role="dialog" aria-modal="true">' +
        '<div class="uic-drawer-hd"><h3 class="uic-drawer-title"></h3>' +
        '<button type="button" class="uic-drawer-x" aria-label="关闭">×</button></div>' +
        '<div class="uic-drawer-bd"></div>' +
        '<div class="uic-drawer-ft"></div>' +
      '</div>';
    document.body.appendChild(mask);
    var titleEl = mask.querySelector('.uic-drawer-title');
    var bodyEl = mask.querySelector('.uic-drawer-bd');
    var footEl = mask.querySelector('.uic-drawer-ft');
    var closeBtn = mask.querySelector('.uic-drawer-x');
    var lastFocus = null;

    function close() {
      mask.classList.remove('on');
      setTimeout(function () { mask.hidden = true; }, 280);
      if (lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch (e) {}
      if (opts.onClose) opts.onClose();
    }
    function open(payload) {
      lastFocus = document.activeElement;
      payload = payload || {};
      titleEl.textContent = payload.title || '';
      bodyEl.innerHTML = payload.bodyHtml || '';
      footEl.innerHTML = payload.footerHtml || '';
      mask.hidden = false;
      requestAnimationFrame(function () { mask.classList.add('on'); });
      closeBtn.focus();
    }
    closeBtn.addEventListener('click', close);
    mask.addEventListener('click', function (e) { if (e.target === mask) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !mask.hidden) close();
    });
    return { open: open, close: close, el: mask, body: bodyEl, footer: footEl };
  }

  global.UIC = { toast: toast, Switch: Switch, Drawer: Drawer };
})(typeof window !== 'undefined' ? window : this);
