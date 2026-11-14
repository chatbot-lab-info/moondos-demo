# MOONDOS — web demo (iNGENIA)

Demo web para MOONDOS, una regalería (objetos bonitos y útiles) con local a mostrador: sin mesas, sin cocina, sin reservas. Es una demo para mostrarle al prospecto; todavía no es cliente.

## Quién trabaja acá
- Fede (iNGENIA) no sabe de programación. Explicar todo en lenguaje simple, en español rioplatense, paso a paso.
- En textos para mandar como él: sin signos de apertura ¿ ni ¡, sin emojis.
- Los pasos de git (commit/push a `staging`) los hace Claude solo. El pase a `main` lo confirma Fede antes.
- Cuando haya que darle pasos manuales: GitHub Desktop en Windows, diciendo siempre en qué rama pararse, y en tarjetas ordenadas nombrando los botones tal cual se llaman.

## Regla principal: esta web es un CLON de Claré
- La base es una copia EXACTA de la rama `staging` del repo `chatbot-lab-info/clar-`.
- No inventar identidad de marca, colores ni tipografías. Fede ya se enojó cuando se hizo.
- Se adapta de a poco, solo según lo que Fede indique (categorías y productos de la regalería primero).
- No copiar nada de la web actual de MOONDOS.

## Conexión con el panel
- `js/config.js`: `GAS_WEB_APP_URL`, `WHATSAPP_PHONE_RAW` y `WHATSAPP_PHONE_E164` están vacíos A PROPÓSITO. Nunca poner el panel ni el WhatsApp de Claré (los pedidos irían a un cliente real).
- Para conectar: pegar la URL `/exec` del panel de MOONDOS en `GAS_WEB_APP_URL`.
- El panel vive en el repo `ingenia-panel` (pack `regaleria`, atajo `cargarPackRegaleria()`). La web no lo toca.
- Las imágenes de ejemplo del pack están en `assets/p/<slug>.svg` y las usa el panel (GitHub Pages de este repo). No borrarlas.

## Reglas de interfaz (valen siempre)
- Campos de texto con 16px mínimo: tocar un campo en el celular nunca debe hacer zoom. No bloquear el zoom de pellizco.
- Scroll solo vertical, nunca horizontal, tampoco en celular.
- Smooth scroll con Lenis exclusivamente; no usar `window.scrollTo()`.
- Montos con formato `$300.000` (con $ y puntos).
- Círculos siempre perfectos, nunca óvalos.
- Textos de interfaz formales y serios, sin coloquialismos.
- Todo debe cargar y responder al instante; revisar demoras después de cada cambio.
- Todo lo nuevo que se agregue lleva datos ficticios de demo para poder probarlo.
- Siempre: ícono de pantalla de inicio (apple-touch-icon + manifest) e imagen de vista previa del link (og:image 1200x630).

## Ramas y deploy
- Trabajo en `staging`. `main` es producción: no se toca sin que Fede lo confirme.
- Si pasa a cliente: crear rama `cliente/moondos` y recordarle a Fede mover su carpeta de Drive de «02 - Prospectos» a «01 - Clientes».
