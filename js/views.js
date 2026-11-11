/* ============================================================
   CLARÉ — VISTAS (páginas). Cada vista devuelve { title, description, html, mount }.
   ============================================================ */
(function () {
  'use strict';
  var CL = window.CL, $ = CL.$, $$ = CL.$$, esc = CL.esc, fmt = CL.fmt, link = CL.link, icon = CL.icon, deco = CL.deco, cfg = CL.cfg;
  var V = CL.views;

  // ---------- piezas reutilizables ----------
  function img(src, alt, w, h, eager) {
    return '<img src="' + esc(src) + '" alt="' + esc(alt) + '" width="' + w + '" height="' + h + '" decoding="async"' + (eager ? ' fetchpriority="high"' : ' loading="lazy"') + '>';
  }
  function star(i) { return '<svg class="burst-star s' + i + '" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2l2.5 5.7 6.100.6-4.600 4.100 1.400 6L12 16.400l-5.400 3.200 1.400-6L3.400 9.500l6.100-.6z"/></svg>'; }
  function heartBtn(p) {
    var on = CL.store.isSaved(p.id);
    return '<button type="button" class="heart-btn" data-save="' + p.id + '" aria-pressed="' + on + '" aria-label="Guardar ' + esc(p.name) + '">' +
      icon('heart') + '<span class="burst" aria-hidden="true">' + star(1) + star(2) + star(3) + '</span></button>';
  }
  function priceHTML(p) { return '<p class="price"><span class="price-n">' + fmt(p.priceARS) + '</span>' + (cfg.STORE_MODE === 'produccion' ? '' : '<span class="demo-tag">demo</span>') + '</p>'; }

  function productCard(p, opt) {
    opt = opt || {};
    var includes = '';
    if (opt.includes && p.bundleItems.length) {
      includes = '<ul class="includes">' + p.bundleItems.map(function (b) { return '<li>' + esc(b.name) + (b.qty > 1 ? ' × ' + b.qty : '') + '</li>'; }).join('') + '</ul>';
    }
    return '<article class="card product-card' + (opt.includes ? ' combo-card' : '') + '" data-reveal>' +
      '<a class="card-media"' + link('/producto/' + p.slug) + ' tabindex="-1" aria-hidden="true">' + img(p.images[0].url, p.images[0].alt, 640, 640) + '</a>' +
      heartBtn(p) +
      '<div class="card-body"><h3 class="card-title"><a' + link('/producto/' + p.slug) + '>' + esc(p.name) + '</a></h3>' + includes + priceHTML(p) +
      '<div class="card-actions"><a class="btn btn-soft btn-small"' + link('/producto/' + p.slug) + '>Ver detalle</a>' +
      '<button type="button" class="btn btn-small" data-add="' + p.id + '" aria-label="Agregar ' + esc(p.name) + ' al carrito"><span class="lbl">Agregar</span></button></div></div></article>';
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
  function shipNote() { return 'Envío ' + (cfg.STORE_MODE === 'produccion' ? '' : 'demo ') + fmt(cfg.SHIPPING_FEE_ARS) + ' dentro de la ciudad de ' + cfg.SHIPPING_CITY + '. El pago y la entrega se coordinan por WhatsApp.'; }
  function waNumberNote() {
    return cfg.WHATSAPP_PHONE_E164 ? '' : '<p class="notice notice-demo">Demo: el número de WhatsApp de Claré todavía está pendiente de confirmar, por eso WhatsApp te va a pedir elegir un contacto.</p>';
  }
  function emptyState(title, text, actions) {
    return '<div class="empty" data-reveal>' + deco('heart', 'empty-deco') + '<h2>' + esc(title) + '</h2><p>' + esc(text) + '</p><div class="empty-actions">' + (actions || '') + '</div></div>';
  }
  function byIds(ids) { return ids.map(function (id) { return CL.byId[id]; }).filter(Boolean); }

  // ============================================================
  // HOME
  // ============================================================
  V.home = function () {
    var D = CL.data;
    var featured = D.products.filter(function (p) { return p.featured; }).slice(0, 4);
    var combos = D.products.filter(function (p) { return p.categoryId === 'combos'; });
    var needIcons = { book: 'book', blocks: 'blocks', step: 'step' };
    var html =
      '<section class="hero" id="hero" aria-labelledby="hero-title">' +
        '<div class="hero-shapes" aria-hidden="true"><span class="hb hb1"></span><span class="hb hb2"></span><span class="hb hb3"></span><span class="hb hb4"></span></div>' +
        '<div class="wrap hero-inner">' +
          '<div class="hero-copy"><h1 id="hero-title">Acompaña su crecimiento</h1>' +
            '<p class="lead">Muebles y objetos para descubrir, jugar y ganar autonomía</p>' +
            '<div class="hero-cta"><a class="btn btn-lg" href="#destacados" data-scroll="#destacados">Ver productos</a><a class="btn btn-ghost btn-lg"' + link('/combos') + '>Explorar combos</a></div></div>' +
          '<div class="hero-photo"><div class="hero-frame">' + img('assets/demo/hero.svg', 'Escena de hogar con mesa, silla y arco de madera (ilustración demostrativa)', 1000, 800, true) + '</div></div>' +
        '</div>' +
        '<div class="hero-dots" aria-hidden="true"><i></i><i></i><i></i></div>' +
      '</section>' +

      '<section class="wrap block needs" aria-labelledby="needs-t">' + decoField() +
        '<h2 id="needs-t" class="sr-only">Accesos por necesidad</h2><div class="needs-grid">' +
        D.needs.map(function (n) {
          return '<a class="need" data-reveal' + link('/coleccion/' + n.collection) + '><span class="need-ic">' + icon(needIcons[n.icon]) + '</span><span class="need-name">' + esc(n.name) + '</span>' +
            '<svg class="scribble" viewBox="0 0 120 12" aria-hidden="true"><path pathLength="1" d="M3 7c10-6 18 6 28 0s18 6 28 0 18 6 28 0 18 4 30-1"/></svg></a>';
        }).join('') + '</div></section>' +

      '<section class="wrap block" id="destacados" aria-labelledby="dest-t">' + head('Productos destacados', '/muebles', 'Ver todos los muebles').replace('<h2>', '<h2 id="dest-t">') + grid(featured) + '</section>' +

      '<section class="wrap block" aria-labelledby="combos-t">' + head('Combos para cada espacio', '/combos', 'Ver combos').replace('<h2>', '<h2 id="combos-t">') +
        '<div class="grid grid-3">' + combos.map(function (p) { return productCard(p, { includes: true }); }).join('') + '</div></section>' +

      '<section class="wrap block" aria-labelledby="amb-t">' + head('Ambientes Claré').replace('<h2>', '<h2 id="amb-t">') +
        '<p class="note" data-reveal>Imágenes demostrativas. Se reemplazan por fotos autorizadas de Claré antes de publicar.</p>' +
        '<div class="amb-grid">' +
          '<figure class="amb" data-reveal>' + img('assets/demo/ambiente-01.svg', 'Ambiente demo con estante de madera (ilustración demostrativa)', 800, 600) +
            '<figcaption><a' + link('/producto/estante-madera') + '>Ver Estante de juguetes de madera ' + icon('arrow') + '</a></figcaption></figure>' +
          '<figure class="amb" data-reveal>' + img('assets/demo/ambiente-02.svg', 'Ambiente demo con mesa y silla (ilustración demostrativa)', 800, 600) +
            '<figcaption><a' + link('/producto/mesa-silla') + '>Ver Set de mesa y silla infantil ' + icon('arrow') + '</a></figcaption></figure>' +
        '</div></section>' +

      '<section class="wrap block" aria-labelledby="insp-t">' + head('Inspiración', '/inspiracion', 'Ver guías').replace('<h2>', '<h2 id="insp-t">') +
        '<div class="grid grid-3">' + D.articles.map(articleCard).join('') + '</div></section>' +

      '<section class="brand-block" aria-labelledby="brand-t"><div class="wrap brand-inner">' +
        '<div class="brand-copy" data-reveal><h2 id="brand-t">Sobre Claré</h2>' +
          '<p>Texto de marca pendiente. Esta sección se completa con la historia real que Claré comparta.</p>' +
          '<a class="btn btn-light"' + link('/nosotros') + '>Conocer más</a></div>' +
        '<div class="brand-photo" data-reveal>' + img('assets/demo/nosotros.svg', 'Imagen demostrativa del bloque de marca', 800, 800) + '</div>' +
      '</div></section>' +

      '<section class="wrap block strip" aria-label="Cómo comprar"><ul>' +
        '<li data-reveal><strong>Pedí por WhatsApp</strong><span>Armás el carrito y seguís la conversación con Claré.</span></li>' +
        '<li data-reveal><strong>Envío ' + (cfg.STORE_MODE === 'produccion' ? '' : 'demo ') + fmt(cfg.SHIPPING_FEE_ARS) + '</strong><span>Dentro de la ciudad de ' + esc(cfg.SHIPPING_CITY) + '.</span></li>' +
        '<li data-reveal><strong>Pagos, cambios y garantía</strong><span>A confirmar por Claré.</span></li>' +
      '</ul></section>';
    return {
      title: 'Muebles y juguetes Montessori', description: 'Muebles y juguetes Montessori para chicos. Armá tu pedido y continuá por WhatsApp con Claré.', html: html,
      mount: function (root) { heroMotion(root); }
    };
  };

  function articleCard(a) {
    return '<article class="card article-card" data-reveal><a class="card-media wide"' + link('/inspiracion/' + a.slug) + ' tabindex="-1" aria-hidden="true">' + img(a.coverImage, a.title + ' (ilustración demostrativa)', 800, 600) + '</a>' +
      '<div class="card-body"><h3 class="card-title"><a' + link('/inspiracion/' + a.slug) + '>' + esc(a.title) + '</a></h3><p>' + esc(a.summary) + '</p>' +
      '<a class="more"' + link('/inspiracion/' + a.slug) + '>Leer guía ' + icon('arrow') + '</a></div></article>';
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
    var moments = o.moments ? CL.data.collections.filter(function (c) { return c.stage && base.some(function (p) { return p.collectionTags.indexOf(c.id) > -1; }); }) : [];
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
        return (!st.sub || p.subcategoryId === st.sub) && (!st.col || p.collectionTags.indexOf(st.col) > -1);
      }), st.orden);
    }
    var list = filtered();
    var hasFilters = subs.length || moments.length;

    var html =
      '<section class="page-head band">' + shapes() + '<div class="wrap head-inner"><div class="head-copy">' +
        crumbs([{ name: 'Inicio', path: '/' }, { name: o.crumb }]) +
        '<h1>' + esc(o.h1) + '</h1><p class="lead">' + esc(o.description) + '</p>' +
        (o.activeLabel ? '<p class="active-filter">Filtro activo: <strong>' + esc(o.activeLabel) + '</strong> <a' + link(o.clearPath || '/muebles') + '>Quitar filtro</a></p>' : '') +
        '</div><figure class="head-img">' + img(o.image, o.h1 + ' (ilustración demostrativa)', 1200, 560, true) + '</figure></div></section>' +
      '<div class="wrap listing">' + decoField() +
        '<div class="toolbar">' +
          (hasFilters ? '<button type="button" class="btn btn-soft filter-open" id="filter-open" aria-haspopup="dialog">' + icon('filter') + ' Filtrar <span class="fcount" id="fcount" hidden></span></button>' : '') +
          '<label class="sort"><span>Ordenar por</span><select id="sort">' + SORTS.map(function (s) { return '<option value="' + s[0] + '"' + (st.orden === s[0] ? ' selected' : '') + '>' + s[1] + '</option>'; }).join('') + '</select></label>' +
          '<p class="result-count" id="result-count" role="status" aria-live="polite"></p>' +
          (hasFilters ? '<button type="button" class="link-btn" id="clear-filters" hidden>Limpiar filtros</button>' : '') +
        '</div>' +
        (hasFilters ? '<div class="filters-scrim" id="filters-scrim" hidden></div><div class="filters" id="filters" role="group" aria-label="Filtros" data-lenis-prevent>' +
          '<div class="filters-head"><h2>Filtrar</h2><button type="button" class="icon-btn" id="filters-close" aria-label="Cerrar filtros">' + icon('close') + '</button></div>' +
          (subs.length ? '<div class="fgroup"><p class="fgroup-t" id="fg-sub">Subgrupo</p><div class="chips" role="group" aria-labelledby="fg-sub">' + chips('sub', subs, st.sub) + '</div></div>' : '') +
          (moments.length ? '<div class="fgroup"><p class="fgroup-t" id="fg-col">Momento de uso</p><div class="chips" role="group" aria-labelledby="fg-col">' + chips('col', moments, st.col) + '</div></div>' : '') +
          '<div class="filters-foot"><button type="button" class="btn" id="filters-apply">Ver resultados</button></div></div>' : '') +
        '<div id="grid-wrap" class="grid-wrap"></div>' +
        '<nav class="other-links" aria-label="Otras categorías" data-reveal><p>Seguí explorando:</p>' +
          CL.data.categories.filter(function (c) { return c.id !== o.categoryId; }).map(function (c) { return '<a class="chip chip-link"' + link('/' + c.slug) + '>' + esc(c.name) + '</a>'; }).join('') +
          '<a class="chip chip-link"' + link('/por-etapa') + '>Por etapa</a></nav>' +
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

  function categoryView(id) {
    return function (m, q) {
      var c = CL.catById(id);
      return listing({
        basePath: '/' + c.slug, crumb: c.name, categoryId: c.id, h1: c.title, description: c.description, image: c.image,
        products: CL.data.products.filter(function (p) { return p.categoryId === c.id; }), subs: c.subcategories, moments: true
      }, q);
    };
  }
  V.muebles = categoryView('muebles'); V.juguetes = categoryView('juguetes'); V.combos = categoryView('combos');

  V.coleccion = function (m, q) {
    var col = CL.data.collections.filter(function (c) { return c.id === m[1]; })[0];
    if (!col) return V.notFound();
    return listing({
      basePath: '/coleccion/' + col.id, crumb: col.name, h1: col.name, description: col.description, image: 'assets/demo/cat-coleccion.svg',
      products: CL.data.products.filter(function (p) { return p.collectionTags.indexOf(col.id) > -1; }),
      subs: [], moments: false, activeLabel: col.name, clearPath: '/muebles'
    }, q);
  };

  // ---------- Por etapa (guía por momentos de uso, sin edades) ----------
  V.porEtapa = function () {
    var cols = CL.data.collections.filter(function (c) { return c.stage; });
    var html = '<section class="page-head band">' + shapes() + '<div class="wrap head-inner"><div class="head-copy">' + crumbs([{ name: 'Inicio', path: '/' }, { name: 'Por etapa' }]) +
      '<h1>Por etapa</h1><p class="lead">Una guía para descubrir productos según el momento de uso. Colecciones de muestra, sin rangos de edad.</p></div>' +
      '<figure class="head-img">' + img('assets/demo/cat-coleccion.svg', 'Colecciones por momento de uso (ilustración demostrativa)', 1200, 560, true) + '</figure></div></section>' +
      '<div class="wrap block">' + decoField() + cols.map(function (c) {
        var ps = CL.data.products.filter(function (p) { return p.collectionTags.indexOf(c.id) > -1; }).slice(0, 4);
        return '<section class="stage" aria-labelledby="st-' + c.id + '">' + head(c.moment, '/coleccion/' + c.id, 'Ver colección').replace('<h2>', '<h2 id="st-' + c.id + '">') +
          '<p class="note" data-reveal>' + esc(c.description) + '</p>' + grid(ps) + '</section>';
      }).join('') + '</div>';
    return { title: 'Por etapa', description: 'Guía de descubrimiento por momentos de uso.', html: html };
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
      title: term ? 'Buscar: ' + term : 'Buscar', description: 'Buscar productos en Claré.', html: html,
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
          wrap.innerHTML = l.length ? grid(l, 'saved-grid') : emptyState('Todavía no guardaste nada', 'Tocá el corazón de un producto para guardarlo y verlo más tarde.', '<a class="btn"' + link('/muebles') + '>Explorar muebles</a><a class="btn btn-soft"' + link('/juguetes') + '>Explorar juguetes</a>');
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
  var SPEC_LABELS = [['materials', 'Materiales'], ['dimensions', 'Medidas'], ['finish', 'Terminación'], ['assembly', 'Armado'], ['care', 'Cuidados']];

  V.producto = function (m) {
    var p = CL.bySlug[m[1]]; if (!p) return V.notFound();
    var c = CL.catById(p.categoryId);
    var related = CL.data.products.filter(function (x) { return x.categoryId === p.categoryId && x.id !== p.id; }).slice(0, 4);
    var bundle = '';
    if (p.bundleItems.length) {
      bundle = '<div class="bundle"><h2>Incluye</h2><ul>' + p.bundleItems.map(function (b) {
        var bp = b.productId && CL.byId[b.productId];
        return '<li>' + (bp ? '<a' + link('/producto/' + bp.slug) + '>' + esc(b.name) + '</a>' : esc(b.name)) + (b.qty > 1 ? ' × ' + b.qty : '') + '</li>';
      }).join('') + '</ul><p class="note">Composición ilustrativa, a revisar con Claré. No hay descuentos ni precios de oferta.</p></div>';
    }
    var crumbItems = [{ name: 'Inicio', path: '/' }, { name: c.name, path: '/' + c.slug }, { name: p.name }];
    var thumbs = p.images.length > 1 ? '<div class="thumbs">' + p.images.map(function (im, i) {
      return '<button type="button" class="thumb" data-i="' + i + '" aria-label="Ver imagen ' + (i + 1) + ' de ' + p.images.length + '" aria-current="' + (i === 0) + '">' + img(im.url, '', 160, 160) + '</button>';
    }).join('') + '</div>' : '';
    var html =
      '<div class="wrap product-page">' + crumbs(crumbItems) +
      '<div class="product-layout">' +
        '<div class="gallery" id="gallery" role="group" aria-roledescription="galería" aria-label="Fotos de ' + esc(p.name) + '" tabindex="0">' +
          '<div class="g-main"><button type="button" class="g-open" id="g-open" aria-label="Ampliar imagen">' + img(p.images[0].url, p.images[0].alt, 640, 640, true) + '</button>' +
          (p.images.length > 1 ? '<button type="button" class="g-nav prev" id="g-prev" aria-label="Imagen anterior">' + icon('left') + '</button><button type="button" class="g-nav next" id="g-next" aria-label="Imagen siguiente">' + icon('right') + '</button>' : '') +
          '<p class="g-count sr-only" id="g-count" aria-live="polite"></p>' + heartBtn(p) + '</div>' + thumbs +
        '</div>' +
        '<div class="product-info">' +
          '<h1>' + esc(p.name) + '</h1>' + priceHTML(p) +
          '<p class="short">' + esc(p.shortDescription) + '</p>' +
          '<div class="buy-row"><div class="stepper" role="group" aria-label="Cantidad"><button type="button" data-step="-1" aria-label="Disminuir cantidad">' + icon('minus') + '</button><input id="qty" type="number" min="1" max="' + cfg.LIMITS.qtyMax + '" value="1" inputmode="numeric" aria-label="Cantidad"><button type="button" data-step="1" aria-label="Aumentar cantidad">' + icon('plus') + '</button></div>' +
          '<button type="button" class="btn btn-lg add-main" id="add-main" data-add="' + p.id + '" data-qty-from="#qty"><span class="lbl">Agregar al carrito</span></button></div>' +
          '<p class="ship-note">' + esc(shipNote()) + '</p>' +
          bundle +
          '<div class="desc"><h2>Descripción</h2><p>' + esc(p.description) + '</p></div>' +
          '<div class="specs"><h2>Especificaciones</h2><dl>' + SPEC_LABELS.map(function (s) {
            var v = p.specifications[s[0]]; return '<div><dt>' + s[1] + '</dt><dd' + (v ? '' : ' class="pending"') + '>' + (v ? esc(v) : 'A confirmar por Claré') + '</dd></div>';
          }).join('') + '</dl></div>' +
        '</div>' +
      '</div>' +
      (related.length ? '<section class="block" aria-labelledby="rel-t">' + head('También te puede gustar').replace('<h2>', '<h2 id="rel-t">') + grid(related) + '</section>' : '') +
      '</div>' +
      '<div class="sticky-cta" id="sticky-cta" inert><div class="sc-info"><strong>' + esc(p.name) + '</strong><span>' + fmt(p.priceARS) + '</span></div><button type="button" class="btn" data-add="' + p.id + '" data-qty-from="#qty"><span class="lbl">Agregar</span></button></div>';

    return {
      title: p.name, description: p.shortDescription, html: html,
      mount: function (root) {
        var idx = 0, n = p.images.length, main = $('.g-open img', root), count = $('#g-count', root), gal = $('#gallery', root);
        function show(i, instant) {
          idx = (i + n) % n;
          function set() { main.src = p.images[idx].url; main.alt = p.images[idx].alt; main.classList.remove('swap'); }
          if (instant || CL.reduce()) set(); else { main.classList.add('swap'); setTimeout(set, 140); }
          $$('.thumb', root).forEach(function (t, k) { t.setAttribute('aria-current', String(k === idx)); });
          if (count) count.textContent = 'Imagen ' + (idx + 1) + ' de ' + n;
        }
        $$('.thumb', root).forEach(function (t) { t.addEventListener('click', function () { show(parseInt(t.getAttribute('data-i'), 10)); }); });
        var prev = $('#g-prev', root), next = $('#g-next', root);
        if (prev) prev.addEventListener('click', function () { show(idx - 1); });
        if (next) next.addEventListener('click', function () { show(idx + 1); });
        gal.addEventListener('keydown', function (e) {
          if (n < 2) return;
          if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1); } else if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1); }
        });
        // gesto táctil
        var sx = null;
        $('.g-main', root).addEventListener('pointerdown', function (e) { if (e.pointerType === 'touch') sx = e.clientX; });
        $('.g-main', root).addEventListener('pointerup', function (e) {
          if (sx == null || n < 2) return; var dx = e.clientX - sx; sx = null;
          if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
        });
        $('#g-open', root).addEventListener('click', function () { lightbox(p, idx, this, function (i) { show(i, true); }); });

        // cantidad
        var qty = $('#qty', root);
        $$('[data-step]', root).forEach(function (b) {
          b.addEventListener('click', function () {
            var v = (parseInt(qty.value, 10) || 1) + parseInt(b.getAttribute('data-step'), 10);
            qty.value = Math.max(1, Math.min(cfg.LIMITS.qtyMax, v));
          });
        });
        qty.addEventListener('change', function () { qty.value = Math.max(1, Math.min(cfg.LIMITS.qtyMax, parseInt(qty.value, 10) || 1)); });

        // CTA fijo en móvil cuando el botón original sale del viewport
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
  function lightbox(p, start, opener, onClose) {
    var idx = start, n = p.images.length, prevOverflow = null;
    var el = document.createElement('div');
    el.className = 'lightbox'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Imagen ampliada de ' + p.name);
    el.innerHTML = '<button type="button" class="lb-close icon-btn" aria-label="Cerrar">' + icon('close') + '</button>' +
      (n > 1 ? '<button type="button" class="lb-nav prev icon-btn" aria-label="Imagen anterior">' + icon('left') + '</button><button type="button" class="lb-nav next icon-btn" aria-label="Imagen siguiente">' + icon('right') + '</button>' : '') +
      '<figure><img alt=""><figcaption></figcaption></figure>';
    document.body.appendChild(el);
    CL.lockScroll(true);
    var im = $('img', el), cap = $('figcaption', el);
    function paint() { im.src = p.images[idx].url; im.alt = p.images[idx].alt; cap.textContent = p.name + ' · ' + (idx + 1) + ' de ' + n; }
    function close() {
      document.removeEventListener('keydown', onKey); el.remove(); CL.lockScroll(false);
      if (onClose) onClose(idx); if (opener && opener.focus) opener.focus();
    }
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowLeft' && n > 1) { idx = (idx - 1 + n) % n; paint(); }
      else if (e.key === 'ArrowRight' && n > 1) { idx = (idx + 1) % n; paint(); }
      else CL.trapFocus(el, e);
    }
    document.addEventListener('keydown', onKey);
    el.addEventListener('click', function (e) {
      if (e.target.closest('.lb-close') || e.target === el) close();
      else if (e.target.closest('.prev')) { idx = (idx - 1 + n) % n; paint(); }
      else if (e.target.closest('.next')) { idx = (idx + 1) % n; paint(); }
    });
    var sx = null;
    el.addEventListener('pointerdown', function (e) { if (e.pointerType === 'touch') sx = e.clientX; });
    el.addEventListener('pointerup', function (e) {
      if (sx == null || n < 2) return; var dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 40) { idx = (idx + (dx < 0 ? 1 : -1) + n) % n; paint(); }
    });
    paint(); $('.lb-close', el).focus();
    CL.onCleanup(function () { if (el.isConnected) close(); });
  }

  // ============================================================
  // CARRITO + PEDIDO
  // ============================================================
  function lineHTML(l) {
    var p = l.p;
    return '<li class="cart-line" data-id="' + p.id + '">' +
      '<a class="cart-thumb"' + link('/producto/' + p.slug) + ' tabindex="-1" aria-hidden="true">' + img(p.images[0].url, '', 160, 160) + '</a>' +
      '<div class="cart-info"><a class="cart-name"' + link('/producto/' + p.slug) + '>' + esc(p.name) + '</a><p class="unit">' + fmt(p.priceARS) + ' c/u</p>' +
      '<div class="stepper small" role="group" aria-label="Cantidad de ' + esc(p.name) + '"><button type="button" data-line-step="-1" aria-label="Disminuir cantidad de ' + esc(p.name) + '">' + icon('minus') + '</button>' +
      '<input type="number" min="1" max="' + cfg.LIMITS.qtyMax + '" value="' + l.qty + '" inputmode="numeric" data-line-qty aria-label="Cantidad de ' + esc(p.name) + '">' +
      '<button type="button" data-line-step="1" aria-label="Aumentar cantidad de ' + esc(p.name) + '">' + icon('plus') + '</button></div></div>' +
      '<div class="cart-right"><p class="line-total" data-line-total>' + fmt(l.line) + '</p>' +
      '<button type="button" class="link-btn" data-remove="' + p.id + '" aria-label="Quitar ' + esc(p.name) + ' del carrito">' + icon('trash') + ' Quitar</button></div></li>';
  }

  function field(id, label, extra, o) {
    o = o || {};
    var input = o.textarea
      ? '<textarea id="f-' + id + '" name="' + id + '" rows="3" maxlength="' + cfg.LIMITS.notes + '" ' + (extra || '') + ' aria-describedby="e-' + id + '"></textarea>'
      : '<input id="f-' + id + '" name="' + id + '" ' + (extra || '') + ' aria-describedby="e-' + id + '"' + (o.value ? ' value="' + esc(o.value) + '"' : '') + '>';
    return '<div class="field" data-field="' + id + '"><label for="f-' + id + '">' + label + (o.optional ? ' <span class="opt">(opcional)</span>' : '') + '</label>' + input +
      '<p class="field-error" id="e-' + id + '"></p>' + (o.hint ? '<p class="field-hint" id="h-' + id + '">' + o.hint + '</p>' : '') + '</div>';
  }

  V.carrito = function () {
    var L = cfg.LIMITS;
    var html = '<div class="wrap block cart-page">' + crumbs([{ name: 'Inicio', path: '/' }, { name: 'Carrito' }]) +
      '<h1>Tu carrito</h1><div id="cart-root"></div></div>';

    function build(root) {
      var box = $('#cart-root', root), lines = CL.cartLines();
      if (!lines.length) {
        box.innerHTML = emptyState('Tu carrito está vacío', 'Sumá productos para armar tu pedido.', '<a class="btn"' + link('/muebles') + '>Explorar muebles</a><a class="btn btn-soft"' + link('/juguetes') + '>Explorar juguetes</a><a class="btn btn-soft"' + link('/combos') + '>Ver combos</a>');
        CL.fixLinks(box); CL.reveal(box); return;
      }
      box.innerHTML = '<p class="note demo-note">' + (cfg.STORE_MODE === 'produccion' ? '' : 'Productos y precios de ejemplo. ') + 'No hay cobro online: el pago se coordina por WhatsApp.</p>' +
        '<div class="cart-layout"><div class="cart-main"><ul class="cart-lines" id="cart-lines">' + lines.map(lineHTML).join('') + '</ul>' +
        '<form id="order-form" class="order-form" novalidate autocomplete="on"><h2>Tus datos para coordinar</h2>' +
          '<p class="field-hint">Usamos estos datos solo para gestionar tu pedido. Tu teléfono y tu dirección no se incluyen en el mensaje de WhatsApp.</p>' +
          field('name', 'Nombre y apellido', 'type="text" autocomplete="name" maxlength="' + L.name + '" required') +
          field('phone', 'Teléfono de contacto', 'type="tel" autocomplete="tel" inputmode="tel" maxlength="30" required', { hint: 'Con código de área, por ejemplo 342 000 0000.' }) +
          field('email', 'Correo electrónico', 'type="email" autocomplete="email" maxlength="' + L.email + '"', { optional: true }) +
          field('address', 'Dirección de entrega', 'type="text" autocomplete="street-address" maxlength="' + L.address + '" required') +
          field('city', 'Ciudad o localidad', 'type="text" autocomplete="address-level2" maxlength="60" required', { value: cfg.SHIPPING_CITY }) +
          '<p class="field-hint zone-hint" id="zone-hint" hidden>Fuera de la ciudad de ' + esc(cfg.SHIPPING_CITY) + ' el envío se coordina por WhatsApp.</p>' +
          field('notes', 'Referencias o instrucciones', '', { textarea: true, optional: true }) +
          '<div class="hp" aria-hidden="true"><label>No completar este campo <input type="text" name="website" id="f-website" tabindex="-1" autocomplete="off"></label></div>' +
          '<div class="field check" data-field="consent"><label><input type="checkbox" id="f-consent" name="consent" aria-describedby="e-consent" required> <span>Acepto que Claré use estos datos para gestionar mi pedido. <a' + link('/privacidad') + '>Política de privacidad</a> (pendiente de revisión).</span></label><p class="field-error" id="e-consent"></p></div>' +
          '<p class="form-status" id="form-status" role="alert"></p>' +
        '</form></div>' +
        '<aside class="cart-summary" aria-label="Resumen del pedido"><h2>Resumen</h2><dl>' +
          '<div><dt>Subtotal</dt><dd id="s-sub" data-v="0">$0</dd></div>' +
          '<div><dt id="s-ship-l">Envío</dt><dd id="s-ship">—</dd></div>' +
          '<div class="total"><dt id="s-total-l">Total</dt><dd id="s-total" data-v="0">$0</dd></div></dl>' +
          '<p class="note" id="s-note"></p>' + waNumberNote() +
          '<button type="submit" form="order-form" class="btn btn-lg btn-wa" id="submit-btn">' + icon('whatsapp') + ' <span class="lbl">Enviar pedido por WhatsApp</span></button>' +
          '<p class="fine">Se abre WhatsApp con el mensaje preparado. Tenés que tocar “Enviar” allá para que Claré lo reciba.</p>' +
          '<a class="more"' + link('/muebles') + '>Seguir comprando</a></aside></div>';
      CL.fixLinks(box);
      refresh();
      bindForm(root);
    }

    function city() { var c = $('#f-city'); return c ? c.value : cfg.SHIPPING_CITY; }
    var demo = cfg.STORE_MODE !== 'produccion';
    function refresh() {
      var t = CL.totals(city());
      CL.tween($('#s-sub'), t.subtotal, fmt);
      $('#s-ship-l').textContent = 'Envío' + (demo ? ' demo' : '');
      $('#s-ship').textContent = t.inZone ? fmt(t.shipping) : 'A coordinar por WhatsApp';
      $('#s-total-l').textContent = t.inZone ? ('Total' + (demo ? ' demo' : '')) : 'Total parcial (sin envío)';
      CL.tween($('#s-total'), t.total, fmt);
      $('#s-note').textContent = t.inZone ? '' : 'El costo de envío fuera de la ciudad se confirma con Claré.';
      $$('.cart-line').forEach(function (li) {
        var it = CL.store.find(li.getAttribute('data-id')); if (!it) return;
        var inp = $('[data-line-qty]', li); if (document.activeElement !== inp) inp.value = it.qty;
        CL.tween($('[data-line-total]', li), CL.byId[it.id].priceARS * it.qty, fmt);
      });
      var zh = $('#zone-hint'); if (zh) zh.hidden = t.inZone;
    }

    // ----- validaciones -----
    var RULES = {
      name: function (v) { return v.trim().split(/\s+/).filter(Boolean).length >= 2 && v.trim().length >= 4 ? '' : 'Escribí tu nombre y apellido.'; },
      phone: function (v) { var d = v.replace(/\D/g, ''); return d.length >= 8 && d.length <= 15 ? '' : 'Ingresá un teléfono válido, con código de área.'; },
      email: function (v) { return !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Revisá el correo electrónico.'; },
      address: function (v) { return v.trim().length >= 5 ? '' : 'Escribí la dirección de entrega.'; },
      city: function (v) { return v.trim().length >= 2 ? '' : 'Indicá la ciudad o localidad.'; }
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
      var form = $('#order-form', root), names = ['name', 'phone', 'email', 'address', 'city', 'consent'];
      names.forEach(function (n) {
        var inp = $('#f-' + n); inp.addEventListener('blur', function () { if (n === 'consent' || inp.value !== '') check(n); });
        inp.addEventListener('input', function () { if ($('[data-field="' + n + '"]').classList.contains('invalid')) check(n); if (n === 'city') refresh(); });
      });
      $('#f-consent').addEventListener('change', function () { check('consent'); });
      form.addEventListener('submit', function (e) { e.preventDefault(); submit(form); });
    }

    function submit(form) {
      var btn = $('#submit-btn'), status = $('#form-status');
      status.textContent = '';
      if ($('#f-website').value) return; // honeypot
      var missing = CL.svc.missingConfig();
      if (missing.length) { status.textContent = 'La tienda no está configurada para producción. Falta: ' + missing.join('; ') + '.'; return; }
      var ok = ['name', 'phone', 'email', 'address', 'city', 'consent'].map(check), firstBad = ['name', 'phone', 'email', 'address', 'city', 'consent'][ok.indexOf(false)];
      if (firstBad) { status.textContent = 'Revisá los campos marcados.'; $('#f-' + firstBad).focus(); return; }
      var lines = CL.cartLines(); if (!lines.length) return;
      if (btn.disabled) return;
      btn.disabled = true; btn.setAttribute('aria-busy', 'true'); $('.lbl', btn).textContent = 'Preparando pedido…';

      var cityVal = $('#f-city').value.trim(), t = CL.totals(cityVal);
      var ref = 'REF-' + randHex(6).toUpperCase();
      var payload = {
        schemaVersion: 1, idempotencyKey: uuid(), clientReference: ref, mode: cfg.STORE_MODE,
        customer: { name: $('#f-name').value.trim(), phone: $('#f-phone').value.trim(), email: $('#f-email').value.trim() || null },
        delivery: { city: cityVal, address: $('#f-address').value.trim(), notes: $('#f-notes').value.trim() || null },
        items: lines.map(function (l) { return { productId: l.p.id, variantId: null, name: l.p.name, quantity: l.qty, unitPriceARS: l.p.priceARS, lineTotalARS: l.line }; }),
        subtotalARS: t.subtotal, shippingARS: t.shipping, shippingStatus: t.inZone ? 'FIJO' : 'A_COORDINAR', totalARS: t.total, source: 'web'
      };
      // 1) encolar en segundo plano (sin esperar acuse)  2) guardar resumen sin datos personales  3) ir a WhatsApp
      var q = CL.svc.ordersApi.enqueue(payload);
      var text = waText(ref, lines, t);
      var order = {
        ref: ref, lines: lines.map(function (l) { return { name: l.p.name, qty: l.qty }; }), subtotal: t.subtotal, shipping: t.shipping, inZone: t.inZone, total: t.total,
        text: text, waLink: waLink(text), queueMode: q.mode, queued: q.queued, demo: demo
      };
      try { sessionStorage.setItem('clare_last_order', JSON.stringify(order)); } catch (e) { /* noop */ }
      CL.store.clear(); CL.updateCounts();
      CL.pendingAutoOpen = true;
      CL.navigate('/pedido/preparado', { replace: true });
    }

    function randHex(n) {
      var a = new Uint8Array(Math.ceil(n / 2)); (window.crypto || window.msCrypto).getRandomValues(a);
      return Array.prototype.map.call(a, function (b) { return ('0' + b.toString(16)).slice(-2); }).join('').slice(0, n);
    }
    function uuid() {
      if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
      var h = randHex(32); return h.slice(0, 8) + '-' + h.slice(8, 12) + '-4' + h.slice(13, 16) + '-a' + h.slice(17, 20) + '-' + h.slice(20, 32);
    }
    function waText(ref, lines, t) {
      var d = demo ? ' demo' : '', out = ['Hola, quiero continuar con el pedido que armé en la web. Referencia: ' + ref + '.'];
      lines.forEach(function (l) { out.push(l.p.name + ' × ' + l.qty); });
      out.push('Subtotal: ' + fmt(t.subtotal));
      if (t.inZone) { out.push('Envío' + d + ' dentro de ' + cfg.SHIPPING_CITY + ': ' + fmt(t.shipping)); out.push('Total' + d + ': ' + fmt(t.total)); }
      else { out.push('Envío: a coordinar'); out.push('Total parcial (sin envío): ' + fmt(t.total)); }
      return out.join('\n');
    }
    function waLink(text) { var num = (cfg.WHATSAPP_PHONE_E164 || '').replace(/\D/g, ''); return 'https://wa.me/' + num + '?text=' + encodeURIComponent(text); }

    return {
      title: 'Carrito', description: 'Revisá tu pedido y continuá por WhatsApp.', html: html,
      mount: function (root) {
        build(root);
        root.addEventListener('click', function (e) {
          var step = e.target.closest('[data-line-step]');
          if (step) {
            var id = step.closest('.cart-line').getAttribute('data-id'), it = CL.store.find(id);
            CL.store.setQty(id, it.qty + parseInt(step.getAttribute('data-line-step'), 10)); CL.updateCounts(); refresh(); return;
          }
          var rm = e.target.closest('[data-remove]');
          if (rm) {
            var rid = rm.getAttribute('data-remove'), li = rm.closest('.cart-line'), name = CL.byId[rid].name;
            var removed = CL.store.remove(rid); CL.updateCounts();
            function after() {
              if (!CL.store.cart.length) build(root); else { if (li.parentNode) li.remove(); refresh(); }
              CL.toast('Quitaste ' + name + ' del carrito.', { label: 'Deshacer', fn: function () { CL.store.restore(removed); CL.updateCounts(); build(root); } });
              var f = $('.cart-line [data-line-step], #order-form input', root); if (f) f.focus();
            }
            if (CL.reduce()) after(); else { li.classList.add('removing'); setTimeout(after, 240); }
          }
        });
        root.addEventListener('change', function (e) {
          var q = e.target.closest('[data-line-qty]'); if (!q) return;
          var id = q.closest('.cart-line').getAttribute('data-id');
          CL.store.setQty(id, q.value); CL.updateCounts(); q.value = CL.store.find(id).qty; refresh();
        });
      }
    };
  };

  // ---------- pedido preparado ----------
  V.pedidoPreparado = function () {
    var o = null; try { o = JSON.parse(sessionStorage.getItem('clare_last_order')); } catch (e) { o = null; }
    var auto = !!CL.pendingAutoOpen; CL.pendingAutoOpen = false;
    if (!o) {
      return { title: 'Pedido', description: 'Pedido preparado.', html: '<div class="wrap block page-simple">' + emptyState('No hay un pedido preparado', 'Si querés armar uno, sumá productos al carrito.', '<a class="btn"' + link('/muebles') + '>Explorar productos</a>') + '</div>' };
    }
    var d = o.demo ? ' demo' : '';
    var note = o.queueMode === 'demo-simulado'
      ? 'Modo demo: este pedido no se envió a ningún panel.'
      : (o.queued ? 'Se inició el envío de los datos del pedido a Claré en segundo plano. Este sitio no puede confirmar que se haya registrado.' : 'No pudimos iniciar el envío en segundo plano. Igual podés continuar por WhatsApp.');
    var html = '<div class="wrap block prepared">' +
      '<div class="prepared-card' + (auto ? ' celebrate' : '') + '">' +
        (auto ? '<div class="confetti" aria-hidden="true">' + [1, 2, 3, 4, 5, 6].map(function (i) { return deco(i % 2 ? 'star' : 'heart', 'cf c' + i); }).join('') + '</div>' : '') +
        '<h1>Pedido preparado</h1>' +
        '<p class="lead">Tu pedido está preparado. Ahora podés enviarlo por WhatsApp para coordinar el pago y la entrega con Claré.</p>' +
        '<p class="ref">Referencia: <strong>' + esc(o.ref) + '</strong> <span>(es solo una referencia, no una confirmación)</span></p>' +
        '<ul class="sum-lines">' + o.lines.map(function (l) { return '<li>' + esc(l.name) + ' × ' + l.qty + '</li>'; }).join('') + '</ul>' +
        '<dl class="sum-totals"><div><dt>Subtotal</dt><dd>' + fmt(o.subtotal) + '</dd></div>' +
        '<div><dt>Envío' + d + '</dt><dd>' + (o.inZone ? fmt(o.shipping) : 'A coordinar') + '</dd></div>' +
        '<div class="total"><dt>' + (o.inZone ? 'Total' + d : 'Total parcial (sin envío)') + '</dt><dd>' + fmt(o.total) + '</dd></div></dl>' +
        '<p class="notice">Tenés que tocar “Enviar” dentro de WhatsApp para que Claré reciba el mensaje.</p>' +
        '<p class="note">' + esc(note) + '</p>' + waNumberNote() +
        '<p class="auto-msg" id="auto-msg" role="status" aria-live="polite">' + (auto ? 'Abriendo WhatsApp…' : '') + '</p>' +
        '<div class="prepared-actions"><a class="btn btn-lg btn-wa" id="wa-open" href="' + esc(o.waLink) + '">' + icon('whatsapp') + ' Abrir WhatsApp</a>' +
        '<button type="button" class="btn btn-soft" id="copy-sum">' + icon('copy') + ' Copiar resumen y referencia</button>' +
        '<a class="btn btn-ghost"' + link('/') + '>Seguir mirando</a></div>' +
      '</div></div>';
    return {
      title: 'Pedido preparado', description: 'Tu pedido está preparado para enviarlo por WhatsApp.', html: html,
      mount: function (root) {
        $('#copy-sum', root).addEventListener('click', function () {
          var text = o.text;
          function ok() { CL.toast('Resumen copiado.'); }
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fallback); else fallback();
          function fallback() {
            var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
            try { document.execCommand('copy'); ok(); } catch (e) { CL.toast('No pudimos copiar. Seleccioná el texto a mano.'); } ta.remove();
          }
        });
        if (auto) {
          var t = setTimeout(function () { window.location.href = o.waLink; }, CL.reduce() ? 500 : 1100);
          CL.onCleanup(function () { clearTimeout(t); });
        }
      }
    };
  };

  // ============================================================
  // INSPIRACIÓN
  // ============================================================
  V.inspiracion = function () {
    var html = '<section class="page-head band">' + shapes() + '<div class="wrap head-inner"><div class="head-copy">' + crumbs([{ name: 'Inicio', path: '/' }, { name: 'Inspiración' }]) +
      '<h1>Momentos Claré: ideas para el hogar</h1><p class="lead">Ideas generales para pensar espacios de juego, lectura y descanso. Contenido demostrativo.</p></div>' +
      '<figure class="head-img">' + img('assets/demo/cat-inspiracion.svg', 'Inspiración (ilustración demostrativa)', 1200, 560, true) + '</figure></div></section>' +
      '<div class="wrap block">' + decoField() + '<div class="grid grid-3">' + CL.data.articles.map(articleCard).join('') + '</div></div>';
    return { title: 'Inspiración', description: 'Ideas generales para el hogar. Contenido demostrativo.', html: html };
  };
  V.articulo = function (m) {
    var a = CL.data.articles.filter(function (x) { return x.slug === m[1]; })[0]; if (!a) return V.notFound();
    var rel = byIds(a.relatedProductIds);
    var html = '<article class="wrap block article">' + crumbs([{ name: 'Inicio', path: '/' }, { name: 'Inspiración', path: '/inspiracion' }, { name: a.title }]) +
      '<h1>' + esc(a.title) + '</h1><p class="lead">' + esc(a.summary) + '</p>' +
      '<figure class="article-cover">' + img(a.coverImage, a.title + ' (ilustración demostrativa)', 800, 600, true) + '</figure>' +
      '<div class="prose">' + a.body.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') + '</div></article>' +
      (rel.length ? '<section class="wrap block" aria-labelledby="art-rel">' + head('Productos relacionados').replace('<h2>', '<h2 id="art-rel">') + grid(rel) + '</section>' : '');
    return { title: a.title, description: a.summary, html: html };
  };

  // ============================================================
  // PÁGINAS DE CONTENIDO
  // ============================================================
  V.faq = function () {
    var html = '<div class="wrap block page-simple faq">' + crumbs([{ name: 'Inicio', path: '/' }, { name: 'Preguntas frecuentes' }]) + '<h1>Preguntas frecuentes</h1>' +
      '<p class="note">Respuestas de ejemplo. Las que figuran como pendientes las completa Claré.</p>' +
      CL.data.faq.map(function (f) {
        return '<details class="qa" data-reveal><summary>' + esc(f.q) + icon('chevron', 'qa-ic') + '</summary><p' + (f.a ? '' : ' class="pending"') + '>' + esc(f.a || 'Respuesta pendiente de confirmar por Claré.') + '</p></details>';
      }).join('') + '</div>';
    return { title: 'Preguntas frecuentes', description: 'Preguntas frecuentes sobre pedidos, pagos y envíos.', html: html };
  };
  V.nosotros = function () {
    var html = '<section class="brand-block page-brand"><div class="wrap brand-inner"><div class="brand-copy">' + crumbs([{ name: 'Inicio', path: '/' }, { name: 'Nosotros' }]) +
      '<h1>Sobre Claré</h1><p>Contenido demostrativo y editable. La historia, los valores y el equipo de Claré se cargan cuando la marca los comparta.</p>' +
      '<a class="btn btn-light"' + link('/muebles') + '>Ver productos</a></div><div class="brand-photo">' + img('assets/demo/nosotros.svg', 'Imagen demostrativa del bloque de marca', 800, 800, true) + '</div></div></section>';
    return { title: 'Nosotros', description: 'Sobre Claré. Contenido demostrativo.', html: html };
  };
  V.privacidad = function () {
    var html = '<div class="wrap block page-simple">' + crumbs([{ name: 'Inicio', path: '/' }, { name: 'Privacidad' }]) + '<h1>Política de privacidad</h1>' +
      '<p class="notice">Marcador de posición. Esta política debe ser redactada y revisada por Claré antes de publicar la tienda. No es texto legal final.</p>' +
      '<h2>Cómo funciona esta demo</h2><ul class="plain"><li>El carrito y los guardados se almacenan en tu dispositivo (solo productos y cantidades).</li>' +
      '<li>La dirección y el teléfono no se guardan en tu dispositivo.</li>' +
      '<li>Al enviar un pedido, la web intenta pasar los datos del formulario a Claré en segundo plano y prepara un mensaje de WhatsApp sin tu dirección ni tu teléfono.</li></ul></div>';
    return { title: 'Privacidad', description: 'Política de privacidad (marcador de posición).', html: html };
  };

  V.notFound = function () {
    return { title: 'No encontramos la página', description: 'Página no encontrada.', html: '<div class="wrap block page-simple">' + emptyState('No encontramos esa página', 'Puede que el enlace haya cambiado.', '<a class="btn"' + link('/') + '>Ir al inicio</a><a class="btn btn-soft"' + link('/muebles') + '>Ver productos</a>') + '</div>' };
  };
  V.error = function () {
    return { title: 'Algo salió mal', description: 'Error.', html: '<div class="wrap block page-simple">' + emptyState('Algo salió mal', 'Recargá la página o volvé al inicio.', '<button type="button" class="btn" onclick="location.reload()">Recargar</button><a class="btn btn-soft"' + link('/') + '>Ir al inicio</a>') + '</div>' };
  };
  V.configError = function (missing) {
    return { title: 'Configuración incompleta', description: 'Configuración incompleta.', html: '<div class="wrap block page-simple"><h1>Configuración incompleta</h1><p class="notice">La tienda está en modo producción pero falta configurar:</p><ul class="plain">' + missing.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul><p>Editá <code>js/config.js</code>.</p></div>' };
  };

  // ---------- rutas ----------
  CL.route(/^\/$/, V.home);
  CL.route(/^\/muebles$/, V.muebles);
  CL.route(/^\/juguetes$/, V.juguetes);
  CL.route(/^\/combos$/, V.combos);
  CL.route(/^\/coleccion\/([a-z0-9-]+)$/, V.coleccion);
  CL.route(/^\/por-etapa$/, V.porEtapa);
  CL.route(/^\/inspiracion$/, V.inspiracion);
  CL.route(/^\/inspiracion\/([a-z0-9-]+)$/, V.articulo);
  CL.route(/^\/buscar$/, V.buscar);
  CL.route(/^\/guardados$/, V.guardados);
  CL.route(/^\/producto\/([a-z0-9-]+)$/, V.producto);
  CL.route(/^\/carrito$/, V.carrito);
  CL.route(/^\/pedido\/preparado$/, V.pedidoPreparado);
  CL.route(/^\/preguntas-frecuentes$/, V.faq);
  CL.route(/^\/nosotros$/, V.nosotros);
  CL.route(/^\/privacidad$/, V.privacidad);
})();
