# Claré · Web (demo)

Tienda estática (HTML + CSS + JS sin build) de Claré. **Solo la web**: no incluye panel, Apps Script ni publicación.

## ⚠️ Antes de publicar (leer primero)
1. Trabajá **solo en la rama `staging`**.
2. **No hagas merge a `main` sin aprobación**: cada deploy de producción consume créditos compartidos de Netlify.
3. No pegues URLs privadas, tokens ni credenciales en el código ni en chats. `js/config.js` es público para cualquiera que abra el sitio.
4. El sitio está en modo **demo**: `noindex` activo, `robots.txt` bloquea todo, cartel "Productos y precios de ejemplo" visible.

## Cómo verlo
- Doble clic en `index.html` (funciona con rutas tipo `#/producto/...`; las fuentes pueden no cargar desde `file://`, es solo estético).
- O con servidor local, por ejemplo: `npx serve .` y abrir la URL que muestre (rutas limpias `/muebles`, `/producto/...`).

## Estructura
```
index.html            Shell + router (History API; hash en file://)
_redirects            /*  /index.html  200   (necesario en Netlify para rutas limpias)
netlify.toml          Publica la raíz, sin build
robots.txt            Disallow (demo)
css/                  styles.css (sistema de diseño), lenis.css
js/config.js          ← ÚNICO archivo a tocar para pasar de demo a real
js/data.js            Catálogo demo (fixtures): productos, categorías, colecciones, artículos, FAQ
js/services.js        Adaptadores: catálogo y pedidos (demo hoy; endpoint después)
js/core.js            Utilidades, carrito, router, scroll suave, accesibilidad
js/views.js           Vistas/páginas
js/app.js             Arranque, header, menú, búsqueda, mini carrito
js/vendor/lenis.min.js  Scroll suave (local, sin CDN)
assets/fonts/         Quicksand (local)
assets/hero/          Manchas del hero calcadas del moodboard (SVG: base + terracota con parallax)
assets/brand/         Logo de Claré vectorizado (clare-logo.svg; en el sitio va inline y cambia de color: crema en el header, marrón en fondos claros)
assets/demo/          Ilustraciones demo (marcadas "ilustración demo")
```

## Flujo de compra
Carrito → formulario (nombre, teléfono, dirección, ciudad, notas) → "Preparar pedido" → se arma el payload, se envía en segundo plano al endpoint (en demo solo se registra en consola) → pantalla "Pedido preparado" → se abre WhatsApp con el mensaje armado. **La persona debe enviar el mensaje manualmente.** La web nunca dice "pedido recibido".
- El mensaje de WhatsApp **no incluye** teléfono, dirección ni notas.
- Carrito y guardados en `localStorage` (solo IDs y cantidades). Datos personales no se guardan.
- Envío: ciudad "Santa Fe" (y variantes) → $9.000 (demo); otra ciudad → "A coordinar por WhatsApp".

## Datos pendientes para pasar a real (en `js/config.js`)
| Dato | Estado | Qué falta |
|---|---|---|
| `GAS_WEB_APP_URL` | vacío | URL del Apps Script publicado (no existe aún) |
| Contrato del endpoint | no disponible | Confirmar campos. La web envía `schemaVersion, idempotencyKey, clientReference, mode, customer{name,phone,email?,...}, delivery{...}, items[], subtotalARS, shippingARS, shippingStatus, totalARS, source`. Campos extra respecto del spec: `mode`, `shippingStatus` (`A_COORDINAR` si no es Santa Fe ciudad, con `shippingARS:null`), `items[].name`. El Apps Script debe mapearlos |
| `WHATSAPP_PHONE_E164` | vacío | Número con código de país (`549342...`). Sin E.164 el botón muestra un aviso y no abre chat |
| `CATALOG_SOURCE` | `fixtures` | Pasar a `api` cuando exista el endpoint de catálogo, o reemplazar `js/data.js` por el catálogo real |
| Catálogo real | demo | Productos, precios, fotos, medidas, materiales, variantes |
| Foto del hero | `assets/hero/hero-photo.jpg` es la foto que pasó Fede (confirmar derechos de uso) |
| Logo | vectorizado desde el PNG que pasó Fede | Si hay archivo vectorial original (SVG), reemplazar `assets/brand/clare-logo.svg` y el `<symbol id="clare-logo">` de `index.html` |
| Textos | demo | Nosotros, FAQ (respuestas en `null` = pendiente), artículos, política de privacidad |
| Contacto | vacío | `CONTACT_EMAIL`, `INSTAGRAM_URL` |
| Cobertura de envío | solo Santa Fe ciudad | Confirmar zonas y costo real |

`STORE_MODE: 'produccion'` **bloquea** la tienda con un aviso si falta URL del endpoint, E.164 o catálogo real, y quita el `noindex`. Al ir a producción también cambiar `robots.txt`.

## Extras a tener en cuenta
- Ruta adicional `/coleccion/:id` (no estaba en el spec).
- Respeta `prefers-reduced-motion` (sin parallax ni scroll suave).
- Probado con Chromium (escritorio y móvil): navegación, filtros con URL, restauración de scroll, búsqueda, mini carrito, foco/teclado, formulario con errores, flujo completo hasta WhatsApp y verificación de que no se filtran datos personales.

## Publicación (lo seguís vos)
Con GitHub Desktop: crear repo → crear rama `staging` → commit → Publish branch → en Netlify conectar el repo y activar *branch deploys* solo para `staging`. `main` queda para producción con aprobación.

## Notas de la ronda v5
- Garabatos: `js/doodles.js` (generados con semilla, capa detrás del contenido; sin imágenes).
- "Sobre Claré": capas `assets/brand/about-*.svg` + clip `about-photo-clip` (en `index.html`). La foto del bloque es **provisoria** (recorte de `assets/hero/hero-photo.jpg`): reemplazar por foto autorizada de Claré.
- Texto blanco sobre verde salvia (como el moodboard) tiene contraste bajo (~2.3:1); se agregó una sombra suave. Si Claré lo permite, oscurecer levemente el verde del bloque.
