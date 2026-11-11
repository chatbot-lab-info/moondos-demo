# MOONDOS · web demo (iNGENIA)

Tienda estática (HTML + CSS + JS sin build), rutas con `#`. Se publica con GitHub Pages desde `main` (carpeta raíz).

## Conectar con el panel
Único archivo a tocar: `js/config.js` → `PANEL_URL` = la URL `/exec` del panel demo (Lanzador → tarjeta «Conexión con la web»).
- Con `PANEL_URL` vacío: catálogo de ejemplo (`js/fixtures.js`) y los pedidos NO se envían.
- Con `PANEL_URL`: el catálogo sale de `?action=tienda` y el pedido se manda con `crearPedido` (GET). Se confirma solo con `ok:true`.
- Si el panel no responde, la web cae al catálogo de ejemplo y no manda pedidos.

Contrato: `GUIA_conexion_web_panel` (proyecto INGENIA). Las ilustraciones de productos están en `assets/p/` (las usa también el pack Regalería del panel).
