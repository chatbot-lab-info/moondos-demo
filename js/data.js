/* ============================================================
   MOONDOS — DATOS BASE de la web (categorías y textos).
   Los productos, precios, fotos y stock salen del panel (acción "tienda"); acá no hay productos de ejemplo.
   Las categorías de la web son las de la tienda actual de MOONDOS (Bazar, Aquí y ahora, Librería, Textil, Mix, Navidad).
   ALIAS: categorías chicas del panel que la web agrupa dentro de otra (clave sin tildes ni mayúsculas).
   FEATURED: nombres de los productos destacados de la home (los mismos que destaca su web actual).
   ============================================================ */
(function () {
  var IMG = 'assets/demo/';
  function sub(name) { return { id: name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), name: name }; }
  function cat(id, name, title, description, subs, order) {
    return { id: id, slug: id, name: name, title: title, description: description, image: IMG + 'cat-combos.svg', subcategories: subs.map(sub), sortOrder: order, status: 'active' };
  }

  var categories = [
    cat('bazar', 'Bazar', 'Bazar', 'Botellas, termos, vasos térmicos, mates y tazas.', ['Botellas', 'Termos', 'Vasos térmicos', 'Todo para el mate', 'Tazas de cerámica', 'Tazas plásticas', 'Tazas de vidrio'], 1),
    cat('aqui-y-ahora', 'Aquí y ahora', 'Aquí y ahora', 'Difusores, aromatizadores, velas, jabones, sahumerios y cremas.', ['Difusores', 'Aromatizadores', 'Velas', 'Jabones', 'Sahumerios', 'Cremas'], 2),
    cat('libreria', 'Librería', 'Librería', 'Agendas 2027, cuadernos, cartucheras, lápices, stickers e imanes.', ['Agendas 2027', 'Cuadernos', 'Cartucheras', 'Lápices y biromes', 'Stickers', 'Imanes y planners', 'Mix'], 3),
    cat('textil', 'Textil', 'Textil', 'Neceseres, mochilas y bolsos, térmicos, medias y guantes infantiles.', ['Neceser', 'Mochilas y bolsos', 'Térmicos', 'Medias', 'Guantes infantiles'], 4),
    cat('mix', 'Mix', 'Mix', 'Peluches, llaveros, broches, paraguas y artículos de viaje.', ['Peluches', 'Llaveros', 'Broches', 'Paraguas', 'Viaje'], 5),
    cat('navidad', 'Navidad', 'Navidad y calendario de adviento', 'Calendarios de adviento 2026 y regalos navideños.', [], 6)
  ];

  // Categorías del panel que se muestran dentro de otra de la web.
  var alias = {
    'hogar y deco': 'bazar', 'calendario de adviento': 'navidad', 'infantil': 'mix',
    'linea propia santa fe': 'mix', 'personalizados': 'mix', 'feria de fran': 'mix'
  };
  var featured = [
    'Calendario de adviento 2026 x10 regalos', 'Calendario de adviento 2026 X 25 REGALOS', 'Agenda Bordada a5 2027', 'Agenda planner 2027',
    'Agenda Edicion limitada 2027', 'Agendia semanal Premium Apa la Papa 2027', 'Agendia Diaria Premium Apa la Papa 2027'
  ];

  var faq = [
    { q: '¿Cómo hago un pedido?', a: 'Armás el carrito, completás tus datos y tocás “Enviar pedido por WhatsApp”; revisás y enviás el mensaje desde WhatsApp.' },
    { q: '¿Cómo coordinamos el pago?', a: 'MOONDOS continúa la coordinación por WhatsApp después de recibir tu mensaje. Pagando en efectivo hay 15% de descuento.' },
    { q: '¿Cuánto cuesta el envío?', a: 'Demo: $9.000 dentro de la ciudad de Santa Fe.' },
    { q: '¿A qué zonas entregan?', a: 'Demo: la tarifa de esta maqueta cubre la ciudad de Santa Fe. La cobertura fuera de la ciudad está pendiente de confirmar.' },
    { q: '¿Cómo sé cuándo llega?', a: null },
    { q: '¿Puedo cambiar o cancelar un pedido?', a: null },
    { q: '¿Tienen local?', a: 'Sí, San Martín 1798, Santa Fe.' }
  ];

  window.CLARE_DATA = { products: [], categories: categories, collections: [], needs: [], articles: [], faq: faq, alias: alias, featured: featured };
})();
