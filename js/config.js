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

  // URL pública del Web App de Apps Script (/exec) del panel Claré: de ahí salen precios, fotos y stock, y ahí entran los pedidos.
  // No es un secreto (es una dirección pública). Vacía = adaptador demo (no se envía nada a ningún lado).
  GAS_WEB_APP_URL: '',

  // 'remote' = catálogo desde el panel (precio, foto, stock y nombre mandan desde el panel; los textos editoriales siguen en js/data.js).
  // 'fixtures' = solo datos demo de js/data.js (no consulta al panel).
  // En modo 'demo', si el panel no responde se usan los datos demo para que la web no quede vacía; en 'produccion' se muestra error.
  CATALOG_SOURCE: 'remote',
  CATALOG_TIMEOUT_MS: 40000, // tiempo máximo total esperando al panel (la web NO se queda esperando: ver services.js)
  CATALOG_WAIT_MS: 6000,     // sin catálogo guardado en el dispositivo: cuánto espera antes de mostrar datos de ejemplo mientras sigue intentando

  // Número informado por Claré, tal cual lo dieron.
  WHATSAPP_PHONE_RAW: '',
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
