/* ============================================================
   MOONDOS — MODELO DE DATOS
   Convierte la respuesta de ?action=tienda del panel (o el catálogo de ejemplo) en el modelo que usa la web.
   Categorías y subcategorías salen de los propios productos del panel.
   ============================================================ */
(function () {
  var CFG = window.MD_CONFIG;
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim(); }
  function slugify(s) { return norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'x'; }

  // Textos de portada por categoría (si el panel trae una categoría nueva se usa un texto genérico).
  var COPY = {
    'decoracion': { title: 'Para vestir tu casa', description: 'Láminas, floreros, macetas y detalles que le dan carácter a cada rincón.' },
    'velas-y-aromas': { title: 'Velas y aromas', description: 'Velas de soja, difusores y sahumerios para armar un clima.' },
    'cocina-y-mesa': { title: 'Cocina y mesa', description: 'Tazas, mates, copas y tablas para el día a día y para recibir.' },
    'papeleria': { title: 'Papelería', description: 'Cuadernos, agendas 2027 y lapiceras que dan ganas de escribir.' },
    'accesorios': { title: 'Accesorios', description: 'Bolsos, neceseres y llaveros para llevar a todos lados.' },
    'para-regalar': { title: 'Para regalar', description: 'Cajas, tarjetas y boxes armados, listos para sorprender.' },
    'navidad': { title: 'Navidad', description: 'Calendarios de adviento, adornos y velas de temporada.' }
  };

  var ARTICLES = [
    { slug: 'regalos-de-cumpleanos', title: 'Qué regalar en un cumpleaños', summary: 'Ideas simples para acertar sin vueltas, según cuánto quieras gastar.', cover: 'assets/img/banner-para-regalar.svg',
      body: ['Si no sabés qué elegir, una vela y una taza siempre funcionan: son lindas, se usan y entran en cualquier presupuesto.', 'Para alguien que recién se muda, sumá una maceta o una lámina. Para quien ama escribir, un cuaderno con una lapicera buena.', 'Y si querés que llegue listo, armá una caja de regalo con tarjeta: pasás por el local y te lo dejamos envuelto.'],
      related: ['Vela de soja vainilla', 'Taza de cerámica', 'Caja de regalo chica', 'Tarjeta de cumpleaños'] },
    { slug: 'arma-tu-box-de-desayuno', title: 'Armá tu box de desayuno', summary: 'Una combinación fácil de repetir para agasajar a alguien.', cover: 'assets/img/banner-cocina-y-mesa.svg',
      body: ['Elegí una taza o un mate, sumá una vela chica y una tarjeta escrita a mano.', 'Todo entra en una caja de regalo y queda como si lo hubieras planeado hace semanas.', 'Si preferís no armarlo, tenemos un box listo para llevar.'],
      related: ['Box desayuno armado', 'Mate de cerámica con bombilla', 'Set de velas mini', 'Caja de regalo grande'] },
    { slug: 'navidad-que-se-usa-todo-el-ano', title: 'Navidad: regalos que se usan todo el año', summary: 'Más allá del adorno: objetos que siguen siendo lindos en enero.', cover: 'assets/img/banner-navidad.svg',
      body: ['El calendario de adviento es el clásico para arrancar diciembre con ilusión. Los de tela se reutilizan cada año.', 'Para la mesa, copas y repasadores; para el living, velas y guirnaldas.', 'Y para cerrar, tarjetas navideñas con sobre para que cada regalo lleve su mensaje.'],
      related: ['Calendario de adviento 2026', 'Calendario de adviento de tela', 'Copas de vino (x2)', 'Tarjetas navideñas (x6)'] }
  ];
  var FAQ = [
    { q: '¿Cómo hago un pedido?', a: 'Armás el carrito, completás tus datos, elegís si retirás por el local o querés envío y confirmás. El pedido llega directo al local y te contactamos para coordinar.' },
    { q: '¿Puedo retirar en el local?', a: 'Sí. Elegí "Retiro en el local" al confirmar y te avisamos cuando esté listo.' },
    { q: '¿Cómo se paga?', a: 'Efectivo o transferencia. El pago se coordina con el local; no se cobra nada online.' },
    { q: '¿Hacen envíos?', a: 'Sí. El costo de envío se suma al total cuando elegís esa opción.' },
    { q: '¿Preparan regalos?', a: 'Sí, consultá por el envoltorio y las tarjetas con mensaje.' }
  ];

  function build(resp) {
    var prods = [], cats = [], catMap = {}, used = {};
    (resp.productos || []).forEach(function (r, i) {
      if (r.alALaVenta === false) return;
      var catName = r.categoria || 'Otros', cid = slugify(catName);
      if (!catMap[cid]) {
        var cp = COPY[cid] || { title: catName, description: 'Mirá los productos de ' + catName + '.' };
        catMap[cid] = { id: cid, slug: cid, name: catName, title: cp.title, description: cp.description, image: 'assets/img/banner-' + cid + '.svg', subcategories: [], sortOrder: cats.length };
        cats.push(catMap[cid]);
      }
      var sid = null;
      if (r.subcategoria) {
        sid = slugify(r.subcategoria);
        if (!catMap[cid].subcategories.some(function (s) { return s.id === sid; })) catMap[cid].subcategories.push({ id: sid, name: r.subcategoria });
      }
      var pres = (r.presentaciones || []).map(function (x) { return { id: x.presentacionId, name: x.nombre, price: Number(x.precio) || 0 }; });
      var base = Number(r.precioBase != null ? r.precioBase : r.precio) || 0;
      var prices = pres.map(function (x) { return x.price; }).filter(function (n) { return n > 0; });
      var slug = slugify(r.slugWeb || r.nombre); if (used[slug]) slug += '-' + (++used[slug]); else used[slug] = 1;
      prods.push({
        id: r.productoId || r.id, slug: slug, name: r.nombre, shortDescription: r.descripcion || '', description: r.descripcion || '',
        categoryId: cid, subcategoryId: sid, priceARS: pres.length && prices.length ? Math.min.apply(null, prices) : base, fromPrice: pres.length > 0, variants: pres,
        images: [{ url: r.imagenUrl || 'assets/img/nosotros.svg', alt: r.nombre }],
        available: r.disponible !== false && r.estadoStock !== 'sin_stock', featured: false, sortOrder: i
      });
    });
    // destacados por nombre; se completa con productos disponibles
    var byName = {}; prods.forEach(function (p) { byName[norm(p.name)] = p; });
    var feat = [];
    (CFG.FEATURED_NAMES || []).forEach(function (n) { var p = byName[norm(n)]; if (p && p.available && feat.indexOf(p) < 0) feat.push(p); });
    prods.forEach(function (p) { if (feat.length < 8 && p.available && feat.indexOf(p) < 0) feat.push(p); });
    feat.slice(0, 8).forEach(function (p) { p.featured = true; });
    var articles = ARTICLES.map(function (a) {
      return { id: a.slug, slug: a.slug, title: a.title, summary: a.summary, coverImage: a.cover, body: a.body,
        relatedProductIds: a.related.map(function (n) { return byName[norm(n)]; }).filter(Boolean).map(function (p) { return p.id; }) };
    });
    var navidad = catMap['navidad'] || null;
    return { products: prods, categories: cats, articles: articles, faq: FAQ, navidad: navidad };
  }
  window.MD_DATA = { build: build, norm: norm, slugify: slugify };
})();
