/* ============================================================
   CLARÉ — CONFIGURACIÓN CENTRAL
   Todo lo que cambia entre demo y producción vive acá.
   No poner contraseñas, tokens ni claves en este archivo.
   ============================================================ */
window.CLARE_CONFIG = {
  // 'demo' | 'produccion'
  // En 'produccion' la tienda se NEGA a funcionar si falta GAS_WEB_APP_URL,
  // WHATSAPP_PHONE_E164 o si el catálogo sigue siendo 'fixtures'.
  STORE_MODE: 'demo',

  // URL pública del Web App de Apps Script (/exec) que recibe el pedido por doPost.
  // PENDIENTE: la provee iNGENIA. Vacía = adaptador demo (no se envía nada a ningún lado).
  GAS_WEB_APP_URL: '',

  // 'fixtures' (datos demo de js/data.js) | 'remote' (pendiente: mecanismo público de catálogo).
  CATALOG_SOURCE: 'fixtures',

  // Número informado por Claré, tal cual lo dieron.
  WHATSAPP_PHONE_RAW: '3466406696',
  // Formato internacional SOLO DÍGITOS para wa.me (ej: '549...'). PENDIENTE de confirmar prefijo/tipo de línea.
  // Vacío en demo = el enlace abre WhatsApp sin contacto elegido y se muestra un aviso.
  WHATSAPP_PHONE_E164: '',

  SHIPPING_CITY: 'Santa Fe',
  SHIPPING_FEE_ARS: 9000, // valor DEMO
  CURRENCY: 'ARS',

  // Textos de marca / contacto (pendientes de Claré)
  BRAND_NAME: 'Claré',
  CONTACT_EMAIL: '', // pendiente
  INSTAGRAM_URL: '', // pendiente

  // Límites de campos (el servidor debe validar también)
  LIMITS: { name: 80, address: 200, notes: 500, email: 120, qtyMax: 20 }
};
