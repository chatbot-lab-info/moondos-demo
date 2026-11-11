/* ============================================================
   MOONDOS — CAPA DE INTEGRACIÓN CON EL PANEL (catálogo y pedidos)
   Contrato: GUIA_conexion_web_panel (iNGENIA). GET ?action=tienda y GET ?action=crearPedido&payload=…
   Nunca se manda 'application/json' ni 'no-cors'; la confirmación se muestra solo con ok:true.
   ============================================================ */
(function () {
  var CFG = window.MD_CONFIG;
  function timeout(ms) { var c = new AbortController(); var t = setTimeout(function () { c.abort(); }, ms); return { signal: c.signal, done: function () { clearTimeout(t); } }; }
  function getJson(url, ms) {
    var t = timeout(ms);
    return fetch(url, { signal: t.signal, credentials: 'omit' }).then(function (r) { t.done(); return r.json(); }, function (e) { t.done(); throw e; });
  }
  var catalogApi = {
    // Devuelve { resp, live }. live=false => catálogo de ejemplo (sin pedidos al panel).
    load: function () {
      var fx = window.MD_FIXTURES;
      if (!CFG.PANEL_URL) return Promise.resolve({ resp: fx, live: false, reason: 'sin-panel' });
      return getJson(CFG.PANEL_URL + '?action=tienda', 20000).then(function (d) {
        if (d && d.ok && Array.isArray(d.productos) && d.productos.length) return { resp: d, live: true };
        return { resp: fx, live: false, reason: 'panel-vacio' };
      }).catch(function (e) {
        if (window.console) console.warn('[MOONDOS] No se pudo leer el panel, uso el catálogo de ejemplo.', e);
        return { resp: fx, live: false, reason: 'sin-conexion' };
      });
    }
  };
  var ordersApi = {
    // payload ya con la forma del panel. Devuelve una promesa con { ok, numero, total, ... } | { ok:false, code, mensaje, campos }.
    send: function (payload) {
      var url = CFG.PANEL_URL + '?action=crearPedido&payload=' + encodeURIComponent(JSON.stringify(payload));
      return getJson(url, 30000).catch(function () { return { ok: false, code: 'RED', mensaje: 'No pudimos conectar. Revisá tu internet y probá de nuevo.' }; });
    }
  };
  window.MD_SERVICES = { catalogApi: catalogApi, ordersApi: ordersApi };
})();
