/* ============================================================
   CLARÉ — CAPA DE INTEGRACIÓN (catalogApi / ordersApi)
   La UI nunca habla con Apps Script directamente: pasa por acá.
   NO usa google.script.run (la tienda vive en Netlify).
   ============================================================ */
(function () {
  var CFG = window.CLARE_CONFIG;

  // ---------- Validación de configuración ----------
  // En producción no se deja arrancar con valores demo / vacíos.
  function missingConfig() {
    var m = [];
    if (CFG.STORE_MODE === 'produccion') {
      if (!CFG.GAS_WEB_APP_URL) m.push('GAS_WEB_APP_URL (URL del Web App de Apps Script)');
      if (!CFG.WHATSAPP_PHONE_E164) m.push('WHATSAPP_PHONE_E164 (número en formato internacional)');
      if (CFG.CATALOG_SOURCE === 'fixtures') m.push('CATALOG_SOURCE (catálogo real aprobado; hoy son datos demo)');
    }
    return m;
  }

  // ---------- Catálogo ----------
  // Devuelve { products, categories, collections, needs, articles, faq }.
  // Fuente 'remote': el panel (Apps Script, ?action=tienda, por JSONP porque la web vive en otro dominio) manda en
  // nombre, precio, foto principal, categoría y stock. Los textos editoriales, la 2.ª foto, subcategorías, colecciones y
  // combos siguen viniendo de js/data.js (se emparejan por slug = productoId del panel).
  function norm(s) { return String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }

  // Une el catálogo del panel con las fichas editoriales de la web. No modifica window.CLARE_DATA.
  function mergeCatalog(base, tienda) {
    var rows = {}, order = [];
    (tienda.productos || []).forEach(function (r) {
      var id = String(r.productoId || ''); if (!id) return;
      if (!rows[id]) { rows[id] = r; order.push(id); }          // primera presentación = la que muestra la web
    });
    var catByName = {};
    base.categories.forEach(function (c) { catByName[norm(c.name)] = c; catByName[norm(c.id)] = c; });
    function availability(r) { return r.estadoStock === 'sin_stock' ? 'agotado' : (r.estadoStock === 'proximamente' ? 'proximamente' : 'disponible'); }
    function isDemoUrl(u) { return !u || /\/assets\/demo\//.test(u); }

    var used = {}, out = [];
    base.products.forEach(function (fx) {
      var r = rows[fx.slug]; if (!r) return;                     // quitado del panel = no se muestra
      used[fx.slug] = true;
      var p = JSON.parse(JSON.stringify(fx));
      p.name = r.nombre || fx.name; p.priceARS = Number(r.precio) || 0; p.availability = availability(r); p.status = 'panel';
      var cat = catByName[norm(r.categoria)];
      if (cat && cat.id !== fx.categoryId) { p.categoryId = cat.id; p.subcategoryId = null; }
      // Foto cargada en el panel: pasa a ser la única foto (la ilustración demo de la 2.ª posición no se mezcla con fotos reales).
      if (r.imagenUrl && !isDemoUrl(r.imagenUrl)) p.images = [{ url: r.imagenUrl, alt: p.name }];
      else if (r.imagenUrl) p.images[0] = { url: r.imagenUrl, alt: p.images[0].alt };
      out.push(p);
    });
    // Productos creados directamente en el panel (sin ficha en la web): ficha genérica.
    order.forEach(function (id, i) {
      if (used[id]) return;
      var r = rows[id], cat = catByName[norm(r.categoria)]; if (!cat) return;   // categoría que la web no tiene: no se muestra
      out.push({
        id: 'panel-' + id, slug: id, name: r.nombre, shortDescription: '', description: '',
        categoryId: cat.id, subcategoryId: null, priceARS: Number(r.precio) || 0, currency: 'ARS',
        images: [{ url: r.imagenUrl || 'assets/demo/ambiente-01.svg', alt: r.nombre }],
        variants: [], bundleItems: [], collectionTags: [],
        specifications: { materials: null, dimensions: null, finish: null, assembly: null, care: null, recommendedStage: null },
        availability: availability(r), featured: false, status: 'panel', updatedAt: null, sortOrder: 1000 + i
      });
    });
    var data = {}; for (var k in base) if (Object.prototype.hasOwnProperty.call(base, k)) data[k] = base[k];
    data.products = out;
    data.articles = base.articles.map(function (a) {
      var c = JSON.parse(JSON.stringify(a)); c.relatedProductIds = (c.relatedProductIds || []).filter(function (pid) { return out.some(function (p) { return p.id === pid; }); }); return c;
    });
    return data;
  }

  // ---- Carga del catálogo: NUNCA bloquea la página esperando al panel ----
  // 1) Si el dispositivo ya tiene el último catálogo del panel guardado, la web arranca al instante con ese y lo actualiza
  //    en segundo plano (si algo cambió, se redibuja sola).
  // 2) Si es la primera visita, espera hasta CATALOG_WAIT_MS; si el panel tarda más, muestra datos de ejemplo (solo en modo
  //    demo) y sigue esperando: cuando llega, reemplaza todo por lo real. En 'produccion' nunca se muestran datos de ejemplo.
  var CKEY = 'clare_catalog_v1';
  function readCache() { try { var o = JSON.parse(localStorage.getItem(CKEY)); if (o && o.tienda && Array.isArray(o.tienda.productos)) return o; } catch (e) { /* noop */ } return null; }
  function writeCache(t) { try { localStorage.setItem(CKEY, JSON.stringify({ t: Date.now(), tienda: t })); } catch (e) { /* noop */ } }
  function validate(t) { if (!t || !t.ok || !Array.isArray(t.productos)) throw new Error((t && t.error) || 'Respuesta inválida del panel.'); return t; }
  function apply(t) {
    var cf = t.config || {};
    if (Number(cf.envioFijo) > 0) CFG.SHIPPING_FEE_ARS = Number(cf.envioFijo);
    if (!CFG.WHATSAPP_PHONE_E164 && cf.whatsappNumero) CFG.WHATSAPP_PHONE_E164 = String(cf.whatsappNumero).replace(/\D/g, '');
    return mergeCatalog(window.CLARE_DATA, t);
  }
  function setState(st) { window.CLARE_CATALOG_STATE = st; if (services.onStatus) { try { services.onStatus(st); } catch (e) { /* noop */ } } }
  function delay(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function fetchWithRetry() {
    var first = window.CLARE_PREFETCH || window.CLARE_FETCH_TIENDA(CFG.GAS_WEB_APP_URL, CFG.CATALOG_TIMEOUT_MS);
    return first.then(validate).catch(function () {
      return delay(1500).then(function () { return window.CLARE_FETCH_TIENDA(CFG.GAS_WEB_APP_URL, CFG.CATALOG_TIMEOUT_MS); }).then(validate);
    });
  }

  var catalogApi = {
    load: function () {
      if (CFG.CATALOG_SOURCE === 'fixtures' || !CFG.GAS_WEB_APP_URL || !window.CLARE_FETCH_TIENDA) return Promise.resolve(window.CLARE_DATA);
      var demo = CFG.STORE_MODE !== 'produccion', cache = readCache(), t0 = Date.now();
      var remote = fetchWithRetry();
      function ok(t, via) {
        writeCache(t); var d = apply(t);
        setState({ source: 'panel', via: via, products: d.products.length, ms: Date.now() - t0, backendVersion: t.version || 'VIEJA (sin versión: falta publicar Nueva versión del Apps Script)' });
        return d;
      }
      if (cache) {
        var d0 = apply(cache.tienda);
        setState({ source: 'panel-cache', products: d0.products.length, cachedAt: new Date(cache.t).toISOString() });
        remote.then(function (t) { var d = ok(t, 'segundo-plano'); if (services.onData) services.onData(d); })
          .catch(function (err) { setState({ source: 'panel-cache', products: d0.products.length, error: err && err.message, stale: true }); });
        return Promise.resolve(d0);
      }
      var slow = delay(CFG.CATALOG_WAIT_MS || 6000).then(function () { return 'slow'; });
      return Promise.race([remote.then(function (t) { return ok(t, 'directo'); }), slow]).then(function (r) {
        if (r !== 'slow') return r;
        if (!demo) return remote.then(function (t) { return ok(t, 'directo'); });   // producción: espera lo real
        setState({ source: 'demo-local', loading: true });
        remote.then(function (t) { var d = ok(t, 'segundo-plano'); if (services.onData) services.onData(d); })
          .catch(function (err) { setState({ source: 'demo-local', error: err && err.message }); });
        return window.CLARE_DATA;
      }).catch(function (err) {
        if (!demo) throw err;
        if (window.console && console.warn) console.warn('[Claré] Panel no disponible, se usan datos demo locales:', err && err.message);
        setState({ source: 'demo-local', error: err && err.message });
        return window.CLARE_DATA;
      });
    }
  };

  // Envío del pedido por GET/JSONP (el panel responde {ok, numero} y queda guardado para diagnóstico).
  function sendByGet(payload) {
    try {
      var q = encodeURIComponent(JSON.stringify(payload));
      if (q.length > 7000) return false;                      // carrito enorme: solo sendBeacon
      var cb = '__clarePedido' + Date.now() + Math.floor(Math.random() * 1e6), s = document.createElement('script');
      function end() { try { delete window[cb]; } catch (e) { window[cb] = undefined; } if (s.parentNode) s.parentNode.removeChild(s); }
      window[cb] = function (r) { window.CLARE_LAST_ORDER_RESULT = r; end(); };
      s.onerror = function () { window.CLARE_LAST_ORDER_RESULT = { ok: false, error: 'No se pudo contactar al panel.' }; end(); };
      s.src = CFG.GAS_WEB_APP_URL + '?action=crearPedido&callback=' + cb + '&payload=' + q + '&_=' + Date.now();
      document.head.appendChild(s);
      return true;
    } catch (e) { return false; }
  }

  // ---------- Pedidos ----------
  // Contrato lógico (ver spec §12). Texto plano (JSON serializado) para evitar el preflight CORS de Apps Script.
  var ordersApi = {
    isLive: function () { return !!CFG.GAS_WEB_APP_URL; },

    // Encola el pedido sin esperar respuesta. Devuelve { mode, queued }.
    // 'queued' = el navegador aceptó el envío; NO significa que Apps Script lo procesó (sendBeacon no da acuse).
    enqueue: function (payload) {
      var body = JSON.stringify(payload); // string => text/plain, sin Content-Type: application/json
      if (!CFG.GAS_WEB_APP_URL) {
        // Adaptador demo: no sale nada de la máquina del visitante.
        if (window.console && console.info) console.info('[Claré demo] Pedido NO enviado (falta GAS_WEB_APP_URL). Payload:', payload);
        return { mode: 'demo-simulado', queued: false };
      }
      var url = CFG.GAS_WEB_APP_URL + '?action=crearPedido';
      // Vía 1 (legible): GET por JSONP. El resultado queda en window.CLARE_LAST_ORDER_RESULT para poder verificar que el panel lo recibió.
      var viaGet = sendByGet(payload);
      // Vía 2 (sobrevive al cambio de página hacia WhatsApp): sendBeacon, texto plano. Si llegan las dos, el panel ignora la repetida (mismo pedidoId).
      var ok = false;
      try { ok = !!(navigator.sendBeacon && navigator.sendBeacon(url, body)); } catch (e) { ok = false; }
      if (!ok) {
        // Alternativa única: fetch keepalive, texto plano, sin esperar respuesta.
        try {
          fetch(url, { method: 'POST', body: body, keepalive: true, mode: 'no-cors', credentials: 'omit' }).catch(function () {});
          ok = true;
        } catch (e) { ok = false; }
      }
      ok = ok || viaGet;
      return { mode: 'beacon', queued: ok };
    }
  };

  var services = { catalogApi: catalogApi, ordersApi: ordersApi, missingConfig: missingConfig, onStatus: null, onData: null };
  window.CLARE_SERVICES = services;
})();
