(() => {
  const D = window.SITE_DATA, NOTES = window.SITE_NOTES || [];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const cssVar = n => getComputedStyle(root).getPropertyValue(n).trim();
  const LANG = { TypeScript: '#3178c6', JavaScript: '#f1e05a', CSS: '#a06bff', HTML: '#e34c26', Vue: '#41b883', Python: '#4b8bbe', Java: '#b07219', Dockerfile: '#5b7c8a', PowerShell: '#2f6fb3' };
  const langColor = n => LANG[n] || '#8a93a3';
  let onTheme = () => {};

  /* ---------- 主题 ---------- */
  function toggleTheme() {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('hang-theme-v2', root.dataset.theme); } catch (e) {}
    onTheme();
  }
  $('#theme').addEventListener('click', toggleTheme);

  /* ---------- 进入视口时出现 ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('on');
    if (e.target._enter) e.target._enter();
    io.unobserve(e.target);
  }), { threshold: 0.15 });
  const watch = el => io.observe(el);

  function countUp(el, to) {
    if (reduce) { el.textContent = to; return; }
    const t0 = performance.now();
    (function tick(now) {
      const p = clamp((now - t0) / 1400, 0, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  /* ---------- 首屏：名字、打字机 ---------- */
  $$('.name span').forEach((s, i) => s.style.setProperty('--i', i));
  const latest = [...D.repos].sort((a, b) => b.pushed.localeCompare(a.pushed))[0];
  const phrases = [`@${D.user.login}`, `最近推送：${latest.name} · ${latest.pushed}`, `过去一年 ${D.calendar.total} 次贡献`];
  const typed = $('#typed');
  if (reduce) typed.textContent = phrases[0];
  else (function type(pi, ci, del) {
    const s = phrases[pi];
    typed.textContent = s.slice(0, ci);
    let wait = del ? 28 : 62;
    if (!del && ci === s.length) { del = true; wait = 2200; }
    else if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; wait = 350; }
    else ci += del ? -1 : 1;
    setTimeout(() => type(pi, ci, del), wait);
  })(0, 0, false);

  /* ---------- 导航胶囊 ---------- */
  const links = $$('#links a'), pill = $('#pill');
  let activeLink = null;
  function movePill(a) {
    if (!a) { pill.style.opacity = 0; return; }
    pill.style.opacity = 1;
    pill.style.width = a.offsetWidth + 'px';
    pill.style.transform = `translateX(${a.offsetLeft}px)`;
  }
  links.forEach(a => a.addEventListener('pointerenter', () => movePill(a)));
  $('#links').addEventListener('pointerleave', () => movePill(activeLink));
  function setActive(id) {
    const a = links.find(l => l.dataset.sec === id) || null;
    if (a === activeLink) return;
    activeLink = a;
    links.forEach(l => l.classList.toggle('on', l === a));
    if (!$('#links').matches(':hover')) movePill(a);
  }

  /* ---------- 磁吸按钮 ---------- */
  if (fine && !reduce) $$('[data-mag]').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.3}px,${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
    });
    el.addEventListener('pointerleave', () => el.style.transform = '');
  });

  /* ---------- 贡献数据（城市和热力图共用） ---------- */
  const counts = D.calendar.counts, maxCount = Math.max(1, ...counts);
  const level = n => n === 0 ? 0 : clamp(Math.ceil(n / maxCount * 4), 1, 4);
  const startMs = Date.parse(D.calendar.start + 'T00:00:00Z');
  const dateAt = i => new Date(startMs + i * 864e5).toISOString().slice(0, 10);
  const startDow = new Date(startMs).getUTCDay();          // 第一天是星期几，决定第一列从第几行开始

  /* ---------- 首屏：贡献城市（等距投影） ---------- */
  const city = (() => {
    const cv = $('#city'), ctx = cv.getContext('2d'), hero = $('#hero'), cap = $('#cityCap');
    const capDefault = '每栋楼是一天 · 过去一年的 GitHub 贡献';
    cap.textContent = capDefault;
    const B = counts.map((n, i) => {
      const k = i + startDow;
      return { i, n, c: Math.floor(k / 7), r: k % 7, hov: 0 };
    });
    const cols = B[B.length - 1].c + 1;
    const order = [...B].sort((a, b) => (a.c + a.r) - (b.c + b.r) || a.c - b.c);
    let w = 0, h = 0, dpr = 1, tw = 0, th = 0, x0 = 0, y0 = 0, maxH = 0, pal = [], accent = '', visible = true, t0 = null, hover = null, mx = -1, my = -1;

    const shade = (hex, f) => {
      const v = parseInt(hex.slice(1), 16);
      return `rgb(${Math.round((v >> 16 & 255) * f)},${Math.round((v >> 8 & 255) * f)},${Math.round((v & 255) * f)})`;
    };
    function colors() {
      pal = [0, 1, 2, 3, 4].map(l => cssVar('--h' + l));
      accent = cssVar('--warm');
    }
    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = hero.clientWidth; h = hero.clientHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      const wide = w > 900;
      const avail = wide ? w * 0.66 : w * 1.25;
      tw = avail * 2 / (cols + 7); th = tw / 2; maxH = tw * 3.4;
      const cx = wide ? w * 0.64 : w * 0.5, cy = wide ? h * 0.54 : h * 0.4;
      x0 = cx - (cols - 7) * tw / 4; y0 = cy - (cols + 5) * th / 4;
      if (reduce) draw(1e9);
    }
    const heightOf = b => b.n ? tw * 0.25 + (b.n / maxCount) * maxH : tw * 0.06;
    const ease = p => 1 - Math.pow(1 - p, 4);

    function draw(now) {
      if (t0 === null) t0 = now;
      const t = (now - t0) / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (const b of order) {
        b.hov += ((b === hover ? 1 : 0) - b.hov) * 0.2;
        const g = reduce ? 1 : ease(clamp((t - (b.c + b.r) * 0.022) / 0.9, 0, 1));
        if (g <= 0) continue;
        const sx = x0 + (b.c - b.r) * tw / 2, sy = y0 + (b.c + b.r) * th / 2;
        const wave = reduce ? 0 : Math.max(0, Math.sin(t * 0.9 - (b.c + b.r) * 0.16)) ** 8;
        const bh = heightOf(b) * g + b.hov * tw * 0.9 + (b.n ? wave * tw * 0.18 : 0);
        const base = b.hov > 0.02 ? accent : pal[level(b.n)];
        const top = sy - bh, hw = tw / 2 - 0.6, hh = th / 2 - 0.3;
        // 左侧面
        ctx.fillStyle = shade(base, 0.62);
        ctx.beginPath(); ctx.moveTo(sx - hw, top + hh); ctx.lineTo(sx, top + hh * 2); ctx.lineTo(sx, sy + hh * 2); ctx.lineTo(sx - hw, sy + hh); ctx.closePath(); ctx.fill();
        // 右侧面
        ctx.fillStyle = shade(base, 0.42);
        ctx.beginPath(); ctx.moveTo(sx + hw, top + hh); ctx.lineTo(sx, top + hh * 2); ctx.lineTo(sx, sy + hh * 2); ctx.lineTo(sx + hw, sy + hh); ctx.closePath(); ctx.fill();
        // 顶面
        ctx.fillStyle = shade(base, 1);
        ctx.beginPath(); ctx.moveTo(sx, top); ctx.lineTo(sx + hw, top + hh); ctx.lineTo(sx, top + hh * 2); ctx.lineTo(sx - hw, top + hh); ctx.closePath(); ctx.fill();
        b._sx = sx; b._top = top; b._bot = sy + th;
      }
    }
    function pick() {
      for (let k = order.length - 1; k >= 0; k--) {
        const b = order[k];
        if (b._sx === undefined) continue;
        if (Math.abs(mx - b._sx) <= tw / 2 && my >= b._top && my <= b._bot) return b;
      }
      return null;
    }
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
      const b = pick();
      if (b === hover) return;
      hover = b;
      cap.innerHTML = b ? `${dateAt(b.i)} · <b>${b.n}</b> 次贡献` : esc(capDefault);
    });
    hero.addEventListener('pointerleave', () => { hover = null; cap.textContent = capDefault; });
    new IntersectionObserver(es => visible = es[0].isIntersecting).observe(hero);
    addEventListener('resize', resize);
    colors(); resize();
    return { resize, frame: now => { if (visible && !reduce) draw(now); }, recolor: () => { colors(); if (reduce) draw(1e9); }, count: B.length };
  })();

  /* ---------- 项目 ---------- */
  // 每个项目一张会动的线稿；没有专门画的就用通用那张
  const S = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  const ART = {
    'ui-components-oss': () => `<g class="draw" ${S}><rect x="40" y="34" width="150" height="112" rx="12"/><rect x="210" y="34" width="70" height="50" rx="10" style="--t:.15s"/><rect x="210" y="96" width="70" height="50" rx="10" style="--t:.3s"/><line x1="58" y1="62" x2="130" y2="62" style="--t:.4s"/><line x1="58" y1="82" x2="170" y2="82" style="--t:.5s"/><rect x="58" y="104" width="62" height="24" rx="12" style="--t:.6s"/></g>
      <circle class="float" cx="245" cy="59" r="9" fill="var(--acc)"/><rect class="float" style="--t:.8s" x="226" y="114" width="38" height="14" rx="7" fill="var(--warm)"/>`,
    'helix-clinic': () => `<g class="draw" ${S}><polyline style="--len:700" points="24,96 86,96 104,58 124,132 146,74 164,96 214,96 228,80 242,96 296,96"/><rect x="128" y="20" width="64" height="26" rx="13" style="--t:.5s"/></g>
      <path class="float" d="M154 33h12M160 27v12" stroke="var(--acc)" stroke-width="3" stroke-linecap="round"/><circle class="blinker" cx="296" cy="96" r="5" fill="var(--warm)"/>`,
    'smart-building-pol': () => `<g fill="var(--acc)">${[0, 1, 2, 3, 4, 5].map(i => `<rect class="pop" style="--t:${i * 0.09}s" x="${48 + i * 38}" y="${150 - [56, 96, 72, 118, 84, 104][i]}" width="26" height="${[56, 96, 72, 118, 84, 104][i]}" rx="4" opacity="${0.35 + i * 0.1}"/>`).join('')}</g>
      <g class="draw" ${S}><polyline style="--len:520;--t:.6s" points="30,40 100,24 170,44 240,20 296,36"/><line x1="24" y1="150" x2="296" y2="150"/></g>
      ${[100, 170, 240].map((x, i) => `<circle class="blinker" style="--t:${i * 0.4}s" cx="${x}" cy="${[24, 44, 20][i]}" r="4.5" fill="var(--warm)"/>`).join('')}`,
    'netinspect': () => `<g class="draw" ${S}><line x1="160" y1="90" x2="70" y2="44"/><line x1="160" y1="90" x2="252" y2="42" style="--t:.1s"/><line x1="160" y1="90" x2="60" y2="134" style="--t:.2s"/><line x1="160" y1="90" x2="258" y2="136" style="--t:.3s"/><circle cx="160" cy="90" r="22" style="--t:.4s"/></g>
      ${[[70, 44], [252, 42], [60, 134], [258, 136]].map((p, i) => `<circle class="blinker" style="--t:${i * 0.35}s" cx="${p[0]}" cy="${p[1]}" r="9" fill="${i === 2 ? 'var(--warm)' : 'var(--acc)'}"/>`).join('')}
      <circle cx="160" cy="90" r="7" fill="var(--acc)"/>`,
    'video-vault': () => `<g class="draw" ${S}><rect x="54" y="30" width="212" height="120" rx="14"/><line x1="54" y1="56" x2="266" y2="56" style="--t:.2s"/><line x1="54" y1="124" x2="266" y2="124" style="--t:.3s"/>${[80, 120, 160, 200, 240].map(x => `<line x1="${x}" y1="38" x2="${x}" y2="48" style="--t:.4s"/><line x1="${x}" y1="132" x2="${x}" y2="142" style="--t:.4s"/>`).join('')}</g>
      <path class="float" d="M146 72l34 18-34 18z" fill="var(--acc)"/>`,
    'ibi6.github.io': () => `<g class="draw" ${S}><rect x="36" y="26" width="248" height="128" rx="12"/><line x1="36" y1="52" x2="284" y2="52" style="--t:.2s"/><line x1="60" y1="84" x2="170" y2="84" style="--t:.4s"/><line x1="60" y1="104" x2="230" y2="104" style="--t:.5s"/><line x1="60" y1="124" x2="140" y2="124" style="--t:.6s"/></g>
      ${[52, 66, 80].map((x, i) => `<circle cx="${x}" cy="39" r="4" fill="${['var(--warm)', 'var(--acc)', 'var(--mut)'][i]}"/>`).join('')}<rect class="blinker" x="146" y="116" width="8" height="16" fill="var(--acc)"/>`,
  };
  const genericArt = () => `<g class="draw" ${S}><rect x="60" y="34" width="200" height="112" rx="14"/><line x1="84" y1="70" x2="200" y2="70" style="--t:.3s"/><line x1="84" y1="94" x2="236" y2="94" style="--t:.4s"/></g>`;

  const projList = $('#projList'), projView = $('#projView');
  $('#projSub').textContent = `${D.repos.length} 个公开仓库 · 鼠标滑过切换`;
  let curProj = -1, hoverLock = 0;   // 命令面板跳转后短暂忽略悬停，免得滚动时鼠标碰巧压到别的行
  function showProj(i) {
    if (i === curProj) return;
    curProj = i;
    const r = D.repos[i];
    $$('.proj', projList).forEach((b, k) => { b.classList.toggle('on', k === i); b.setAttribute('aria-pressed', k === i); });
    const tot = Object.values(r.langs).reduce((a, b) => a + b, 0);
    const bar = tot ? Object.entries(r.langs).sort((a, b) => b[1] - a[1]).map(([n, v], k) =>
      `<i title="${esc(n)} ${(v / tot * 100).toFixed(1)}%" style="width:${v / tot * 100}%;background:${langColor(n)};animation-delay:${k * 0.08}s"></i>`).join('') : '';
    const top = tot ? Object.entries(r.langs).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([n]) => n).join(' · ') : '';
    projView.innerHTML = `<div class="pv-art"><svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${(ART[r.name] || genericArt)()}</svg></div>
      <div class="pv-body pv-in"><h3>${esc(r.name)}</h3><p>${esc(r.desc)}</p>
      ${bar ? `<div class="pv-bar">${bar}</div>` : ''}
      <div class="pv-meta">${top ? `<span>${esc(top)}</span>` : ''}<span>★ <b>${r.stars}</b></span><span>分叉 <b>${r.forks}</b></span><span>最近推送 <b>${esc(r.pushed)}</b></span></div>
      <div class="pv-links"><a href="${esc(r.url)}" target="_blank" rel="noopener">源码 ↗</a>${r.home ? `<a href="${esc(r.home)}" target="_blank" rel="noopener">在线演示 ↗</a>` : ''}</div></div>`;
  }
  function renderProjects() {
    projList.innerHTML = D.repos.map((r, i) => `<li class="rv" style="--d:${i * 0.06}s"><button class="proj" data-i="${i}">
      <n>${String(i + 1).padStart(2, '0')}</n><h3>${esc(r.name)}</h3><em>${esc(r.lang || '—')}${r.stars ? ` · ★ ${r.stars}` : ''}</em></button></li>`).join('');
    $$('.proj', projList).forEach(b => {
      const i = +b.dataset.i;
      b.addEventListener('pointerenter', () => { if (performance.now() > hoverLock) showProj(i); });
      b.addEventListener('focus', () => showProj(i));
      b.addEventListener('click', () => {
        showProj(i);
        if (innerWidth <= 900) projView.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
      });
    });
    $$('li', projList).forEach(watch);
    curProj = -1; showProj(0);
  }
  renderProjects();

  /* ---------- GitHub ---------- */
  $('#ghLink').textContent = '@' + D.user.login;
  $('#ghSub').textContent = `数据快照 ${D.snapshot}`;
  $('#snap').textContent = `GitHub 数据快照 ${D.snapshot}`;
  let streak = 0, run = 0, activeDays = 0;
  for (const n of counts) { if (n) { run++; activeDays++; streak = Math.max(streak, run); } else run = 0; }
  const statEls = {};
  function renderStats() {
    const stars = D.repos.reduce((a, r) => a + r.stars, 0);
    const items = [['contrib', D.calendar.total, '过去一年的贡献'], ['days', activeDays, '有提交的天数'], ['streak', streak, '最长连续天数'], ['stars', stars, '这几个仓库的星标']];
    $('#ghStats').innerHTML = items.map(([k, v, l], i) => `<div class="stat rv" style="--d:${i * 0.07}s"><b data-k="${k}" data-v="${v}">0</b><span>${l}</span></div>`).join('');
    $$('#ghStats .stat').forEach(el => {
      const b = $('b', el); statEls[b.dataset.k] = b;
      el._enter = () => countUp(b, +b.dataset.v);
      watch(el);
    });
  }
  renderStats();

  const heat = $('#heat'), heatTip = $('#heatTip');
  $('#heatTitle').textContent = `过去一年 ${D.calendar.total} 次贡献`;
  heat.innerHTML = '<i class="pad"></i>'.repeat(startDow) + counts.map((n, i) => {
    const col = Math.floor((i + startDow) / 7);
    return `<i data-l="${level(n)}" data-i="${i}" style="--dl:${(col * 0.012).toFixed(3)}s"></i>`;
  }).join('');
  heat.addEventListener('pointerover', e => {
    const i = e.target.dataset.i;
    if (i !== undefined) heatTip.textContent = `${dateAt(+i)} · ${counts[+i]} 次贡献`;
  });
  heat.addEventListener('pointerleave', () => heatTip.textContent = '把鼠标放到格子上');
  watch(heat);

  function renderLangs() {
    const sum = {};
    for (const r of D.repos) for (const [n, v] of Object.entries(r.langs)) sum[n] = (sum[n] || 0) + v;
    const tot = Object.values(sum).reduce((a, b) => a + b, 0) || 1;
    const list = Object.entries(sum).sort((a, b) => b[1] - a[1]);
    const bar = $('#langBar');
    bar.innerHTML = list.map(([n, v], i) => `<i data-w="${v / tot * 100}" title="${esc(n)}" style="background:${langColor(n)};--dl:${i * 0.07}s"></i>`).join('');
    $('#langKey').innerHTML = list.filter(([, v]) => v / tot >= 0.005).map(([n, v]) => `<li><i style="background:${langColor(n)}"></i>${esc(n)} <b>${(v / tot * 100).toFixed(1)}%</b></li>`).join('');
    bar._enter = () => $$('i', bar).forEach(i => i.style.width = i.dataset.w + '%');
    watch(bar);
  }
  renderLangs();

  // 仓库、语言与贡献日历使用同一次构建的数据，避免各个区域更新时间不一致。
  const syncLabel = D.syncedAt ? new Date(D.syncedAt).toLocaleString('zh-CN', {hour12:false}) : D.snapshot;
  $('#ghSub').textContent = 'GitHub 同步于 ' + syncLabel;
  $('#snap').textContent = 'GitHub 同步于 ' + syncLabel;

  /* ---------- 笔记 ---------- */
  function inline(s) {
    return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }
  function md(src) {
    const out = [], lines = src.split('\n');
    let i = 0, n = 0;
    const push = h => out.push(h.replace(/^<(\w+)/, `<$1 style="--n:${n++}"`));
    while (i < lines.length) {
      const l = lines[i];
      if (l.startsWith('```')) {
        const buf = []; i++;
        while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++]);
        i++; push(`<pre><code>${esc(buf.join('\n'))}</code></pre>`);
      } else if (/^#{1,3}\s/.test(l)) { push(`<h3>${inline(l.replace(/^#+\s/, ''))}</h3>`); i++; }
      else if (/^[-*]\s/.test(l)) {
        const items = [];
        while (i < lines.length && /^[-*]\s/.test(lines[i])) items.push(`<li>${inline(lines[i++].slice(2))}</li>`);
        push(`<ul>${items.join('')}</ul>`);
      } else if (!l.trim()) i++;
      else {
        const buf = [];
        while (i < lines.length && lines[i].trim() && !/^(```|#{1,3}\s|[-*]\s)/.test(lines[i])) buf.push(lines[i++]);
        push(`<p>${inline(buf.join(' '))}</p>`);
      }
    }
    return out.join('');
  }

  const noteGrid = $('#noteGrid'), tagsEl = $('#tags');
  const allTags = [...new Set(NOTES.flatMap(n => n.tags))];
  tagsEl.innerHTML = ['全部', ...allTags].map((t, i) => `<button class="tag${i ? '' : ' on'}" data-t="${i ? esc(t) : ''}">${esc(t)}</button>`).join('');
  noteGrid.innerHTML = NOTES.length ? NOTES.map((n, i) => `<button class="note rv" data-slug="${esc(n.slug)}" style="--d:${(i % 2) * 0.08}s">
    <time>${esc(n.date)}</time><h3>${esc(n.title)}</h3><p>${esc(n.summary)}</p>
    <footer>${n.tags.map(t => `<u>${esc(t)}</u>`).join('')}<span>约 ${n.minutes} 分钟</span><i>↗</i></footer></button>`).join('')
    : '<p style="color:var(--mut)">还没有笔记。</p>';
  $$('.note', noteGrid).forEach(el => {
    watch(el);
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) / r.width * 100 + '%');
      el.style.setProperty('--my', (e.clientY - r.top) / r.height * 100 + '%');
    });
    el.addEventListener('click', () => openNote(el.dataset.slug));
  });
  tagsEl.addEventListener('click', e => {
    const b = e.target.closest('.tag'); if (!b) return;
    $$('.tag', tagsEl).forEach(x => x.classList.toggle('on', x === b));
    let k = 0;
    $$('.note', noteGrid).forEach(el => {
      const n = NOTES.find(x => x.slug === el.dataset.slug);
      const show = !b.dataset.t || n.tags.includes(b.dataset.t);
      el.classList.toggle('hide', !show);
      el.classList.remove('in');
      if (show) { el.classList.add('on'); void el.offsetWidth; el.style.setProperty('--dl', k++ * 0.06 + 's'); el.classList.add('in'); }
    });
  });

  /* ---------- 弹层通用：打开、关闭、还原焦点 ---------- */
  let openLayer = null, lastFocus = null;
  function show(el, focusEl) {
    if (openLayer) hide(openLayer, true);
    lastFocus = document.activeElement;
    el.hidden = false; el.classList.remove('out');
    document.body.classList.add('lock');
    openLayer = el;
    if (focusEl) focusEl.focus();
  }
  function hide(el, instant) {
    if (el.hidden) return;
    if (openLayer === el) openLayer = null;
    const done = () => { el.hidden = true; el.classList.remove('out'); };
    if (instant || reduce) done();
    else { el.classList.add('out'); setTimeout(done, 340); }
    if (!openLayer) document.body.classList.remove('lock');
    if (!instant && lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $$('[data-close]').forEach(b => b.addEventListener('click', () => hide(b.closest('.reader, .cmd'))));

  /* ---------- 笔记阅读器 ---------- */
  const reader = $('#reader'), rScroll = $('#rScroll'), rBar = $('#rBar');
  function openNote(slug) {
    const n = NOTES.find(x => x.slug === slug); if (!n) return;
    $('#rMeta').textContent = `${n.date} · ${n.tags.join(' / ')} · 约 ${n.minutes} 分钟`;
    $('#rTitle').textContent = n.title;
    $('#rBody').innerHTML = md(n.body);
    rBar.style.transform = 'scaleX(0)';
    show(reader, $('.x', reader));
    rScroll.scrollTop = 0;
  }
  rScroll.addEventListener('scroll', () => {
    const max = rScroll.scrollHeight - rScroll.clientHeight;
    rBar.style.transform = `scaleX(${max > 0 ? rScroll.scrollTop / max : 1})`;
  });

  /* ---------- 命令面板 ---------- */
  const cmd = $('#cmd'), cmdIn = $('#cmdIn'), cmdList = $('#cmdList');
  const go = id => () => navigate(id);
  const ITEMS = [
    ...[['projects', '项目'], ['github', 'GitHub'], ['notes', '笔记'], ['contact', '联系']].map(([id, t]) => ({ kind: '跳转', title: t, hint: '', run: go(id) })),
    ...D.repos.map((r, i) => ({ kind: '项目', title: r.name, hint: r.lang, key: r.desc, run: () => { hoverLock = performance.now() + 1500; go('projects')(); showProj(i); } })),
    ...NOTES.map(n => ({ kind: '笔记', title: n.title, hint: n.date, key: n.tags.join(' ') + ' ' + n.summary, run: () => openNote(n.slug) })),
    { kind: '操作', title: '切换明暗主题', hint: '', key: 'theme dark light', run: toggleTheme },
    { kind: '操作', title: '打开 GitHub 主页', hint: '@' + D.user.login, key: 'github profile', run: () => window.open(D.user.url, '_blank', 'noopener') },
  ];
  // 按顺序匹配每个字符，连续命中加分；匹配不上返回 -1
  function score(q, s) {
    s = s.toLowerCase();
    let i = 0, pts = 0, streakLen = 0;
    for (let k = 0; k < s.length && i < q.length; k++) {
      if (s[k] === q[i]) { i++; streakLen++; pts += streakLen * 2 + (k === 0 ? 3 : 0); } else streakLen = 0;
    }
    return i === q.length ? pts : -1;
  }
  let results = [], sel = 0;
  function renderCmd() {
    const q = cmdIn.value.trim().toLowerCase();
    results = !q ? ITEMS : ITEMS.map(it => {
      const a = score(q, it.title), b = it.key ? score(q, it.key) : -1;
      return { it, s: Math.max(a >= 0 ? a + 10 : -1, b) };
    }).filter(x => x.s >= 0).sort((a, b) => b.s - a.s).map(x => x.it);
    sel = clamp(sel, 0, Math.max(0, results.length - 1));
    cmdList.innerHTML = results.length ? results.map((it, i) =>
      `<li data-i="${i}" class="${i === sel ? 'sel' : ''}"><u>${esc(it.kind)}</u><span>${esc(it.title)}</span><em>${esc(it.hint || '')}</em></li>`).join('')
      : '<li class="none">没找到，换个词试试</li>';
    const s = $('.sel', cmdList); if (s) s.scrollIntoView({ block: 'nearest' });
  }
  function openCmd() { cmdIn.value = ''; sel = 0; renderCmd(); show(cmd, cmdIn); }
  function runSel() {
    const it = results[sel]; if (!it) return;
    hide(cmd, true); document.body.classList.remove('lock');
    it.run();
  }
  $('#openCmd').addEventListener('click', openCmd);
  cmdIn.addEventListener('input', () => { sel = 0; renderCmd(); });
  cmdList.addEventListener('click', e => { const li = e.target.closest('li[data-i]'); if (li) { sel = +li.dataset.i; runSel(); } });
  cmdList.addEventListener('pointermove', e => {
    const li = e.target.closest('li[data-i]');
    if (li && +li.dataset.i !== sel) { sel = +li.dataset.i; $$('li', cmdList).forEach((x, i) => x.classList.toggle('sel', i === sel)); }
  });
  addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); cmd.hidden ? openCmd() : hide(cmd); return; }
    if (e.key === 'Escape' && openLayer) { hide(openLayer); return; }
    if (cmd.hidden) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length) { sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length; renderCmd(); }
    } else if (e.key === 'Enter') { e.preventDefault(); runSel(); }
  });

  /* ---------- 入场、时钟 ---------- */
  $$('.rv').forEach(watch);
  const clock = $('#clock');
  const tick = () => clock.textContent = new Date().toLocaleTimeString('zh-CN', { hour12: false });
  tick(); setInterval(tick, 1000);
  onTheme = () => city.recolor();

  /* ---------- 独立页面路由 ---------- */
  const views = {home:$('#homePage'),projects:$('#projects'),github:$('#github'),notes:$('#notes'),contact:$('#contact')};
  let currentPage = '';
  function renderRoute() {
    let id = location.hash.slice(1) || 'home';
    if (id === 'top') id = 'home';
    if (!views[id]) id = 'home';
    if (id === currentPage) return;
    currentPage = id;
    for (const [key, el] of Object.entries(views)) {
      el.hidden = key !== id;
      el.classList.remove('page-enter');
    }
    const el=views[id];
    void el.offsetWidth;
    el.classList.add('page-enter');
    scrollTo({top:0,behavior:'instant'});
    setActive(id);
    movePill(activeLink);
    document.title = ({home:'首页',projects:'项目',github:'GitHub',notes:'笔记',contact:'联系'}[id])+' · Hang';
    document.body.dataset.page=id;
    if(id==='home') city.resize();
  }
  function navigate(id) {
    if(id==='top')id='home';
    if(!views[id])return;
    if(location.hash==='#'+id)renderRoute();
    else {location.hash=id; renderRoute();}
  }
  document.addEventListener('click', e => {
    const a=e.target.closest('a[href^="#"]');
    if(!a)return;
    const id=a.getAttribute('href').slice(1);
    if(views[id]||id==='top') {e.preventDefault();navigate(id);}
  });
  addEventListener('hashchange', renderRoute);
  addEventListener('resize', ()=>movePill(activeLink));
  renderRoute();
  function loop(now) { if(currentPage==='home')city.frame(now); requestAnimationFrame(loop); }
  requestAnimationFrame(loop);
  document.body.dataset.ready = '1';
})();
