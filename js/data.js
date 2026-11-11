/* ============================================================
   CLARÉ — DATOS DEMO (fixtures)
   TODO lo de acá es demostrativo y reemplazable. No son datos
   comerciales de Claré: productos, precios, textos y especificaciones
   están pendientes de aprobación del cliente.
   ============================================================ */
(function () {
  var IMG = 'assets/demo/';
  function imgs(slug, alt) {
    return [
      { url: IMG + slug + '-01.svg', alt: alt + ' (ilustración demostrativa)' },
      { url: IMG + slug + '-02.svg', alt: alt + ' en un ambiente (ilustración demostrativa)' }
    ];
  }
  var SPECS_EMPTY = { materials: null, dimensions: null, finish: null, assembly: null, care: null, recommendedStage: null };

  function product(o) {
    return {
      id: 'demo-' + o.slug, slug: o.slug, name: o.name,
      shortDescription: o.short || 'Texto demostrativo, reemplazar por contenido aprobado.',
      description: 'Descripción demostrativa. Claré todavía no compartió el texto real de este producto.',
      categoryId: o.cat, subcategoryId: o.sub || null,
      priceARS: o.price, currency: 'ARS',
      images: imgs(o.slug, o.name),
      variants: [],
      bundleItems: o.bundle || [],
      collectionTags: o.tags || [],
      specifications: SPECS_EMPTY,
      availability: 'demo', featured: !!o.featured, status: 'demo', updatedAt: null,
      sortOrder: o.order
    };
  }

  var products = [
    // --- Muebles ---
    product({ slug: 'biblioteca-frontal', name: 'Biblioteca frontal', cat: 'muebles', sub: 'lectura-organizacion', price: 95000, tags: ['lectura-y-orden'], featured: true, order: 1 }),
    product({ slug: 'estante-bajo', name: 'Estante bajo para juguetes', cat: 'muebles', sub: 'lectura-organizacion', price: 56000, tags: ['lectura-y-orden'], order: 2 }),
    product({ slug: 'estante-madera', name: 'Estante de juguetes de madera', cat: 'muebles', sub: 'lectura-organizacion', price: 66000, tags: ['lectura-y-orden'], order: 3 }),
    product({ slug: 'mesa-silla', name: 'Set de mesa y silla infantil', cat: 'muebles', sub: 'mesas-y-sillas', price: 136000, tags: ['juego-y-construccion', 'autonomia'], featured: true, order: 4 }),
    product({ slug: 'torre-aprendizaje', name: 'Torre de aprendizaje', cat: 'muebles', sub: 'autonomia-movimiento', price: 190000, tags: ['autonomia'], order: 5 }),
    product({ slug: 'cama-baja', name: 'Cama baja', cat: 'muebles', sub: 'descanso', price: 510000, tags: ['autonomia'], order: 6 }),
    // --- Juguetes ---
    product({ slug: 'arco-apilable', name: 'Arco apilable', cat: 'juguetes', sub: 'construccion-encastre', price: 45000, tags: ['juego-y-construccion', 'primeros-pasos'], featured: true, order: 7 }),
    product({ slug: 'bloques-geometricos', name: 'Bloques geométricos', cat: 'juguetes', sub: 'construccion-encastre', price: 65000, tags: ['juego-y-construccion', 'primeros-pasos'], order: 8 }),
    product({ slug: 'cubos-numericos', name: 'Cubos numéricos', cat: 'juguetes', sub: 'construccion-encastre', price: 66000, tags: ['juego-y-construccion'], order: 9 }),
    product({ slug: 'vehiculo-empuje', name: 'Vehículo de empuje', cat: 'juguetes', sub: 'juego-simbolico-movimiento', price: 115000, tags: ['primeros-pasos', 'autonomia'], featured: true, order: 10 }),
    // --- Combos (producto compuesto, precio demo propio, sin descuentos ni tachados) ---
    product({
      slug: 'kit-primeros-pasos', name: 'Kit primeros pasos', cat: 'combos', price: 195000, tags: ['primeros-pasos'], order: 11,
      bundle: [{ productId: 'demo-vehiculo-empuje', name: 'Vehículo de empuje', qty: 1 }, { productId: 'demo-bloques-geometricos', name: 'Bloques geométricos', qty: 1 }]
    }),
    product({
      slug: 'combo-pequeno-artista', name: 'Combo pequeño artista', cat: 'combos', price: 146000, tags: ['juego-y-construccion'], order: 12,
      bundle: [{ productId: 'demo-mesa-silla', name: 'Set de mesa y silla infantil', qty: 1 }, { productId: null, name: 'Set creativo de hojas y crayones (componente demo)', qty: 1 }]
    }),
    product({
      slug: 'kit-bebe-montessori', name: 'Kit bebé Montessori', cat: 'combos', price: 150000, tags: ['primeros-pasos'], order: 13,
      bundle: [{ productId: 'demo-arco-apilable', name: 'Arco apilable', qty: 1 }, { productId: 'demo-cubos-numericos', name: 'Cubos numéricos', qty: 1 }]
    })
  ];

  var categories = [
    {
      id: 'muebles', slug: 'muebles', name: 'Muebles', title: 'Rincón de lectura y estudio',
      description: 'Texto demostrativo. Muebles pensados para ordenar, leer y jugar.', image: IMG + 'cat-muebles.svg',
      subcategories: [
        { id: 'lectura-organizacion', name: 'Lectura y organización' },
        { id: 'mesas-y-sillas', name: 'Mesas y sillas' },
        { id: 'autonomia-movimiento', name: 'Autonomía y movimiento' },
        { id: 'descanso', name: 'Descanso' }
      ], sortOrder: 1, status: 'active'
    },
    {
      id: 'juguetes', slug: 'juguetes', name: 'Juguetes', title: 'Juego libre y construcción',
      description: 'Texto demostrativo. Objetos para construir, apilar y descubrir.', image: IMG + 'cat-juguetes.svg',
      subcategories: [
        { id: 'construccion-encastre', name: 'Construcción y encastre' },
        { id: 'juego-simbolico-movimiento', name: 'Juego simbólico y movimiento' }
      ], sortOrder: 2, status: 'active'
    },
    {
      id: 'combos', slug: 'combos', name: 'Combos', title: 'Sets especiales para cada etapa',
      description: 'Texto demostrativo. Combinaciones de productos con precio propio.', image: IMG + 'cat-combos.svg',
      subcategories: [], sortOrder: 3, status: 'active'
    }
  ];

  // Colecciones editoriales (accesos por necesidad y guía "Por etapa"). Sin edades.
  var collections = [
    { id: 'lectura-y-orden', name: 'Leer y ordenar', moment: 'Lectura y orden', stage: true, description: 'Muebles para guardar libros y juguetes a la altura de los chicos. Colección demo.' },
    { id: 'juego-y-construccion', name: 'Crear y jugar', moment: 'Juego y construcción', stage: true, description: 'Piezas para construir, apilar y crear. Colección demo.' },
    { id: 'autonomia', name: 'Ganar autonomía', moment: null, stage: false, description: 'Muebles y objetos para moverse y elegir solos. Colección demo.' },
    { id: 'primeros-pasos', name: 'Primeros pasos', moment: 'Primeros pasos', stage: true, description: 'Objetos para empezar a explorar. Colección demo, sin rangos de edad.' }
  ];

  var needs = [
    { id: 'leer-ordenar', name: 'Leer y ordenar', collection: 'lectura-y-orden', icon: 'book' },
    { id: 'crear-jugar', name: 'Crear y jugar', collection: 'juego-y-construccion', icon: 'blocks' },
    { id: 'ganar-autonomia', name: 'Ganar autonomía', collection: 'autonomia', icon: 'step' }
  ];

  var articles = [
    {
      id: 'demo-rincon-lectura', slug: 'ideas-rincon-lectura', title: 'Ideas para armar un rincón de lectura',
      summary: 'Ideas generales para sumar un lugar tranquilo de lectura en casa. Contenido demostrativo.',
      coverImage: 'assets/inspiracion/rincon-lectura.jpg',
      body: [
        'Contenido demostrativo: este texto es de ejemplo y será reemplazado por la redacción aprobada por Claré.',
        'Una idea general: elegí un rincón con buena luz y un mueble donde los libros queden a la vista y a la altura de los chicos.',
        'Sumá una alfombra o almohadón para que el lugar invite a quedarse.'
      ],
      relatedProductIds: ['demo-biblioteca-frontal', 'demo-estante-bajo'], status: 'demo', publishedAt: null
    },
    {
      id: 'demo-espacio-juego', slug: 'organizar-espacio-de-juego', title: 'Cómo organizar un espacio de juego',
      summary: 'Ideas generales para ordenar juguetes y dejar lugar para jugar. Contenido demostrativo.',
      coverImage: 'assets/inspiracion/espacio-juego.jpg',
      body: [
        'Contenido demostrativo: este texto es de ejemplo y será reemplazado por la redacción aprobada por Claré.',
        'Una idea general: agrupá los juguetes por tipo y dejá poco a la vista, para que elegir sea simple.',
        'Mantené un espacio despejado en el piso para construir y jugar.'
      ],
      relatedProductIds: ['demo-estante-madera', 'demo-arco-apilable'], status: 'demo', publishedAt: null
    },
    {
      id: 'demo-elegir-muebles', slug: 'elegir-muebles-segun-el-espacio', title: 'Elegir muebles según el espacio disponible',
      summary: 'Ideas generales para pensar medidas y circulación antes de elegir. Contenido demostrativo.',
      coverImage: 'assets/inspiracion/elegir-muebles.jpg',
      body: [
        'Contenido demostrativo: este texto es de ejemplo y será reemplazado por la redacción aprobada por Claré.',
        'Una idea general: medí el lugar antes de elegir y dejá espacio para circular.',
        'Las medidas reales de cada producto se mostrarán cuando Claré las confirme.'
      ],
      relatedProductIds: ['demo-cama-baja', 'demo-torre-aprendizaje'], status: 'demo', publishedAt: null
    }
  ];

  // Preguntas frecuentes. answer:null = pendiente de confirmar por Claré (editable acá).
  var faq = [
    { q: '¿Cómo hago un pedido?', a: 'Demo: armás el carrito, completás tus datos y tocás “Enviar pedido por WhatsApp”; revisás y enviás el mensaje desde WhatsApp.' },
    { q: '¿Cómo coordinamos el pago?', a: 'Demo: Claré continúa la coordinación manualmente por WhatsApp después de recibir tu mensaje.' },
    { q: '¿Cuánto cuesta el envío?', a: 'Demo: $9.000 dentro de la ciudad de Santa Fe.' },
    { q: '¿A qué zonas entregan?', a: 'Demo: la tarifa de esta maqueta cubre la ciudad de Santa Fe. La cobertura fuera de la ciudad está pendiente de confirmar.' },
    { q: '¿Cómo sé cuándo llega?', a: null },
    { q: '¿Los muebles requieren armado?', a: null },
    { q: '¿Puedo cambiar o cancelar un pedido?', a: null },
    { q: '¿Cómo se limpian y cuidan los productos?', a: null }
  ];

  window.CLARE_DATA = { products: products, categories: categories, collections: collections, needs: needs, articles: articles, faq: faq };
})();
