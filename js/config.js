/* ============================================================
   MOONDOS — CONFIGURACIÓN CENTRAL (demo preparada por iNGENIA)
   ÚNICO archivo a tocar para conectar la web con el panel.
   No poner contraseñas ni claves acá: este archivo es público.
   ============================================================ */
window.MD_CONFIG = {
  // 'demo' | 'produccion'
  STORE_MODE: 'demo',

  // URL /exec del panel demo de MOONDOS (Lanzador → tarjeta «Conexión con la web»).
  // Vacía = la web usa el catálogo de ejemplo incluido y los pedidos NO se envían a ningún panel.
  PANEL_URL: '',

  // WhatsApp para consultas (solo dígitos, con código de país). Si queda vacío se usa el que devuelve el panel.
  WHATSAPP_PHONE_E164: '',

  BRAND_NAME: 'MOONDOS',
  CURRENCY: 'ARS',
  CONTACT_EMAIL: '',
  INSTAGRAM_URL: '',

  // Nombres de productos a destacar en el inicio (se buscan por nombre; si falta alguno se completa solo).
  FEATURED_NAMES: ['Calendario de adviento 2026', 'Vela de soja vainilla', 'Taza de cerámica', 'Mate de cerámica con bombilla', 'Tabla de madera para picada', 'Cuaderno tapa dura', 'Box desayuno armado', 'Lámina Luna nueva'],

  LIMITS: { name: 80, address: 200, notes: 500, email: 120, qtyMax: 20 }
};
