/* ============================================================
   CLARÉ — ARRANQUE Y "CHROME" DEL SITIO (cabecera, menús, búsqueda, mini carrito, footer)
   ============================================================ */
(function () {
  'use strict';
  var CL = window.CL, $ = CL.$, $$ = CL.$$, esc = CL.esc, fmt = CL.fmt, link = CL.link, icon = CL.icon, cfg = CL.cfg;

  var header, menuBtn, menuPanel, scrim, searchBtn, searchPanel, searchInput, cartBtn, mini;
  var openers = {}; // para devolver el foco

  // ---------- contadores ----------
  function setBadge(id, n) {
    var el = $('#' + id); if (!el) return;
    var prev = parseInt(el.textContent, 10) || 0;
    el.textContent = n; el.hidden = n === 0;
    if (n > prev && !CL.reduce()) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
  }
  CL.updateCounts = function () {
    var c = CL.store.count(), s = CL.store.saved.length;
    setBadge('cart-count', c); setBadge('dock-cart', c); setBadge('saved-count', s); setBadge('dock-saved', s);
    cartBtn.setAttribute('aria-label', 'Carrito' + (c ? ', ' + c + (c === 1 ? ' producto' : ' productos') : ''));
    if (!mini.hidden) paintMini();
  };

  // ---------- overlays ----------
  function isOpen(el) { return !el.hidden; }
  CL.closeOverlays = function () {
    if (menuPanel && isOpen(menuPanel)) closeMenu(true);
    if (searchPanel && isOpen(searchPanel)) closeSearch(true);
    if (mini && isOpen(mini)) closeMini(true);
    $$('.sub-toggle[aria-expanded="true"]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); b.parentNode.classList.remove('open'); });
  };

  // Menú móvil
  function menuLinksHTML() {
    var D = CL.data, out = '';
    D.categories.forEach(function (c) {
      out += '<div class="m-group"><a class="m-link"' + link('/' + c.slug) + '>' + esc(c.name) + '</a>';
      if (c.subcategories.length) out += '<ul class="m-sub">' + c.subcategories.map(function (s) { return '<li><a' + link('/' + c.slug + '?sub=' + s.id) + '>' + esc(s.name) + '</a></li>'; }).join('') + '</ul>';
      out += '</div>';
    });
    out += '<div class="m-group"><a class="m-link"' + link('/inspiracion') + '>Inspiración</a></div>';
    out += '<div class="m-group m-extra"><a' + link('/por-etapa') + '>Por etapa</a><a' + link('/preguntas-frecuentes') + '>Preguntas frecuentes</a><a' + link('/nosotros') + '>Nosotros</a></div>';
    return out;
  }
  function openMenu(opener) {
    openers.menu = opener || menuBtn; menuPanel.hidden = false; scrim.hidden = false;
    requestAnimationFrame(function () { menuPanel.classList.add('open'); scrim.classList.add('open'); });
    menuBtn.setAttribute('aria-expanded', 'true'); CL.lockScroll(true);
    var f = CL.focusables(menuPanel); if (f[1]) f[1].focus(); else if (f[0]) f[0].focus();
  }
  function closeMenu(silent) {
    menuPanel.classList.remove('open'); scrim.classList.remove('open'); menuPanel.hidden = true; scrim.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false'); CL.lockScroll(false);
    if (!silent && openers.menu && openers.menu.focus) openers.menu.focus();
  }

  // Búsqueda
  function paintSearch() {
    var q = searchInput.value.trim(), box = $('#search-suggest');
    var cats = CL.data.categories.map(function (c) { return '<a class="chip chip-link"' + link('/' + c.slug) + '>' + esc(c.name) + '</a>'; }).join('');
    if (!q) { box.innerHTML = '<p class="s-title">Categorías</p><div class="chips">' + cats + '</div>'; CL.fixLinks(box); return; }
    var res = CL.searchProducts(q);
    if (!res.length) { box.innerHTML = '<p class="s-empty" role="status">No encontramos productos para esa búsqueda.</p><p class="s-title">Probá con una categoría</p><div class="chips">' + cats + '</div>'; CL.fixLinks(box); return; }
    box.innerHTML = '<p class="s-title" role="status">' + res.length + (res.length === 1 ? ' coincidencia' : ' coincidencias') + '</p><ul class="s-list">' + res.slice(0, 6).map(function (p) {
      return '<li><a class="s-row"' + link('/producto/' + p.slug) + '><img src="' + esc(p.images[0].url) + '" alt="" width="56" height="56"><span class="n">' + esc(p.name) + '</span><span class="p">' + fmt(p.priceARS) + '</span></a></li>';
    }).join('') + '</ul>' + (res.length > 6 ? '<a class="more"' + link('/buscar?q=' + encodeURIComponent(q)) + '>Ver todos los resultados</a>' : '');
    CL.fixLinks(box);
  }
  function openSearch() {
    openers.search = searchBtn; searchPanel.hidden = false; CL.lockScroll(true); paintSearch();
    requestAnimationFrame(function () { searchPanel.classList.add('open'); });
    searchInput.focus();
  }
  function closeSearch(silent) {
    searchPanel.classList.remove('open'); searchPanel.hidden = true; CL.lockScroll(false);
    if (!silent && searchBtn.focus) searchBtn.focus();
  }

  // Mini carrito (escritorio)
  function paintMini() {
    var lines = CL.cartLines(), sub = lines.reduce(function (n, l) { return n + l.line; }, 0);
    if (!lines.length) {
      mini.innerHTML = '<p class="mini-empty">Tu carrito está vacío.</p><div class="mini-actions"><button type="button" class="btn btn-soft btn-small" data-mini-close>Seguir comprando</button></div>';
    } else {
      mini.innerHTML = '<h2 class="sr-only">Carrito</h2><ul class="mini-lines">' + lines.map(function (l) {
        return '<li><img src="' + esc(l.p.images[0].url) + '" alt="" width="56" height="56"><div><p class="n">' + esc(l.p.name) + '</p><p class="q">' + l.qty + ' × ' + fmt(l.p.priceARS) + '</p></div><p class="t">' + fmt(l.line) + '</p></li>';
      }).join('') + '</ul><p class="mini-sub"><span>Subtotal</span><strong>' + fmt(sub) + '</strong></p>' +
        '<div class="mini-actions"><a class="btn btn-small"' + link('/carrito') + '>Ver carrito</a><button type="button" class="btn btn-soft btn-small" data-mini-close>Seguir comprando</button></div>';
    }
    CL.fixLinks(mini);
  }
  function openMini() {
    paintMini(); mini.style.top = (header.getBoundingClientRect().bottom + 8) + 'px';
    mini.hidden = false; cartBtn.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(function () { mini.classList.add('open'); });
    mini.setAttribute('tabindex', '-1'); mini.focus({ preventScroll: true });
  }
  function closeMini(silent) {
    mini.classList.remove('open'); mini.hidden = true; cartBtn.setAttribute('aria-expanded', 'false');
    if (!silent) cartBtn.focus();
  }

  // ---------- footer ----------
  function paintFooter() {
    var D = CL.data;
    $('#site-footer').innerHTML = '<div class="wrap foot-inner"><div class="foot-brand"><span class="logo-word">Claré</span>' +
      '<p>Muebles y juguetes Montessori. ' + (cfg.STORE_MODE === 'produccion' ? '' : 'Sitio de demostración: productos, precios e imágenes son de ejemplo.') + '</p></div>' +
      '<nav class="foot-col" aria-label="Tienda"><h2>Tienda</h2><ul>' + D.categories.map(function (c) { return '<li><a' + link('/' + c.slug) + '>' + esc(c.name) + '</a></li>'; }).join('') +
      '<li><a' + link('/inspiracion') + '>Inspiración</a></li><li><a' + link('/por-etapa') + '>Por etapa</a></li></ul></nav>' +
      '<nav class="foot-col" aria-label="Ayuda"><h2>Ayuda</h2><ul><li><a' + link('/preguntas-frecuentes') + '>Preguntas frecuentes</a></li><li><a' + link('/nosotros') + '>Nosotros</a></li><li><a' + link('/privacidad') + '>Privacidad</a></li></ul></nav>' +
      '<div class="foot-col"><h2>Contacto</h2><ul><li><a href="' + esc('https://wa.me/' + (cfg.WHATSAPP_PHONE_E164 || '').replace(/\D/g, '') + '?text=' + encodeURIComponent('Hola Claré, quisiera hacer una consulta.')) + '">WhatsApp</a></li>' +
      (cfg.CONTACT_EMAIL ? '<li><a href="mailto:' + esc(cfg.CONTACT_EMAIL) + '">' + esc(cfg.CONTACT_EMAIL) + '</a></li>' : '') +
      (cfg.INSTAGRAM_URL ? '<li><a href="' + esc(cfg.INSTAGRAM_URL) + '" rel="noopener">Instagram</a></li>' : '') + '</ul></div></div>' +
      '<p class="foot-legal">© ' + new Date().getFullYear() + ' Claré' + (cfg.STORE_MODE === 'produccion' ? '' : ' · demo') + '</p>';
    CL.fixLinks($('#site-footer'));
  }

  // ---------- marca activa en navegación ----------
  CL.syncChrome = function (path) {
    $$('.main-nav a[data-r]').forEach(function (a) {
      var r = a.getAttribute('data-r').split('?')[0];
      if (path === r || path.indexOf(r + '/') === 0) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    var map = { home: path === '/', saved: path === '/guardados', cart: path === '/carrito' || path === '/pedido/preparado' };
    $$('#dock [data-dock]').forEach(function (el) { var k = el.getAttribute('data-dock'); if (map[k]) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current'); });
  };

  // ---------- acciones globales ----------
  function addFeedback(btn) {
    var lbl = $('.lbl', btn); if (!lbl) return;
    if (!btn.getAttribute('data-orig')) btn.setAttribute('data-orig', lbl.textContent);
    lbl.textContent = 'Agregado'; btn.classList.add('added');
    clearTimeout(btn._t);
    btn._t = setTimeout(function () { lbl.textContent = btn.getAttribute('data-orig'); btn.classList.remove('added'); }, 1500);
  }
  function bindGlobal() {
    document.addEventListener('click', function (e) {
      var add = e.target.closest('[data-add]');
      if (add) {
        var id = add.getAttribute('data-add'), p = CL.byId[id], sel = add.getAttribute('data-qty-from'), q = 1;
        if (sel) { var qi = $(sel); q = parseInt(qi && qi.value, 10) || 1; }
        CL.store.add(id, q); CL.updateCounts(); addFeedback(add);
        CL.toast((q > 1 ? q + ' × ' : '') + p.name + (q > 1 ? ' agregados' : ' agregado') + ' al carrito.', { label: 'Ver carrito', path: '/carrito' });
        return;
      }
      var sv = e.target.closest('[data-save]');
      if (sv) {
        var sid = sv.getAttribute('data-save'), on = CL.store.toggleSaved(sid), name = CL.byId[sid].name;
        $$('[data-save="' + sid + '"]').forEach(function (b) {
          b.setAttribute('aria-pressed', String(on));
          if (on && !CL.reduce()) { b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); }
        });
        CL.updateCounts();
        CL.toast(on ? name + ' guardado.' : 'Quitaste ' + name + ' de Guardados.', on ? { label: 'Ver guardados', path: '/guardados' } : null);
        if (!on) document.dispatchEvent(new CustomEvent('saved:removed'));
        return;
      }
      var sc = e.target.closest('[data-scroll]');
      if (sc) { e.preventDefault(); CL.scrollToEl($(sc.getAttribute('data-scroll')), -90); return; }
      if (e.target.closest('[data-mini-close]')) { closeMini(); return; }
      // cerrar mini carrito al hacer click afuera
      if (isOpen(mini) && !mini.contains(e.target) && !cartBtn.contains(e.target)) closeMini(true);
      // cerrar submenú al hacer click afuera
      if (!e.target.closest('.has-sub')) $$('.has-sub.open').forEach(function (li) { li.classList.remove('open'); $('.sub-toggle', li).setAttribute('aria-expanded', 'false'); });
      // links dentro de overlays navegan y cierran (el render ya cierra overlays)
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (isOpen(searchPanel)) { e.preventDefault(); closeSearch(); return; }
        if (isOpen(menuPanel)) { e.preventDefault(); closeMenu(); return; }
        if (isOpen(mini)) { e.preventDefault(); closeMini(); return; }
        var openSub = $('.has-sub.open');
        if (openSub) { openSub.classList.remove('open'); var t = $('.sub-toggle', openSub); t.setAttribute('aria-expanded', 'false'); t.focus(); }
      }
      if (isOpen(searchPanel)) CL.trapFocus(searchPanel, e);
      else if (isOpen(menuPanel)) CL.trapFocus(menuPanel, e);
      else if (isOpen(mini)) CL.trapFocus(mini, e);
    });

    // cabecera
    menuBtn.addEventListener('click', function () { openMenu(menuBtn); });
    $('#dock-cats').addEventListener('click', function () { openMenu($('#dock-cats')); });
    $('#menu-close').addEventListener('click', function () { closeMenu(); });
    scrim.addEventListener('click', function () { closeMenu(); });
    searchBtn.addEventListener('click', openSearch);
    $('#search-close').addEventListener('click', function () { closeSearch(); });
    searchPanel.addEventListener('click', function (e) { if (e.target === searchPanel) closeSearch(); });
    searchInput.addEventListener('input', paintSearch);
    $('#search-form').addEventListener('submit', function (e) {
      e.preventDefault(); var v = searchInput.value.trim(); closeSearch(true);
      CL.navigate('/buscar' + (v ? '?q=' + encodeURIComponent(v) : ''));
    });

    cartBtn.setAttribute('href', CL.L('/carrito'));
    cartBtn.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      var onCart = CL.current().path === '/carrito';
      if (CL.isDesktop() && !onCart) { if (isOpen(mini)) closeMini(); else openMini(); }
      else CL.navigate('/carrito');
    });

    // submenú Muebles
    $$('.has-sub').forEach(function (li) {
      var t = $('.sub-toggle', li);
      t.addEventListener('click', function () {
        var open = !li.classList.contains('open'); li.classList.toggle('open', open); t.setAttribute('aria-expanded', String(open));
      });
    });

    // en cambio de tamaño, cerrar mini carrito
    window.addEventListener('resize', function () { if (isOpen(mini) && !CL.isDesktop()) closeMini(true); });

    window.addEventListener('offline', function () { CL.toast('Estás sin conexión.'); });
    window.addEventListener('online', function () { CL.toast('Volviste a estar en línea.'); });
  }

  // ---------- arranque ----------
  function showBoot(html) { $('#app').innerHTML = html; }

  function start() {
    header = $('#site-header'); menuBtn = $('#menu-btn'); menuPanel = $('#menu-panel'); scrim = $('#scrim');
    searchBtn = $('#search-btn'); searchPanel = $('#search-panel'); searchInput = $('#search-input'); cartBtn = $('#cart-btn'); mini = $('#mini-cart');

    var ann = document.createElement('div'); ann.id = 'route-announcer'; ann.className = 'sr-only'; ann.setAttribute('aria-live', 'polite'); document.body.appendChild(ann);

    if (cfg.STORE_MODE === 'produccion') { var rb = $('#meta-robots'); if (rb) rb.remove(); var ds = $('#demo-strip'); if (ds) ds.remove(); }
    else { document.documentElement.classList.add('is-demo'); }

    CL.fixLinks(document);
    $('#skip-link').addEventListener('click', function (e) { e.preventDefault(); $('#app').focus(); });

    var missing = CL.svc.missingConfig();
    if (missing.length) { document.documentElement.classList.add('reveal-ready'); showBoot(CL.views.configError(missing).html); return; }

    CL.svc.catalogApi.load().then(function (data) {
      CL.setData(data); CL.store.init();
      $('#sub-muebles').innerHTML = CL.catById('muebles').subcategories.map(function (s) { return '<li><a' + link('/muebles?sub=' + s.id) + '>' + esc(s.name) + '</a></li>'; }).join('');
      $('#menu-links').innerHTML = menuLinksHTML();
      CL.fixLinks(document);
      paintFooter();
      bindGlobal();
      CL.updateCounts();
      CL.initScroll();

      // cabecera compacta (observer sobre un centinela, sin listener de scroll)
      var sent = $('#scroll-sentinel');
      if ('IntersectionObserver' in window && sent) new IntersectionObserver(function (en) { header.classList.toggle('is-compact', !en[0].isIntersecting); }).observe(sent);

      // entrada del wordmark: una sola vez por visita
      try { if (!sessionStorage.getItem('clare_intro') && !CL.reduce()) { $('#logo-word').classList.add('intro'); sessionStorage.setItem('clare_intro', '1'); } } catch (e) { /* noop */ }

      document.documentElement.classList.add('reveal-ready');
      CL.render(false);
    }).catch(function (err) {
      if (window.console) console.error(err);
      document.documentElement.classList.add('reveal-ready');
      showBoot('<div class="wrap block page-simple"><div class="empty"><h2>No pudimos cargar el catálogo</h2><p>Revisá tu conexión y probá de nuevo.</p><div class="empty-actions"><button type="button" class="btn" onclick="location.reload()">Reintentar</button></div></div></div>');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
