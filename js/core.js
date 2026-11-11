/* ============================================================
   CLARÉ — NÚCLEO: utilidades, carrito/guardados, router, scroll, toasts
   ============================================================ */
(function () {
  'use strict';
  var CL = (window.CL = {});
  CL.cfg = window.CLARE_CONFIG;
  CL.svc = window.CLARE_SERVICES;
  CL.FILE_MODE = location.protocol === 'file:';

  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  CL.reduce = function () { return mqReduce.matches; };
  CL.isDesktop = function () { return window.matchMedia('(min-width: 861px)').matches; };
  CL.lowPower = function () {
    var c = navigator.connection || {};
    return !!(c.saveData || (navigator.deviceMemory && navigator.deviceMemory <= 2) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2));
  };

  // ---------- helpers ----------
  CL.$ = function (s, r) { return (r || document).querySelector(s); };
  CL.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var $ = CL.$, $$ = CL.$$;

  CL.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  CL.fmt = function (n) { return '$' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
  CL.norm = function (s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim(); };
  CL.L = function (path) { return CL.FILE_MODE ? '#' + path : path; };
  CL.link = function (path) { return ' href="' + CL.esc(CL.L(path)) + '" data-r="' + CL.esc(path) + '"'; };

  // ---------- íconos (trazo, 24x24) ----------
  var ICONS = {
    heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
    check: 'm5 12.5 4.5 4.5L19 7',
    plus: 'M12 5v14M5 12h14',
    minus: 'M5 12h14',
    trash: 'M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12',
    left: 'm15 5-7 7 7 7',
    right: 'm9 5 7 7-7 7',
    close: 'm6 6 12 12M18 6 6 18',
    chevron: 'm6 9 6 6 6-6',
    filter: 'M4 6h16M7 12h10M10 18h4',
    book: 'M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z',
    blocks: 'M4 14h7v6H4zM13 14h7v6h-7zM8.5 7.5h7V14h-7z',
    step: 'M4 19h5v-4h5v-4h6v8H4z',
    whatsapp: 'M4 20l1.3-4.2A8 8 0 1 1 8.4 18.8zM9.2 9.2c.3 2.200 2.400 4.300 4.600 4.600l1.100-1.100-1.800-.9-.7.6c-.9-.4-1.600-1.100-2-2l.6-.7-.9-1.800z',
    arrow: 'M5 12h14m-5-5 5 5-5 5',
    copy: 'M9 9h10v11H9zM5 15V4h10',
    star: 'M12 4l2.300 5.100 5.500.5-4.200 3.700 1.300 5.400L12 15.800l-4.900 2.900 1.300-5.400L4.200 9.600l5.500-.5z'
  };
  CL.icon = function (name, cls) {
    return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="' + (ICONS[name] || '') + '"/></svg>';
  };
  // Acentos dibujados a mano (decorativos)
  var DECO = {
    heart: 'M12 20c-6-4-8.200-7.800-6.600-10.800 1.400-2.700 4.800-2.700 6.600.1 1.800-2.800 5.200-2.800 6.600-.1C20.200 12.200 18 16 12 20z',
    star: 'M12 3.200l2.500 5.700 6.100.6-4.600 4.100 1.400 6L12 16.400l-5.400 3.200 1.400-6L3.400 9.500l6.100-.6z',
    spark: 'M12 3v6M12 15v6M3 12h6M15 12h6'
  };
  CL.deco = function (kind, cls) {
    return '<svg class="deco ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path pathLength="1" d="' + DECO[kind] + '"/></svg>';
  };

  // ---------- almacenamiento ----------
  function lsGet(k, def) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? def : v; } catch (e) { return def; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* modo privado / sin permiso */ } }

  // ---------- catálogo en memoria ----------
  CL.data = null; CL.byId = {}; CL.bySlug = {};
  CL.setData = function (d) {
    CL.data = d; CL.byId = {}; CL.bySlug = {};
    d.products.forEach(function (p) { CL.byId[p.id] = p; CL.bySlug[p.slug] = p; });
  };
  CL.catById = function (id) { return CL.data.categories.filter(function (c) { return c.id === id; })[0]; };

  // ---------- carrito y guardados (solo IDs, variantes y cantidades) ----------
  var maxQ = CL.cfg.LIMITS.qtyMax;
  CL.store = {
    cart: [], saved: [],
    init: function () {
      var c = lsGet('clare_cart', []), s = lsGet('clare_saved', []);
      this.cart = (Array.isArray(c) ? c : []).filter(function (i) { return i && CL.byId[i.id]; }).map(function (i) {
        return { id: i.id, variantId: null, qty: Math.max(1, Math.min(maxQ, parseInt(i.qty, 10) || 1)) };
      });
      this.saved = (Array.isArray(s) ? s : []).filter(function (id) { return CL.byId[id]; });
      this.persist();
    },
    persist: function () { lsSet('clare_cart', this.cart); lsSet('clare_saved', this.saved); },
    find: function (id) { return this.cart.filter(function (i) { return i.id === id; })[0]; },
    add: function (id, qty) {
      qty = Math.max(1, parseInt(qty, 10) || 1);
      var it = this.find(id);
      if (it) it.qty = Math.min(maxQ, it.qty + qty); else this.cart.push({ id: id, variantId: null, qty: Math.min(maxQ, qty) });
      this.persist();
    },
    setQty: function (id, qty) {
      var it = this.find(id); if (!it) return;
      it.qty = Math.max(1, Math.min(maxQ, parseInt(qty, 10) || 1)); this.persist();
    },
    remove: function (id) {
      var it = this.find(id); if (!it) return null;
      this.cart = this.cart.filter(function (i) { return i.id !== id; }); this.persist(); return { id: it.id, variantId: null, qty: it.qty };
    },
    restore: function (item) { if (item && CL.byId[item.id] && !this.find(item.id)) { this.cart.push(item); this.persist(); } },
    clear: function () { this.cart = []; this.persist(); },
    count: function () { return this.cart.reduce(function (n, i) { return n + i.qty; }, 0); },
    isSaved: function (id) { return this.saved.indexOf(id) > -1; },
    toggleSaved: function (id) {
      var i = this.saved.indexOf(id);
      if (i > -1) this.saved.splice(i, 1); else this.saved.push(id);
      this.persist(); return i === -1;
    }
  };

  CL.cartLines = function () {
    return CL.store.cart.map(function (i) {
      var p = CL.byId[i.id]; return { p: p, qty: i.qty, line: p.priceARS * i.qty };
    });
  };
  CL.inZone = function (city) {
    var c = CL.norm(city);
    return ['santa fe', 'ciudad de santa fe', 'santa fe capital', 'santa fe ciudad'].indexOf(c) > -1;
  };
  CL.totals = function (city) {
    var sub = CL.cartLines().reduce(function (n, l) { return n + l.line; }, 0);
    var inZ = CL.inZone(city);
    var ship = inZ ? CL.cfg.SHIPPING_FEE_ARS : null;
    return { subtotal: sub, inZone: inZ, shipping: ship, total: sub + (ship || 0) };
  };

  // ---------- scroll (Lenis) ----------
  var lenis = null, locks = 0;
  CL.initScroll = function () {
    if (CL.reduce() || !window.Lenis) return;
    try {
      lenis = new window.Lenis({ lerp: 0.12, smoothWheel: true });
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
    } catch (e) { lenis = null; }
  };
  CL.lenis = function () { return lenis; };
  CL.scrollY = function () { return lenis ? lenis.scroll : (document.scrollingElement || document.documentElement).scrollTop; };
  CL.scrollTo = function (y, immediate) {
    if (lenis) lenis.scrollTo(y, { immediate: !!immediate, force: true });
    else (document.scrollingElement || document.documentElement).scrollTop = y;
  };
  CL.scrollToEl = function (el, offset) {
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: offset || 0, immediate: CL.reduce() });
    else el.scrollIntoView({ behavior: CL.reduce() ? 'auto' : 'smooth', block: 'start' });
  };
  CL.lockScroll = function (on) {
    locks = Math.max(0, locks + (on ? 1 : -1));
    var lock = locks > 0;
    document.documentElement.classList.toggle('scroll-locked', lock);
    if (lenis) { if (lock) lenis.stop(); else lenis.start(); }
  };

  // ---------- foco ----------
  var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  CL.focusables = function (c) { return $$(FOCUSABLE, c).filter(function (el) { return el.getClientRects().length > 0 && !el.closest('[hidden]'); }); };
  CL.trapFocus = function (c, e) {
    if (e.key !== 'Tab') return;
    var f = CL.focusables(c); if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  // ---------- avisos ----------
  var toastTimer = null, toastFn = null;
  CL.toast = function (msg, action) {
    var el = $('#toast'); if (!el) return;
    var h = '<span class="toast-msg">' + CL.esc(msg) + '</span>';
    toastFn = null;
    if (action && action.path) h += '<a class="toast-act"' + CL.link(action.path) + '>' + CL.esc(action.label) + '</a>';
    else if (action && action.fn) { toastFn = action.fn; h += '<button type="button" class="toast-act" data-toast-fn>' + CL.esc(action.label) + '</button>'; }
    el.innerHTML = h;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, action ? 6000 : 3200);
  };
  CL.hideToast = function () { var el = $('#toast'); if (el) el.classList.remove('show'); };
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-toast-fn]');
    if (b && toastFn) { var f = toastFn; toastFn = null; CL.hideToast(); f(); }
  });

  CL.announce = function (text) {
    var el = $('#route-announcer'); if (!el) return;
    el.textContent = ''; setTimeout(function () { el.textContent = text; }, 40);
  };

  CL.tween = function (el, to, formatter) {
    if (!el) return;
    var from = parseFloat(el.getAttribute('data-v')); if (isNaN(from)) from = to;
    el.setAttribute('data-v', to);
    if (CL.reduce() || from === to) { el.textContent = formatter(to); return; }
    var t0 = performance.now(), dur = 260;
    (function step(t) {
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = formatter(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(step); else el.textContent = formatter(to);
    })(t0);
  };

  // ---------- limpieza entre páginas / reveal ----------
  var cleanups = [];
  CL.onCleanup = function (fn) { cleanups.push(fn); };
  function runCleanups() { var c = cleanups; cleanups = []; c.forEach(function (f) { try { f(); } catch (e) { /* noop */ } }); }

  CL.reveal = function (root) {
    var els = $$('[data-reveal]', root); if (!els.length) return;
    var perParent = new Map();
    els.forEach(function (el) {
      var n = perParent.get(el.parentNode) || 0; perParent.set(el.parentNode, n + 1);
      el.style.setProperty('--d', Math.min(n, 8));
    });
    if (!('IntersectionObserver' in window) || CL.reduce()) { els.forEach(function (el) { el.removeAttribute('data-reveal'); }); return; }
    // Al terminar la entrada se quita data-reveal para que no pise hover/transform del elemento.
    function done(el) {
      el.classList.add('in');
      var d = 600 + (parseInt(el.style.getPropertyValue('--d'), 10) || 0) * 60;
      setTimeout(function () { el.removeAttribute('data-reveal'); el.classList.remove('in'); }, d);
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { done(en.target); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    els.forEach(function (el) { io.observe(el); });
    CL.onCleanup(function () { io.disconnect(); });
  };

  // ---------- router ----------
  var routes = [], scrollPos = {}, firstRender = true;
  CL.route = function (re, fn) { routes.push({ re: re, fn: fn }); };

  function parseLocation() {
    var raw, q = '';
    if (CL.FILE_MODE) raw = location.hash.slice(1) || '/';
    else raw = location.pathname + location.search;
    var i = raw.indexOf('?');
    if (i > -1) { q = raw.slice(i + 1); raw = raw.slice(0, i); }
    raw = raw.replace(/\/index\.html$/, '/');
    if (raw.length > 1) raw = raw.replace(/\/+$/, '');
    if (!raw) raw = '/';
    try { raw = decodeURI(raw); } catch (e) { /* deja crudo */ }
    return { path: raw, query: new URLSearchParams(q), key: raw + (q ? '?' + q : '') };
  }
  CL.current = parseLocation;

  var scrollKey = null;
  function saveScroll() { if (scrollKey) scrollPos[scrollKey] = CL.scrollY(); }

  CL.navigate = function (path, opts) {
    opts = opts || {};
    saveScroll();
    delete scrollPos[path];
    if (CL.FILE_MODE) {
      var same = ('#' + path === location.hash) || (path === '/' && !location.hash);
      if (same) { CL.render(false); return; }
      if (opts.replace) location.replace('#' + path); else location.hash = path; // dispara hashchange => render
      return;
    }
    if (opts.replace) history.replaceState({}, '', path); else history.pushState({}, '', path);
    CL.render(false);
  };
  // Cambia la URL sin renderizar (filtros del listado)
  CL.replaceUrl = function (path) {
    try { history.replaceState({}, '', CL.FILE_MODE ? '#' + path : path); } catch (e) { /* noop */ }
    var cur = parseLocation(); scrollKey = cur.key;
  };

  CL.render = function (restore) {
    runCleanups();
    CL.closeOverlays && CL.closeOverlays();
    var cur = parseLocation(), match = null, res;
    for (var i = 0; i < routes.length; i++) {
      var m = routes[i].re.exec(cur.path);
      if (m) { match = { fn: routes[i].fn, m: m }; break; }
    }
    try {
      res = match ? match.fn(match.m, cur.query) : CL.views.notFound();
    } catch (err) {
      if (window.console) console.error(err);
      res = CL.views.error(err);
    }
    var app = $('#app');
    app.classList.remove('page-in');
    app.innerHTML = res.html;
    scrollKey = cur.key;
    document.title = (res.title ? res.title + ' · ' : '') + CL.cfg.BRAND_NAME + (CL.cfg.STORE_MODE === 'produccion' ? '' : ' (demo)');
    var md = $('meta[name="description"]');
    if (md && res.description) md.setAttribute('content', res.description);
    var can = $('link[rel="canonical"]');
    if (!CL.FILE_MODE) {
      if (!can) { can = document.createElement('link'); can.rel = 'canonical'; document.head.appendChild(can); }
      can.href = location.origin + cur.path;
    }
    CL.fixLinks(app);
    if (res.mount) res.mount(app, cur);
    CL.reveal(app);
    if (CL.doodles) CL.doodles(app);
    if (!CL.reduce()) { void app.offsetWidth; app.classList.add('page-in'); }

    CL.scrollTo(restore ? (scrollPos[cur.key] || 0) : 0, true);
    if (!firstRender) {
      app.focus({ preventScroll: true });
      CL.announce(res.title || CL.cfg.BRAND_NAME);
    }
    firstRender = false;
    CL.syncChrome && CL.syncChrome(cur.path);
  };

  // Redibuja la página actual conservando el scroll (cuando llegan datos nuevos del panel en segundo plano).
  CL.rerender = function () { saveScroll(); CL.render(true); };

  CL.fixLinks = function (root) {
    if (!CL.FILE_MODE) return;
    $$('a[data-r]', root).forEach(function (a) { a.setAttribute('href', '#' + a.getAttribute('data-r')); });
  };

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-r]');
    if (!a) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    CL.navigate(a.getAttribute('data-r'));
  });
  window.addEventListener('popstate', function () { if (!CL.FILE_MODE) CL.render(true); });
  window.addEventListener('hashchange', function () { if (CL.FILE_MODE) CL.render(true); });

  CL.views = {};
})();
