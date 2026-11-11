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
  var catalogApi = {
    load: function () {
      if (CFG.CATALOG_SOURCE === 'fixtures') return Promise.resolve(window.CLARE_DATA);
      // PENDIENTE: mecanismo público de lectura del catálogo real (solo campos públicos de productos activos:
      // id, slug, nombre, descripción aprobada, categoría, precio, fotos, variantes públicas, estado).
      // No exponer costos, observaciones internas, datos de clientes ni stock reservado.
      return Promise.reject(new Error('CATALOG_SOURCE "' + CFG.CATALOG_SOURCE + '" todavía no está implementado.'));
    }
  };

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
      var ok = false;
      try { ok = !!(navigator.sendBeacon && navigator.sendBeacon(CFG.GAS_WEB_APP_URL, body)); } catch (e) { ok = false; }
      if (!ok) {
        // Alternativa única: fetch keepalive, texto plano, sin esperar respuesta.
        try {
          fetch(CFG.GAS_WEB_APP_URL, { method: 'POST', body: body, keepalive: true, mode: 'no-cors', credentials: 'omit' }).catch(function () {});
          ok = true;
        } catch (e) { ok = false; }
      }
      return { mode: 'beacon', queued: ok };
    }
  };

  window.CLARE_SERVICES = { catalogApi: catalogApi, ordersApi: ordersApi, missingConfig: missingConfig };
})();
