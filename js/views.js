/* ============================================================
   MOONDOS — VISTAS (páginas). Cada vista devuelve { title, description, html, mount }.
   ============================================================ */
(function () {
  'use strict';
  var CL = window.CL, $ = CL.$, $$ = CL.$$, esc = CL.esc, fmt = CL.fmt, link = CL.link, icon = CL.icon, deco = CL.deco, cfg = CL.cfg;
  var V = CL.views;

  // ---------- piezas reutilizables ----------
  function img(src, alt, w, h, eager) {
    return '<img src="' + esc(src) + '" alt="' + esc(alt) + '" width="' + w + '" height="' + h + '" decoding="async"' + (eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' onerror="this.onerror=null;this.src=\'assets/img/nosotros.svg\'">';
  }
  function star(i) { return '<svg class="burst-star s' + i + '" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2l2.5 5.7 6.100.6-4.600 4.100 1.400 6L12 16.400l-5.400 3.200 1.400-6L3.400 9.500l6.100-.6z"/></svg>'; }
  function heartBtn(p) {
    var on = CL.store.isSaved(p.id);
    return '<button type="button" class="heart-btn" data-save="' + p.id + '" aria-pressed="' + on + '" aria-label="Guardar ' + esc(p.name) + '">' +
      icon('heart') + '<span class="burst" aria-hidden="true">' + star(1) + star(2) + star(3) + '</span></button>';
  }
  function priceHTML(p) { return '<p class="price">' + (p.fromPrice ? '<span class="price-from">Desde</span> ' : '') + '<span class="price-n">' + fmt(p.priceARS) + '</span></p>'; }

  function productCard(p, opt) {
    opt = opt || {};
    var soldOut = !p.available;
    return '<article class="card product-card' + (soldOut ? ' is-soldout' : '') + '" data-reveal>' +
      '<a class="card-media"' + link('/producto/' + p.slug) + ' tabindex="-1" aria-hidden="true">' + img(p.images[0].url, p.images[0].alt, 640, 640) + (soldOut ? '<span class="chip-agotado">Sin stock</span>' : '') + '</a>' +
      heartBtn(p) +
      '<div class="card-body"><h3 class="card-title"><a' + link('/producto/' + p.slug) + '>' + esc(p.name) + '</a></h3>' + priceHTML(p) +
      '<div class="card-actions"><a class="btn btn-soft btn-small"' + link('/producto/' + p.slug) + '>Ver detalle</a>' +
      (soldOut ? '<button type="button" class="btn btn-small" disabled>Sin stock</button>' :
        (p.variants.length ? '<a class="btn btn-small"' + link('/producto/' + p.slug) + '>Elegir</a>' : '<button type="button" class="btn btn-small" data-add="' + p.id + '" aria-label="Agregar ' + esc(p.name) + ' al carrito"><span class="lbl">Agregar</span></button>')) +
      '</div></div></article>';
  }
  function grid(list, id) {
    return '<div class="grid"' + (id ? ' id="' + id + '"' : '') + '>' + list.map(function (p) { return productCard(p); }).join('') + '</div>';
  }
  function decoField() {
    return '<div class="deco-field" aria-hidden="true">' +
      deco('star', 'd1') + deco('heart', 'd2') + deco('star', 'd3') + deco('heart', 'd4') + deco('star', 'd5') + deco('spark', 'd6') + '</div>';
  }
  function head(title, path, label, h) {
    return '<div class="section-head" data-reveal><' + (h || 'h2') + '>' + esc(title) + '</' + (h || 'h2') + '>' +
      (path ? '<a class="more"' + link(path) + '>' + esc(label) + ' ' + icon('arrow') + '</a>' : '') + '</div>';
  }
  function crumbs(items) {
    return '<nav class="crumbs" aria-label="Migas de pan"><ol>' + items.map(function (it, i) {
      return '<li>' + (it.path ? '<a' + link(it.path) + '>' + esc(it.name) + '</a>' : '<span aria-current="page">' + esc(it.name) + '</span>') + '</li>';
    }).join('') + '</ol></nav>';
  }
  function shapes() { return '<div class="band-shapes" aria-hidden="true"><span class="blob b1"></span><span class="blob b2"></span><span class="blob b3"></span></div>'; }
  function emptyState(title, text, actions) {
    return '<div class="empty" data-reveal>' + deco('heart', 'empty-deco') + '<h2>' + esc(title) + '</h2><p>' + esc(text) + '</p><div class="empty-actions">' + (actions || '') + '</div></div>';
  }
  function byIds(ids) { return ids.map(function (id) { return CL.byId[id]; }).filter(Boolean); }

  // ============================================================
  // HOME
  // ============================================================
  V.home = function () {
    var D = CL.data;
    var featured = D.products.filter(function (p) { return p.featured; }).slice(0, 8);
    var nav = D.navidad;
    var catTiles = D.categories.map(function (c) {
      var n = D.products.filter(function (p) { return p.categoryId === c.id; }).length;
      return '<a class="cat-tile" data-reveal' + link('/' + c.slug) + '><span class="cat-img">' + img(c.image, c.name, 600, 280) + '</span><span class="cat-name">' + esc(c.name) + '</span><span class="cat-n">' + n + (n === 1 ? ' producto' : ' productos') + '</span></a>';
    }).join('');
    var html =
      '<section class="hero" id="hero" aria-labelledby="hero-title">' +
        '<div class="hero-shapes" aria-hidden="true"><span class="hb hb1"></span><span class="hb hb2"></span><span class="hb hb3"></span><span class="hb hb4"></span></div>' +
        '<div class="wrap hero-inner">' +
          '<div class="hero-copy"><h1 id="hero-title">Lo lindo también es útil</h1>' +
            '<p class="lead">Objetos para tu casa, para regalar y para regalarte. Elegí online y retirá en el local.</p>' +
            '<div class="hero-cta"><a class="btn btn-lg" href="#destacados" data-scroll="#destacados">Ver destacados</a>' + (nav ? '<a class="btn btn-ghost btn-lg"' + link('/navidad') + '>Navidad 2026</a>' : '<a class="btn btn-ghost btn-lg"' + link('/ideas') + '>Ideas para regalar</a>') + '</div></div>' +
          '<div class="hero-photo"><div class="hero-frame">' + img('assets/img/hero.svg', 'Estante con florero, vela, taza y cuaderno bajo una luna (ilustración)', 1000, 800, true) + '</div></div>' +
        '</div>' +
        '<div class="hero-dots" aria-hidden="true"><i></i><i></i><i></i></div>' +
      '</section>' +

      '<section class="wrap block" aria-labelledby="cats-t">' + decoField() + head('Explorá por categoría').replace('<h2>', '<h2 id="cats-t">') + '<div class="cat-grid">' + catTiles + '</div></section>' +

      '<section class="wrap block" id="destacados" aria-labelledby="dest-t">' + head('Destacados').replace('<h2>', '<h2 id="dest-t">') + grid(featured) + '</section>' +

      (nav ? '<section class="brand-block advent" aria-labelledby="adv-t"><div class="wrap brand-inner">' +
        '<div class="brand-copy" data-reveal><h2 id="adv-t">Navidad en MOONDOS</h2>' +
          '<p>Calendarios de adviento, adornos y velas de temporada. Reservá el tuyo y retiralo en el local.</p>' +
          '<a class="btn btn-light"' + link('/navidad') + '>Ver Navidad</a></div>' +
        '<div class="brand-photo" data-reveal>' + img('assets/img/banner-navidad.svg', 'Productos de Navidad (ilustración)', 800, 800) + '</div>' +
      '</div></section>' : '') +

      '<section class="wrap block" aria-labelledby="insp-t">' + head('Ideas para regalar', '/ideas', 'Ver guías').replace('<h2>', '<h2 id="insp-t">') +
        '<div class="grid grid-3">' + D.articles.map(articleCard).join('') + '</div></section>' +

      '<section class="brand-block" aria-labelledby="brand-t"><div class="wrap brand-inner">' +
        '<div class="brand-copy" data-reveal><h2 id="brand-t">Pasá por el local</h2>' +
          '<p>Mirá los objetos en persona, elegí con calma y llevate el regalo listo. Si preferís, armá el pedido desde acá y lo retirás.</p>' +
          '<a class="btn btn-light"' + link('/nosotros') + '>Conocer más</a></div>' +
        '<div class="brand-photo" data-reveal>' + img('assets/img/nosotros.svg', 'Objetos de MOONDOS (ilustración)', 800, 800) + '</div>' +
      '</div></section>' +

      '<section class="wrap block strip" aria-label="Cómo comprar"><ul>' +
        '<li data-reveal><strong>Retiro en el local</strong><span>Armás el pedido y lo pasás a buscar.</span></li>' +
        '<li data-reveal><strong>Envíos</strong><span>Si preferís, te lo llevamos. El costo se suma al confirmar.</span></li>' +
        '<li data-reveal><strong>Pagás como quieras</strong><span>Efectivo o transferencia, coordinado con el local.</span></li>' +
      '</ul></section>';
    return {
      title: 'Objetos para regalar y regalarte', description: 'Regalería con objetos lindos y útiles. Armá tu pedido y retiralo en el local o pedí el envío.', html: html,
      mount: function (root) { heroMotion(root); }
    };
  };

  function articleCard(a) {
    return '<article class="card article-card" data-reveal><a class="card-media wide"' + link('/ideas/' + a.slug) + ' tabindex="-1" aria-hidden="true">' + img(a.coverImage, a.title, 800, 600) + '</a>' +
      '<div class="card-body"><h3 class="card-title"><a' + link('/ideas/' + a.slug) + '>' + esc(a.title) + '</a></h3><p>' + esc(a.summary) + '</p>' +
      '<a class="more"' + link('/ideas/' + a.slug) + '>Leer guía ' + icon('arrow') + '</a></div></article>';
  }

  // Movimiento del hero: parallax leve (puntero en escritorio, scroll en general). Respeta movimiento reducido.
  function heroMotion(root) {
    var hero = $('#hero', root); if (!hero || CL.reduce() || CL.lowPower()) return;
    var visible = true, ticking = false, px = 0, py = 0, sy = 0;
    function apply() {
      ticking = false;
      hero.style.setProperty('--px', px.toFixed(3)); hero.style.setProperty('--py', py.toFixed(3)); hero.style.setProperty('--sy', sy.toFixed(3));
    }
    function req() { if (!ticking) { ticking = true; requestAnimationFrame(apply); } }
    function onScroll() { if (!visible) return; sy = Math.max(0, Math.min(1, CL.scrollY() / Math.max(1, hero.offsetHeight))); req(); }
    function onMove(e) {
      if (e.pointerType !== 'mouse') return;
      var r = hero.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width - 0.5) * 2; py = ((e.clientY - r.top) / r.height - 0.5) * 2; req();
    }
    var io = null;
    if ('IntersectionObserver' in window) { io = new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }); io.observe(hero); }
    window.addEventListener('scroll', onScroll, { passive: true });
    hero.addEventListener('pointermove', onMove, { passive: true });
    CL.onCleanup(function () { window.removeEventListener('scroll', onScroll); hero.removeEventListener('pointermove', onMove); if (io) io.disconnect(); });
  }
  // ============================================================
  // LISTADOS (categorías, colecciones)
  // ============================================================
  var SORTS = [['destacados', 'Destacados'], ['nombre', 'Nombre (A–Z)'], ['precio-asc', 'Precio: menor a mayor'], ['precio-desc', 'Precio: mayor a menor']];

  function sortList(list, mode) {
    var l = list.slice();
    if (mode === 'nombre') l.sort(function (a, b) { return a.name.localeCompare(b.name, 'es'); });
    else if (mode === 'precio-asc') l.sort(function (a, b) { return a.priceARS - b.priceARS; });
    else if (mode === 'precio-desc') l.sort(function (a, b) { return b.priceARS - a.priceARS; });
    else l.sort(function (a, b) { return (b.featured - a.featured) || (a.sortOrder - b.sortOrder); });
    return l;
  }

  function listing(o, query) {
    var base = o.products;
    var subs = (o.subs || []).filter(function (s) { return base.some(function (p) { return p.subcategoryId === s.id; }); });
    var moments = [];
    if (moments.length < 2) moments = [];
    var st = { sub: query.get('sub') || '', col: query.get('col') || '', orden: query.get('orden') || 'destacados' };
    if (!subs.some(function (s) { return s.id === st.sub; })) st.sub = '';
    if (!moments.some(function (c) { return c.id === st.col; })) st.col = '';
    if (!SORTS.some(function (s) { return s[0] === st.orden; })) st.orden = 'destacados';

    function chips(group, items, active) {
      return items.map(function (it) {
        return '<button type="button" class="chip" data-group="' + group + '" data-val="' + it.id + '" aria-pressed="' + (active === it.id) + '">' + esc(it.name || it.moment) + '</button>';
      }).join('');
    }
    function filtered() {
      return sortList(base.filter(function (p) {
        return (!st.sub || p.subcategoryId === st.sub);
      }), st.orden);
    }
    var list = filtered();
    var hasFilters = subs.length || moments.length;

    var html =
      '<section class="page-head band">' + shapes() + '<div class="wrap head-inner"><div class="head-copy">' +
        crumbs([{ name: 'Inicio', path: '/' }, { name: o.crumb }]) +
        '<h1>' + esc(o.h1) + '</h1><p class="lead">' + esc(o.description) + '</p>' +
        (o.activeLabel ? '<p class="active-filter">Filtro activo: <strong>' + esc(o.activeLabel) + '</strong> <a' + link(o.clearPath || '/') + '>Quitar filtro</a></p>' : '') +
        '</div><figure class="head-img">' + img(o.image, o.h1 + ' (ilustración)', 1200, 560, true) + '</figure></div></section>' +
      '<div class="wrap listing">' + decoField() +
        '<div class="toolbar">' +
          (hasFilters ? '<button type="button" class="btn btn-soft filter-open" id="filter-open" aria-haspopup="dialog">' + icon('filter') + ' Filtrar <span class="fcount" id="fcount" hidden></span></button>' : '') +
          '<label class="sort"><span>Ordenar por</span><select id="sort">' + SORTS.map(function (s) { return '<option value="' + s[0] + '"' + (st.orden === s[0] ? ' selected' : '') + '>' + s[1] + '</option>'; }).join('') + '</select></label>' +
          '<p class="result-count" id="result-count" role="status" aria-live="polite"></p>' +
          (hasFilters ? '<button type="button" class="link-btn" id="clear-filters" hidden>Limpiar filtros</button>' : '') +
        '</div>' +
        (hasFilters ? '<div class="filters-scrim" id="filters-scrim" hidden></div><div class="filters" id="filters" role="group" aria-label="Filtros" data-lenis-prevent>' +
          '<div class="filters-head"><h2>Filtrar</h2><button type="button" class="icon-btn" id="filters-close" aria-label="Cerrar filtros">' + icon('close') + '</button></div>' +
          (subs.length ? '<div class="fgroup"><p class="fgroup-t" id="fg-sub">Tipo</p><div class="chips" role="group" aria-labelledby="fg-sub">' + chips('sub', subs, st.sub) + '</div></div>' : '') +
          (moments.length ? '<div class="fgroup"><p class="fgroup-t" id="fg-col">Momento de uso</p><div class="chips" role="group" aria-labelledby="fg-col">' + chips('col', moments, st.col) + '</div></div>' : '') +
          '<div class="filters-foot"><button type="button" class="btn" id="filters-apply">Ver resultados</button></div></div>' : '') +
        '<div id="grid-wrap" class="grid-wrap"></div>' +
        '<nav class="other-links" aria-label="Otras categorías" data-reveal><p>Seguí explorando:</p>' +
          CL.data.categories.filter(function (c) { return c.id !== o.categoryId; }).map(function (c) { return '<a class="chip chip-link"' + link('/' + c.slug) + '>' + esc(c.name) + '</a>'; }).join('') +
          '<a class="chip chip-link"' + link('/ideas') + '>Ideas para regalar</a></nav>' +
      '</div>';

    function mount(root) {
      var wrap = $('#grid-wrap', root), count = $('#result-count', root), clearBtn = $('#clear-filters', root), fcount = $('#fcount', root);
      var sheet = $('#filters', root), scrim = $('#filters-scrim', root), openBtn = $('#filter-open', root), sheetOpen = false;

      function url() {
        var q = [];
        if (st.sub) q.push('sub=' + encodeURIComponent(st.sub));
        if (st.col) q.push('col=' + encodeURIComponent(st.col));
        if (st.orden !== 'destacados') q.push('orden=' + encodeURIComponent(st.orden));
        return o.basePath + (q.length ? '?' + q.join('&') : '');
      }
      function paint(animate) {
        list = filtered();
        var out = list.length ? grid(list) : emptyState('No encontramos productos con esos filtros', 'Probá quitar algún filtro o mirá otras categorías.', '<button type="button" class="btn btn-soft" data-clear-all>Limpiar filtros</button>');
        function put() { wrap.innerHTML = out; CL.fixLinks(wrap); CL.reveal(wrap); wrap.classList.remove('swap'); }
        if (animate && !CL.reduce()) { wrap.classList.add('swap'); setTimeout(put, 140); } else put();
        count.textContent = list.length + (list.length === 1 ? ' producto' : ' productos');
        $$('.chip[data-group]', root).forEach(function (c) { c.setAttribute('aria-pressed', String(st[c.getAttribute('data-group')] === c.getAttribute('data-val'))); });
        var n = (st.sub ? 1 : 0) + (st.col ? 1 : 0);
        if (clearBtn) clearBtn.hidden = n === 0;
        if (fcount) { fcount.hidden = n === 0; fcount.textContent = n; }
        CL.replaceUrl(url());
      }
      function openSheet() {
        sheetOpen = true; var wr = sheet.closest('.wrap'); if (wr) wr.classList.add('sheet-up'); sheet.classList.add('open'); scrim.hidden = false; CL.lockScroll(true);
        // El panel está en visibility:hidden durante la transición: se enfoca recién cuando ya es visible.
        var tries = 0;
        (function focusIn() {
          if (!sheetOpen) return;
          var f = CL.focusables(sheet), t = f[1] || f[0];
          if (t) t.focus({ preventScroll: true });
          if (t && document.activeElement !== t && tries++ < 12) setTimeout(focusIn, 40);
        })();
      }
      function closeSheet() {
        if (!sheetOpen) return; sheetOpen = false; sheet.classList.remove('open'); setTimeout(function () { var w = sheet.closest('.wrap'); if (w && !sheetOpen) w.classList.remove('sheet-up'); }, 320); scrim.hidden = true; CL.lockScroll(false);
        if (openBtn && openBtn.getClientRects().length) openBtn.focus();
      }
      function clearAll() { st.sub = ''; st.col = ''; paint(true); }

      root.addEventListener('click', function (e) {
        var chip = e.target.closest('.chip[data-group]');
        if (chip) { var g = chip.getAttribute('data-group'), v = chip.getAttribute('data-val'); st[g] = st[g] === v ? '' : v; paint(true); return; }
        if (e.target.closest('[data-clear-all]') || e.target.closest('#clear-filters')) { clearAll(); return; }
        if (e.target.closest('#filter-open')) { openSheet(); return; }
        if (e.target.closest('#filters-close') || e.target.closest('#filters-apply') || e.target.closest('#filters-scrim')) closeSheet();
      });
      var sort = $('#sort', root);
      sort.addEventListener('change', function () { st.orden = sort.value; paint(true); });
      function onKey(e) {
        if (!sheetOpen) return;
        if (e.key === 'Escape') { e.preventDefault(); closeSheet(); } else CL.trapFocus(sheet, e);
      }
      document.addEventListener('keydown', onKey);
      CL.onCleanup(function () { document.removeEventListener('keydown', onKey); if (sheetOpen) { sheetOpen = false; CL.lockScroll(false); } });
      paint(false);
    }
    return { title: o.h1, description: o.description, html: html, mount: mount };
  }

  function categoryView(c) {
    return function (m, q) {
      return listing({
        basePath: '/' + c.slug, crumb: c.name, categoryId: c.id, h1: c.title, description: c.description, image: c.image,
        products: CL.data.products.filter(function (p) { return p.categoryId === c.id; }), subs: c.subcategories, moments: false
      }, q);
    };
  }
  V.categoria = function (m, q) {
    var c = CL.catById(m[1]); if (!c) return V.notFound();
    return categoryView(c)(m, q);
  };

  // ============================================================
  // BÚSQUEDA / GUARDADOS
  // ============================================================
  CL.searchProducts = function (q) {
    var n = CL.norm(q); if (!n) return [];
    var terms = n.split(' ');
    return CL.data.products.filter(function (p) {
      var c = CL.catById(p.categoryId), hay = CL.norm(p.name + ' ' + c.name + ' ' + (p.subcategoryId ? (c.subcategories.filter(function (s) { return s.id === p.subcategoryId; })[0] || {}).name : ''));
      return terms.every(function (t) { return hay.indexOf(t) > -1; });
    });
  };
  V.buscar = function (m, q) {
    var term = (q.get('q') || '').slice(0, 60), res = CL.searchProducts(term);
    var html = '<div class="wrap block page-simple">' + crumbs([{ name: 'Inicio', path: '/' }, { name: 'Buscar' }]) + '<h1>' + (term ? 'Resultados para “' + esc(term) + '”' : 'Buscar') + '</h1>' +
      '<form class="inline-search" id="page-search" role="search"><label class="sr-only" for="ps-input">Buscar productos</label><input id="ps-input" type="search" maxlength="60" value="' + esc(term) + '" placeholder="Buscar productos"><button class="btn" type="submit">Buscar</button></form>' +
      (term ? '<p class="result-count" role="status">' + res.length + (res.length === 1 ? ' resultado' : ' resultados') + '</p>' : '') +
      (res.length ? grid(res) : (term ? emptyState('No encontramos productos para esa búsqueda', 'Probá con otra palabra o mirá las categorías.',
        CL.data.categories.map(function (c) { return '<a class="chip chip-link"' + link('/' + c.slug) + '>' + esc(c.name) + '</a>'; }).join('')) : '')) + '</div>';
    return {
      title: term ? 'Buscar: ' + term : 'Buscar', description: 'Buscar productos en MOONDOS.', html: html,
      mount: function (root) {
        $('#page-search', root).addEventListener('submit', function (e) { e.preventDefault(); var v = $('#ps-input', root).value.trim(); CL.navigate('/buscar' + (v ? '?q=' + encodeURIComponent(v) : '')); });
      }
    };
  };

  V.guardados = function () {
    var list = byIds(CL.store.saved);
    var html = '<div class="wrap block page-simple">' + crumbs([{ name: 'Inicio', path: '/' }, { name: 'Guardados' }]) + '<h1>Guardados</h1>' +
      '<p class="note">Tus guardados quedan solo en este dispositivo. No hace falta cuenta.</p><div id="saved-wrap"></div></div>';
    return {
      title: 'Guardados', description: 'Tus productos guardados en este dispositivo.', html: html,
      mount: function (root) {
        var wrap = $('#saved-wrap', root);
        function paint() {
          var l = byIds(CL.store.saved);
          wrap.innerHTML = l.length ? grid(l, 'saved-grid') : emptyState('Todavía no guardaste nada', 'Tocá el corazón de un producto para guardarlo y verlo más tarde.', '<a class="btn"' + link('/') + '>Seguir mirando</a>');
          CL.fixLinks(wrap); CL.reveal(wrap);
        }
        paint();
        var on = function () { paint(); }; document.addEventListener('saved:removed', on);
        CL.onCleanup(function () { document.removeEventListener('saved:removed', on); });
      }
    };
  };

  // ============================================================
  // PRODUCTO
  // ============================================================
  V.producto = function (m) {
    var p = CL.bySlug[m[1]]; if (!p) return V.notFound();
    var c = CL.catById(p.categoryId);
    var related = CL.data.products.filter(function (x) { return x.categoryId === p.categoryId && x.id !== p.id; }).slice(0, 4);
    var crumbItems = [{ name: 'Inicio', path: '/' }, { name: c.name, path: '/' + c.slug }, { name: p.name }];
    var pres = p.variants.length ? '<fieldset class="pres"><legend>Presentación</legend>' + p.variants.map(function (v, i) {
      return '<label class="pres-opt"><input type="radio" name="pres" value="' + esc(v.id) + '"' + (i === 0 ? ' checked' : '') + ' data-price="' + v.price + '"><span>' + esc(v.name) + ' <strong>' + fmt(v.price) + '</strong></span></label>';
    }).join('') + '</fieldset>' : '';
    var buy = p.available
      ? '<div class="buy-row"><div class="stepper" role="group" aria-label="Cantidad"><button type="button" data-step="-1" aria-label="Disminuir cantidad">' + icon('minus') + '</button><input id="qty" type="number" min="1" max="' + cfg.LIMITS.qtyMax + '" value="1" inputmode="numeric" aria-label="Cantidad"><button type="button" data-step="1" aria-label="Aumentar cantidad">' + icon('plus') + '</button></div>' +
        '<button type="button" class="btn btn-lg add-main" id="add-main" data-add="' + p.id + '" data-qty-from="#qty"><span class="lbl">Agregar al carrito</span></button></div>'
      : '<p class="notice">Este producto está sin stock por el momento. Consultanos por reposición.</p>';
    var html =
      '<div class="wrap product-page">' + crumbs(crumbItems) +
      '<div class="product-layout">' +
        '<div class="gallery" id="gallery" role="group" aria-label="Foto de ' + esc(p.name) + '">' +
          '<div class="g-main"><button type="button" class="g-open" id="g-open" aria-label="Ampliar imagen">' + img(p.images[0].url, p.images[0].alt, 640, 640, true) + '</button>' + heartBtn(p) + '</div>' +
        '</div>' +
        '<div class="product-info">' +
          '<h1>' + esc(p.name) + '</h1><p class="price" id="p-price">' + (p.fromPrice ? '<span class="price-from">Desde</span> ' : '') + '<span class="price-n" id="p-price-n">' + fmt(p.priceARS) + '</span></p>' +
          (p.shortDescription ? '<p class="short">' + esc(p.shortDescription) + '</p>' : '') +
          pres + buy +
          '<p class="ship-note">Retirás en el local o pedís el envío. El pago se coordina con el local.</p>' +
        '</div>' +
      '</div>' +
      (related.length ? '<section class="block" aria-labelledby="rel-t">' + head('También te puede gustar').replace('<h2>', '<h2 id="rel-t">') + grid(related) + '</section>' : '') +
      '</div>' +
      (p.available ? '<div class="sticky-cta" id="sticky-cta" inert><div class="sc-info"><strong>' + esc(p.name) + '</strong><span>' + fmt(p.priceARS) + '</span></div><button type="button" class="btn" data-add="' + p.id + '" data-qty-from="#qty"><span class="lbl">Agregar</span></button></div>' : '');

    return {
      title: p.name, description: p.shortDescription || p.name, html: html,
      mount: function (root) {
        $('#g-open', root).addEventListener('click', function () { lightbox(p, 0, this); });
        $$('input[name="pres"]', root).forEach(function (r) {
          r.addEventListener('change', function () { var n = $('#p-price-n', root); if (n) n.textContent = fmt(parseInt(r.getAttribute('data-price'), 10)); var pf = $('#p-price .price-from', root); if (pf) pf.hidden = true; });
        });
        var qty = $('#qty', root);
        if (qty) {
          $$('[data-step]', root).forEach(function (b) {
            b.addEventListener('click', function () {
              var v = (parseInt(qty.value, 10) || 1) + parseInt(b.getAttribute('data-step'), 10);
              qty.value = Math.max(1, Math.min(cfg.LIMITS.qtyMax, v));
            });
          });
          qty.addEventListener('change', function () { qty.value = Math.max(1, Math.min(cfg.LIMITS.qtyMax, parseInt(qty.value, 10) || 1)); });
        }
        var sticky = $('#sticky-cta', root), addMain = $('#add-main', root);
        if (sticky && addMain && 'IntersectionObserver' in window) {
          var io = new IntersectionObserver(function (en) {
            var e = en[0], show = !e.isIntersecting && e.boundingClientRect.top < 0;
            sticky.classList.toggle('show', show); sticky.inert = !show;
          });
          io.observe(addMain);
          CL.onCleanup(function () { io.disconnect(); });
        }
      }
    };
  };

  // ---------- visor ampliado accesible ----------
  function lightbox(p, start, opener) {
    var el = document.createElement('div');
    el.className = 'lightbox'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Imagen ampliada de ' + p.name);
    el.innerHTML = '<button type="button" class="lb-close icon-btn" aria-label="Cerrar">' + icon('close') + '</button><figure><img alt="' + esc(p.name) + '" src="' + esc(p.images[0].url) + '"><figcaption>' + esc(p.name) + '</figcaption></figure>';
    document.body.appendChild(el);
    CL.lockScroll(true);
    function close() { document.removeEventListener('keydown', onKey); el.remove(); CL.lockScroll(false); if (opener && opener.focus) opener.focus(); }
    function onKey(e) { if (e.key === 'Escape') { e.preventDefault(); close(); } else CL.trapFocus(el, e); }
    document.addEventListener('keydown', onKey);
    el.addEventListener('click', function (e) { if (e.target.closest('.lb-close') || e.target === el) close(); });
    $('.lb-close', el).focus();
    CL.onCleanup(function () { if (el.isConnected) close(); });
  }

  // ============================================================
  // CARRITO + PEDIDO (el pedido se envía al panel y se confirma solo con ok:true)
  // ============================================================
  function lineHTML(l) {
    var p = l.p;
    return '<li class="cart-line" data-id="' + esc(l.k) + '">' +
      '<a class="cart-thumb"' + link('/producto/' + p.slug) + ' tabindex="-1" aria-hidden="true">' + img(p.images[0].url, '', 160, 160) + '</a>' +
      '<div class="cart-info"><a class="cart-name"' + link('/producto/' + p.slug) + '>' + esc(l.name) + '</a><p class="unit">' + fmt(l.unit) + ' c/u</p>' +
      '<div class="stepper small" role="group" aria-label="Cantidad de ' + esc(l.name) + '"><button type="button" data-line-step="-1" aria-label="Disminuir cantidad de ' + esc(l.name) + '">' + icon('minus') + '</button>' +
      '<input type="number" min="1" max="' + cfg.LIMITS.qtyMax + '" value="' + l.qty + '" inputmode="numeric" data-line-qty aria-label="Cantidad de ' + esc(l.name) + '">' +
      '<button type="button" data-line-step="1" aria-label="Aumentar cantidad de ' + esc(l.name) + '">' + icon('plus') + '</button></div></div>' +
      '<div class="cart-right"><p class="line-total" data-line-total>' + fmt(l.line) + '</p>' +
      '<button type="button" class="link-btn" data-remove="' + esc(l.k) + '" aria-label="Quitar ' + esc(l.name) + ' del carrito">' + icon('trash') + ' Quitar</button></div></li>';
  }

  function field(id, label, extra, o) {
    o = o || {};
    var input = o.textarea
      ? '<textarea id="f-' + id + '" name="' + id + '" rows="3" maxlength="' + cfg.LIMITS.notes + '" ' + (extra || '') + ' aria-describedby="e-' + id + '"></textarea>'
      : '<input id="f-' + id + '" name="' + id + '" ' + (extra || '') + ' aria-describedby="e-' + id + '"' + (o.value ? ' value="' + esc(o.value) + '"' : '') + '>';
    return '<div class="field" data-field="' + id + '"><label for="f-' + id + '">' + label + (o.optional ? ' <span class="opt">(opcional)</span>' : '') + '</label>' + input +
      '<p class="field-error" id="e-' + id + '"></p>' + (o.hint ? '<p class="field-hint" id="h-' + id + '">' + o.hint + '</p>' : '') + '</div>';
  }
  function radios(name, legend, opts) {
    return '<fieldset class="choice"><legend>' + legend + '</legend>' + opts.map(function (o, i) {
      return '<label class="choice-opt"><input type="radio" name="' + name + '" value="' + o[0] + '"' + (i === 0 ? ' checked' : '') + '><span>' + o[1] + '</span></label>';
    }).join('') + '</fieldset>';
  }
  function val(name) { var r = $('input[name="' + name + '"]:checked'); return r ? r.value : ''; }

  V.carrito = function () {
    var L = cfg.LIMITS;
    var html = '<div class="wrap block cart-page">' + crumbs([{ name: 'Inicio', path: '/' }, { name: 'Carrito' }]) +
      '<h1>Tu carrito</h1><div id="cart-root"></div></div>';

    function build(root) {
      var box = $('#cart-root', root), lines = CL.cartLines();
      if (!lines.length) {
        box.innerHTML = emptyState('Tu carrito está vacío', 'Sumá productos para armar tu pedido.', '<a class="btn"' + link('/') + '>Seguir mirando</a><a class="btn btn-soft"' + link('/ideas') + '>Ideas para regalar</a>');
        CL.fixLinks(box); CL.reveal(box); return;
      }
      var live = CL.live;
      box.innerHTML = '<p class="note demo-note">' + (live ? 'El pedido llega directo al panel del local. ' : 'Modo demostración: el pedido no se envía a ningún panel. ') + 'No hay cobro online: el pago se coordina con el local.</p>' +
        '<div class="cart-layout"><div class="cart-main"><ul class="cart-lines" id="cart-lines">' + lines.map(lineHTML).join('') + '</ul>' +
        '<form id="order-form" class="order-form" novalidate autocomplete="on"><h2>Tus datos</h2>' +
          '<p class="field-hint">Usamos estos datos solo para gestionar tu pedido.</p>' +
          field('name', 'Nombre y apellido', 'type="text" autocomplete="name" maxlength="' + L.name + '" required') +
          field('phone', 'Teléfono de contacto', 'type="tel" autocomplete="tel" inputmode="tel" maxlength="30" required', { hint: 'Con código de área, por ejemplo 342 5123456.' }) +
          radios('modalidad', '¿Cómo lo recibís?', [['retiro', 'Retiro en el local'], ['envio', 'Envío a domicilio']]) +
          '<div id="addr-box" hidden>' + field('address', 'Dirección de entrega', 'type="text" autocomplete="street-address" maxlength="' + L.address + '"') + '</div>' +
          radios('metodoPago', 'Forma de pago', [['efectivo', 'Efectivo'], ['transferencia', 'Transferencia']]) +
          field('notes', 'Observaciones', '', { textarea: true, optional: true }) +
          '<div class="hp" aria-hidden="true"><label>No completar este campo <input type="text" name="website" id="f-website" tabindex="-1" autocomplete="off"></label></div>' +
          '<div class="field check" data-field="consent"><label><input type="checkbox" id="f-consent" name="consent" aria-describedby="e-consent" required> <span>Acepto que MOONDOS use estos datos para gestionar mi pedido. <a' + link('/privacidad') + '>Política de privacidad</a>.</span></label><p class="field-error" id="e-consent"></p></div>' +
          '<p class="form-status" id="form-status" role="alert"></p>' +
        '</form></div>' +
        '<aside class="cart-summary" aria-label="Resumen del pedido"><h2>Resumen</h2><dl>' +
          '<div><dt>Subtotal</dt><dd id="s-sub" data-v="0">$0</dd></div>' +
          '<div><dt id="s-ship-l">Envío</dt><dd id="s-ship">—</dd></div>' +
          '<div class="total"><dt id="s-total-l">Total estimado</dt><dd id="s-total" data-v="0">$0</dd></div></dl>' +
          '<p class="note" id="s-note"></p>' +
          '<button type="submit" form="order-form" class="btn btn-lg" id="submit-btn"><span class="lbl">Confirmar pedido</span></button>' +
          '<p class="fine">' + (live ? 'El total final lo confirma el local (puede sumar recargo si pagás por transferencia).' : 'En esta demo el pedido no se envía: es solo para mostrar el recorrido.') + '</p>' +
          '<a class="more"' + link('/') + '>Seguir comprando</a></aside></div>';
      CL.fixLinks(box);
      refresh();
      bindForm(root);
    }

    function refresh() {
      var mod = val('modalidad') || 'retiro', t = CL.totals(mod);
      CL.tween($('#s-sub'), t.subtotal, fmt);
      $('#s-ship').textContent = mod === 'envio' ? (t.shipping ? fmt(t.shipping) : 'Se confirma con el local') : 'Retiro sin costo';
      CL.tween($('#s-total'), t.total, fmt);
      $('#s-note').textContent = val('metodoPago') === 'transferencia' && CL.panelConfig && Number(CL.panelConfig.recargoTransferencia) > 0 ? 'La transferencia puede tener un recargo.' : '';
      var ab = $('#addr-box'); if (ab) ab.hidden = mod !== 'envio';
      $$('.cart-line').forEach(function (li) {
        var it = CL.store.find(li.getAttribute('data-id')); if (!it) return;
        var inp = $('[data-line-qty]', li); if (document.activeElement !== inp) inp.value = it.qty;
        CL.tween($('[data-line-total]', li), CL.unitPrice(CL.byId[it.id], it.variantId) * it.qty, fmt);
      });
    }

    var RULES = {
      name: function (v) { return v.trim().split(/\s+/).filter(Boolean).length >= 2 && v.trim().length >= 4 ? '' : 'Escribí tu nombre y apellido.'; },
      phone: function (v) { var d = v.replace(/\D/g, ''); return d.length >= 8 && d.length <= 15 ? '' : 'Ingresá un teléfono válido, con código de área.'; },
      address: function (v) { return val('modalidad') !== 'envio' || v.trim().length >= 5 ? '' : 'Escribí la dirección de entrega.'; }
    };
    function check(name) {
      var inp = $('#f-' + name), wrap = $('[data-field="' + name + '"]'), msg;
      if (name === 'consent') msg = inp.checked ? '' : 'Necesitamos tu consentimiento para continuar.';
      else msg = RULES[name](inp.value);
      $('#e-' + name).textContent = msg;
      inp.setAttribute('aria-invalid', msg ? 'true' : 'false');
      wrap.classList.toggle('invalid', !!msg);
      wrap.classList.toggle('valid', !msg && (name === 'consent' || inp.value.trim() !== ''));
      return !msg;
    }

    function bindForm(root) {
      var form = $('#order-form', root), names = ['name', 'phone', 'address', 'consent'];
      names.forEach(function (n) {
        var inp = $('#f-' + n); inp.addEventListener('blur', function () { if (n === 'consent' || inp.value !== '') check(n); });
        inp.addEventListener('input', function () { if ($('[data-field="' + n + '"]').classList.contains('invalid')) check(n); });
      });
      $$('input[name="modalidad"], input[name="metodoPago"]', root).forEach(function (r) { r.addEventListener('change', refresh); });
      $('#f-consent').addEventListener('change', function () { check('consent'); });
      form.addEventListener('submit', function (e) { e.preventDefault(); submit(form); });
    }

    var pedidoId = null; // se genera al abrir el carrito y se reutiliza solo en el reintento del mismo envío
    function newId() { return 'ord-' + (window.crypto && crypto.randomUUID ? crypto.randomUUID().replace(/-/g, '').slice(0, 24) : Date.now().toString(36) + Math.random().toString(36).slice(2, 10)); }

    function submit(form) {
      var btn = $('#submit-btn'), status = $('#form-status');
      status.textContent = '';
      if ($('#f-website').value) return; // honeypot
      var names = ['name', 'phone', 'address', 'consent'], ok = names.map(check), firstBad = names[ok.indexOf(false)];
      if (firstBad) { status.textContent = 'Revisá los campos marcados.'; $('#f-' + firstBad).focus(); return; }
      var lines = CL.cartLines(); if (!lines.length || btn.disabled) return;
      var mod = val('modalidad') || 'retiro', t = CL.totals(mod);
      var summary = { lines: lines.map(function (l) { return { name: l.name, qty: l.qty }; }), subtotal: t.subtotal, shipping: t.shipping, mod: mod, pago: val('metodoPago') || 'efectivo', demo: !CL.live };
      var customer = $('#f-name').value.trim();
      if (!CL.live) {
        // Demo sin panel: se muestra el recorrido completo pero NO se envía nada.
        summary.numero = null; summary.total = t.total;
        try { sessionStorage.setItem('md_last_order', JSON.stringify(summary)); } catch (e) { /* noop */ }
        CL.store.clear(); CL.updateCounts(); CL.pendingAutoOpen = true;
        CL.navigate('/pedido/enviado', { replace: true }); return;
      }
      if (!pedidoId) pedidoId = newId();
      var payload = {
        pedidoId: pedidoId, nombreCliente: customer, telefono: $('#f-phone').value.trim(), modalidad: mod, metodoPago: summary.pago,
        items: lines.map(function (l) { var it = { productoId: l.p.id, cantidad: l.qty }; if (l.v) it.presentacionId = l.v.id; return it; })
      };
      if (mod === 'envio') payload.direccion = $('#f-address').value.trim();
      var obs = $('#f-notes').value.trim(); if (obs) payload.observaciones = obs;
      btn.disabled = true; btn.setAttribute('aria-busy', 'true'); $('.lbl', btn).textContent = 'Enviando pedido…';
      CL.svc.ordersApi.send(payload).then(function (r) {
        btn.disabled = false; btn.removeAttribute('aria-busy'); $('.lbl', btn).textContent = 'Confirmar pedido';
        if (r && r.ok === true) {
          summary.numero = r.numero; summary.total = r.total; summary.nombre = customer;
          try { sessionStorage.setItem('md_last_order', JSON.stringify(summary)); } catch (e) { /* noop */ }
          pedidoId = null; CL.store.clear(); CL.updateCounts(); CL.pendingAutoOpen = true;
          CL.navigate('/pedido/enviado', { replace: true }); return;
        }
        var code = r && r.code, msg = (r && r.mensaje) || 'No pudimos enviar el pedido. Probá de nuevo en un minuto.';
        if (code === 'CONFLICTO') pedidoId = null;
        if (code === 'BLOQUEADO' || code === 'ERROR') { var wa = CL.waNumber(); if (wa) msg += ' Escribinos por WhatsApp: +' + wa; }
        if (r && r.campos) { Object.keys(r.campos).forEach(function (k) { var map = { nombreCliente: 'name', telefono: 'phone', direccion: 'address' }, f = map[k]; if (f && $('#e-' + f)) { $('#e-' + f).textContent = r.campos[k]; $('[data-field="' + f + '"]').classList.add('invalid'); } }); }
        if (code === 'STOCK_INSUFICIENTE') msg += ' Actualizá la página para ver el stock.';
        status.textContent = msg;
      });
    }

    return {
      title: 'Carrito', description: 'Revisá tu pedido y confirmalo.', html: html,
      mount: function (root) {
        build(root);
        root.addEventListener('click', function (e) {
          var step = e.target.closest('[data-line-step]');
          if (step) {
            var k = step.closest('.cart-line').getAttribute('data-id'), it = CL.store.find(k);
            CL.store.setQty(k, it.qty + parseInt(step.getAttribute('data-line-step'), 10)); CL.updateCounts(); refresh(); return;
          }
          var rm = e.target.closest('[data-remove]');
          if (rm) {
            var rk = rm.getAttribute('data-remove'), li = rm.closest('.cart-line'), name = CL.byId[CL.store.find(rk).id].name;
            var removed = CL.store.remove(rk); CL.updateCounts();
            function after() {
              if (!CL.store.cart.length) build(root); else { if (li.parentNode) li.remove(); refresh(); }
              CL.toast('Quitaste ' + name + ' del carrito.', { label: 'Deshacer', fn: function () { CL.store.restore(removed); CL.updateCounts(); build(root); } });
            }
            if (CL.reduce()) after(); else { li.classList.add('removing'); setTimeout(after, 240); }
          }
        });
        root.addEventListener('change', function (e) {
          var q = e.target.closest('[data-line-qty]'); if (!q) return;
          var k = q.closest('.cart-line').getAttribute('data-id');
          CL.store.setQty(k, q.value); CL.updateCounts(); q.value = CL.store.find(k).qty; refresh();
        });
      }
    };
  };

  // ---------- pedido enviado ----------
  V.pedidoEnviado = function () {
    var o = null; try { o = JSON.parse(sessionStorage.getItem('md_last_order')); } catch (e) { o = null; }
    var auto = !!CL.pendingAutoOpen; CL.pendingAutoOpen = false;
    if (!o) {
      return { title: 'Pedido', description: 'Pedido.', html: '<div class="wrap block page-simple">' + emptyState('No hay un pedido reciente', 'Si querés armar uno, sumá productos al carrito.', '<a class="btn"' + link('/') + '>Seguir mirando</a>') + '</div>' };
    }
    var wa = CL.waNumber();
    var waText = 'Hola MOONDOS, acabo de hacer el pedido' + (o.numero ? ' #' + o.numero : '') + ' en la web.';
    var html = '<div class="wrap block prepared">' +
      '<div class="prepared-card' + (auto ? ' celebrate' : '') + '">' +
        (auto ? '<div class="confetti" aria-hidden="true">' + [1, 2, 3, 4, 5, 6].map(function (i) { return deco(i % 2 ? 'star' : 'heart', 'cf c' + i); }).join('') + '</div>' : '') +
        '<h1>' + (o.demo ? 'Así queda el pedido' : '¡Recibimos tu pedido!') + '</h1>' +
        '<p class="lead">' + (o.demo ? 'Modo demostración: en la web conectada, el pedido aparece al instante en el panel del local, con sonido y aviso.' : 'Ya lo ve el local. Te vamos a contactar para coordinar ' + (o.mod === 'envio' ? 'la entrega' : 'el retiro') + ' y el pago.') + '</p>' +
        (o.numero ? '<p class="ref">Número de pedido: <strong>#' + esc(o.numero) + '</strong></p>' : '') +
        '<ul class="sum-lines">' + o.lines.map(function (l) { return '<li>' + esc(l.name) + ' × ' + l.qty + '</li>'; }).join('') + '</ul>' +
        '<dl class="sum-totals"><div><dt>Subtotal</dt><dd>' + fmt(o.subtotal) + '</dd></div>' +
        '<div class="total"><dt>' + (o.demo ? 'Total estimado' : 'Total') + '</dt><dd>' + fmt(o.total) + '</dd></div></dl>' +
        '<p class="note">' + (o.mod === 'envio' ? 'Envío a domicilio' : 'Retiro en el local') + ' · ' + (o.pago === 'transferencia' ? 'Transferencia' : 'Efectivo') + '</p>' +
        '<div class="prepared-actions">' + (wa && !o.demo ? '<a class="btn btn-lg btn-wa" href="https://wa.me/' + esc(wa) + '?text=' + encodeURIComponent(waText) + '">' + icon('whatsapp') + ' Avisar por WhatsApp</a>' : '') +
        '<a class="btn btn-ghost"' + link('/') + '>Seguir mirando</a></div>' +
      '</div></div>';
    return { title: 'Pedido', description: 'Pedido enviado.', html: html };
  };

  // ============================================================
  // IDEAS PARA REGALAR
  // ============================================================
  V.ideas = function () {
    var html = '<section class="page-head band">' + shapes() + '<div class="wrap head-inner"><div class="head-copy">' + crumbs([{ name: 'Inicio', path: '/' }, { name: 'Ideas para regalar' }]) +
      '<h1>Ideas para regalar</h1><p class="lead">Guías cortas para elegir sin vueltas, según la ocasión.</p></div>' +
      '<figure class="head-img">' + img('assets/img/banner-para-regalar.svg', 'Ideas para regalar (ilustración)', 1200, 560, true) + '</figure></div></section>' +
      '<div class="wrap block">' + decoField() + '<div class="grid grid-3">' + CL.data.articles.map(articleCard).join('') + '</div></div>';
    return { title: 'Ideas para regalar', description: 'Guías cortas para elegir un regalo.', html: html };
  };
  V.articulo = function (m) {
    var a = CL.data.articles.filter(function (x) { return x.slug === m[1]; })[0]; if (!a) return V.notFound();
    var rel = byIds(a.relatedProductIds);
    var html = '<article class="wrap block article">' + crumbs([{ name: 'Inicio', path: '/' }, { name: 'Ideas para regalar', path: '/ideas' }, { name: a.title }]) +
      '<h1>' + esc(a.title) + '</h1><p class="lead">' + esc(a.summary) + '</p>' +
      '<figure class="article-cover">' + img(a.coverImage, a.title, 800, 600, true) + '</figure>' +
      '<div class="prose">' + a.body.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div></article>' +
      (rel.length ? '<section class="wrap block" aria-labelledby="art-rel">' + head('Productos de esta guía').replace('<h2>', '<h2 id="art-rel">') + grid(rel) + '</section>' : '');
    return { title: a.title, description: a.summary, html: html };
  };

  // ============================================================
  // PÁGINAS DE CONTENIDO
  // ============================================================
  V.faq = function () {
    var html = '<div class="wrap block page-simple faq">' + crumbs([{ name: 'Inicio', path: '/' }, { name: 'Preguntas frecuentes' }]) + '<h1>Preguntas frecuentes</h1>' +
      '<p class="note">Respuestas de ejemplo: el local las ajusta a su forma de trabajar.</p>' +
      CL.data.faq.map(function (f) {
        return '<details class="qa" data-reveal><summary>' + esc(f.q) + icon('chevron', 'qa-ic') + '</summary><p>' + esc(f.a) + '</p></details>';
      }).join('') + '</div>';
    return { title: 'Preguntas frecuentes', description: 'Preguntas frecuentes sobre pedidos, retiro y envíos.', html: html };
  };
  V.nosotros = function () {
    var html = '<section class="brand-block page-brand"><div class="wrap brand-inner"><div class="brand-copy">' + crumbs([{ name: 'Inicio', path: '/' }, { name: 'Nosotros' }]) +
      '<h1>Sobre MOONDOS</h1><p>Texto de ejemplo, editable. Acá va la historia real del local: cómo empezó, cómo eligen cada objeto y qué los hace distintos.</p>' +
      '<a class="btn btn-light"' + link('/') + '>Ver productos</a></div><div class="brand-photo">' + img('assets/img/nosotros.svg', 'Objetos de MOONDOS (ilustración)', 800, 800, true) + '</div></div></section>';
    return { title: 'Nosotros', description: 'Sobre MOONDOS.', html: html };
  };
  V.privacidad = function () {
    var html = '<div class="wrap block page-simple">' + crumbs([{ name: 'Inicio', path: '/' }, { name: 'Privacidad' }]) + '<h1>Política de privacidad</h1>' +
      '<p class="notice">Marcador de posición de la demo. La política final la redacta y revisa el local antes de publicar.</p>' +
      '<h2>Cómo funciona esta demo</h2><ul class="plain"><li>El carrito y los guardados se almacenan en tu dispositivo (solo productos y cantidades).</li>' +
      '<li>Tus datos personales no se guardan en tu dispositivo.</li>' +
      '<li>Al confirmar un pedido, los datos del formulario se envían al local para gestionarlo.</li></ul></div>';
    return { title: 'Privacidad', description: 'Política de privacidad (marcador de posición).', html: html };
  };

  V.notFound = function () {
    return { title: 'No encontramos la página', description: 'Página no encontrada.', html: '<div class="wrap block page-simple">' + emptyState('No encontramos esa página', 'Puede que el enlace haya cambiado.', '<a class="btn"' + link('/') + '>Ir al inicio</a>') + '</div>' };
  };
  V.error = function () {
    return { title: 'Algo salió mal', description: 'Error.', html: '<div class="wrap block page-simple">' + emptyState('Algo salió mal', 'Recargá la página o volvé al inicio.', '<button type="button" class="btn" onclick="location.reload()">Recargar</button><a class="btn btn-soft"' + link('/') + '>Ir al inicio</a>') + '</div>' };
  };

  // ---------- rutas ----------
  CL.route(/^\/$/, V.home);
  CL.route(/^\/ideas$/, V.ideas);
  CL.route(/^\/ideas\/([a-z0-9-]+)$/, V.articulo);
  CL.route(/^\/buscar$/, V.buscar);
  CL.route(/^\/guardados$/, V.guardados);
  CL.route(/^\/producto\/([a-z0-9-]+)$/, V.producto);
  CL.route(/^\/carrito$/, V.carrito);
  CL.route(/^\/pedido\/enviado$/, V.pedidoEnviado);
  CL.route(/^\/preguntas-frecuentes$/, V.faq);
  CL.route(/^\/nosotros$/, V.nosotros);
  CL.route(/^\/privacidad$/, V.privacidad);
  CL.route(/^\/([a-z0-9-]+)$/, V.categoria); // debe ir al final: cualquier /<categoria>
})();
