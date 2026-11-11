/* ============================================================
   CLARÉ — PRECARGA DEL CATÁLOGO DEL PANEL
   Se carga en el <head>, justo después de config.js: el pedido al panel (Apps Script) arranca YA, en paralelo con la
   descarga del resto de los scripts, en vez de esperar a que la página esté armada. Solo define la función de consulta
   (JSONP: Apps Script no habilita CORS) y dispara la primera consulta; el resto vive en services.js.
   ============================================================ */
(function () {
  var C = window.CLARE_CONFIG;
  window.CLARE_FETCH_TIENDA = function (baseUrl, ms) {
    return new Promise(function (resolve, reject) {
      var cb = '__clareTienda' + Date.now() + Math.floor(Math.random() * 1e6), s = document.createElement('script'), done = false, t, t0 = Date.now();
      function end() { done = true; clearTimeout(t); try { delete window[cb]; } catch (e) { window[cb] = undefined; } if (s.parentNode) s.parentNode.removeChild(s); }
      window[cb] = function (d) { if (done) return; end(); if (d && typeof d === 'object') d.__ms = Date.now() - t0; resolve(d); };
      s.onerror = function () { if (done) return; end(); reject(new Error('No se pudo contactar al panel.')); };
      t = setTimeout(function () { if (done) return; end(); reject(new Error('El panel no respondió en ' + Math.round((ms || 40000) / 1000) + ' segundos.')); }, ms || 40000);
      s.src = baseUrl + (baseUrl.indexOf('?') > -1 ? '&' : '?') + 'action=tienda&callback=' + cb + '&_=' + Date.now();
      (document.head || document.documentElement).appendChild(s);
    });
  };
  if (C && C.CATALOG_SOURCE === 'remote' && C.GAS_WEB_APP_URL) {
    window.CLARE_PREFETCH = window.CLARE_FETCH_TIENDA(C.GAS_WEB_APP_URL, C.CATALOG_TIMEOUT_MS || 40000);
    window.CLARE_PREFETCH.catch(function () { /* el error lo maneja services.js */ });
  }
})();
