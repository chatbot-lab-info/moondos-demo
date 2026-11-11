/* Claré · garabatos dibujados a mano (estrellas, corazones, destellos).
   Se generan con trazos "temblorosos" y un PRNG con semilla: el dibujo es distinto en cada pieza
   pero estable entre cargas. Capa decorativa: aria-hidden, sin eventos, detrás del contenido. */
(function () {
  'use strict';
  var CL = window.CL;

  function rng(seed) { // mulberry32
    var a = seed >>> 0;
    return function () { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function f(n) { return Math.round(n * 10) / 10; }
  // Curva suave que pasa por los puntos (Catmull-Rom abierta)
  function spline(p) {
    var d = 'M' + f(p[0][0]) + ' ' + f(p[0][1]);
    for (var i = 0; i < p.length - 1; i++) {
      var a = p[i - 1] || p[i], b = p[i], c = p[i + 1], e = p[i + 2] || c;
      d += 'C' + f(b[0] + (c[0] - a[0]) / 6) + ' ' + f(b[1] + (c[1] - a[1]) / 6) + ' ' + f(c[0] - (e[0] - b[0]) / 6) + ' ' + f(c[1] - (e[1] - b[1]) / 6) + ' ' + f(c[0]) + ' ' + f(c[1]);
    }
    return d;
  }
  // Segmentos casi rectos con leve curvatura (como un lápiz)
  function poly(p, r, bow) {
    var d = 'M' + f(p[0][0]) + ' ' + f(p[0][1]);
    for (var i = 1; i < p.length; i++) {
      var a = p[i - 1], b = p[i], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], l = Math.sqrt(dx * dx + dy * dy) || 1, k = (r() - .5) * 2 * bow;
      d += 'Q' + f(mx - dy / l * k) + ' ' + f(my + dx / l * k) + ' ' + f(b[0]) + ' ' + f(b[1]);
    }
    return d;
  }
  function jit(r, n) { return (r() - .5) * 2 * n; }

  function starPath(r, pass) {
    var rot = jit(r, .35) - Math.PI / 2, o = 44, i = 19 + jit(r, 3), pts = [], s = Math.floor(r() * 5) * 2;
    for (var k = 0; k <= 10; k++) {
      var idx = (s + k) % 10, ang = rot + idx * Math.PI / 5, rad = (idx % 2 ? i : o) + jit(r, pass ? 2.2 : 1.8);
      pts.push([50 + Math.cos(ang) * rad + jit(r, 1.2), 50 + Math.sin(ang) * rad + jit(r, 1.2)]);
    }
    var last = pts[10], nx = pts[1]; // cierra con un pequeño cruce, como al dibujar a mano
    pts.push([last[0] + (nx[0] - last[0]) * .18, last[1] + (nx[1] - last[1]) * .18]);
    return poly(pts, r, 3.2);
  }
  function heartPath(r, pass) {
    var pts = [], t0 = .15 + jit(r, .2), n = 18, span = Math.PI * 2 + .45 + jit(r, .12), sx = 1 + jit(r, .08);
    for (var k = 0; k <= n; k++) {
      var t = t0 + span * k / n, x = 16 * Math.pow(Math.sin(t), 3), y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      pts.push([50 + x * 2.7 * sx + jit(r, pass ? 1.8 : 1.1), 52 + y * 2.75 + 4 + jit(r, pass ? 1.8 : 1.1)]);
    }
    return spline(pts);
  }
  function sparkPath(r) {
    var j = function () { return jit(r, 2.2); };
    return 'M' + f(50 + j()) + ' ' + f(3 + j()) + 'Q' + f(54 + j()) + ' ' + f(44 + j()) + ' ' + f(97 + j()) + ' ' + f(50 + j()) +
      'Q' + f(56 + j()) + ' ' + f(55 + j()) + ' ' + f(50 + j()) + ' ' + f(97 + j()) +
      'Q' + f(45 + j()) + ' ' + f(56 + j()) + ' ' + f(3 + j()) + ' ' + f(50 + j()) +
      'Q' + f(44 + j()) + ' ' + f(45 + j()) + ' ' + f(51 + j()) + ' ' + f(8 + j());
  }

  // Un garabato: svg cuadrado de `size` px (o con CSS), rotado.
  CL.doodle = function (kind, seed, style, dbl) {
    var r = rng(seed * 9973 + 17), paths = [];
    var make = kind === 'heart' ? heartPath : kind === 'spark' ? sparkPath : starPath;
    paths.push(make(r, 0));
    if (kind !== 'spark' && (dbl || r() < .3)) paths.push(make(r, 1));
    var rot = Math.round(jit(r, 16));
    return '<svg class="dd" viewBox="0 0 100 100" aria-hidden="true" focusable="false" style="' + (style || '') + ';--rot:' + rot + 'deg">' +
      paths.map(function (d, i) { return '<path pathLength="1" d="' + d + '"' + (i ? ' class="p2"' : '') + '/>'; }).join('') + '</svg>';
  };

  // Plantillas de grupos (forma y proporciones tomadas del moodboard): [tipo, x, y, tamaño]
  var CLUSTERS = {
    A: [['heart', 58, 0, 46], ['star', 0, 46, 34], ['star', 4, 112, 48], ['star', 52, 96, 16], ['star', 64, 142, 32], ['heart', 22, 192, 46]],
    B: [['star', 0, 42, 54], ['star', 58, 0, 40], ['star', 52, 64, 32], ['heart', 22, 112, 36]],
    C: [['heart', 0, 0, 50, 1], ['heart', 26, 64, 42]],
    D: [['heart', 0, 0, 28], ['heart', 48, 30, 54], ['heart', 6, 92, 46]],
    E: [['star', 52, 0, 38], ['star', 0, 36, 48], ['star', 46, 56, 30], ['heart', 12, 100, 30]],
    F: [['star', 0, 0, 40], ['spark', 50, 26, 34], ['star', 18, 60, 26]]
  };
  CL.doodleCluster = function (key, seed, scale, flip, w) {
    var items = CLUSTERS[key], maxX = 0, maxY = 0;
    items.forEach(function (it) { maxX = Math.max(maxX, it[1] + it[3]); maxY = Math.max(maxY, it[2] + it[3]); });
    var html = items.map(function (it, i) {
      var x = flip ? maxX - it[1] - it[3] : it[1], s = it[3] * scale;
      return CL.doodle(it[0], seed * 31 + i, 'left:' + f(x * scale) + 'px;top:' + f(it[2] * scale) + 'px;width:' + f(s) + 'px;height:' + f(s) + 'px;--i:' + i, it[4]);
    }).join('');
    return { html: html, w: maxX * scale, h: maxY * scale };
  };

  // Capa de página: grupos repartidos al azar por los bordes libres, detrás del contenido.
  CL.doodles = function (app) {
    if (!app) return;
    var timer = 0, io = null, ro = null, lastH = -1, lastW = -1;
    var seedBase = 0, path = (location.pathname + location.hash); for (var i = 0; i < path.length; i++) seedBase = (seedBase * 31 + path.charCodeAt(i)) % 9973;
    function build() {
      var old = app.querySelector(':scope > .doodle-layer'); if (old) old.remove();
      if (io) io.disconnect();
      var vw = window.innerWidth, H = app.scrollHeight, mobile = vw < 700, r = rng(seedBase + 5);
      var k = mobile ? .5 : Math.max(.85, Math.min(1.3, vw / 1400));
      var hero = app.querySelector('.hero, .page-head, .section-head'), y = 90;
      if (hero) { var hr = hero.getBoundingClientRect(), ar = app.getBoundingClientRect(); y = hr.bottom - ar.top + 28; }
      var wrap = app.querySelector('.wrap'), left = wrap ? wrap.getBoundingClientRect().left : 20, layer = document.createElement('div');
      layer.className = 'doodle-layer'; layer.setAttribute('aria-hidden', 'true');
      var keys = mobile ? ['C', 'D', 'F', 'B'] : ['A', 'B', 'C', 'D', 'E', 'F'], n = 0, side = r() < .5 ? 0 : 1, out = '';
      while (y < H - 140 && n < 14) {
        var key = keys[Math.floor(r() * keys.length)], flip = r() < .5;
        var c = CL.doodleCluster(key, seedBase + n * 7 + 3, k, flip), x;
        var free = left - c.w - 8;
        if (mobile) x = side ? vw - c.w * .62 - 2 : -c.w * .38 + 2;
        else if (free > 24) x = side ? vw - left + 8 + r() * Math.max(0, free - 16) * .8 : 8 + r() * Math.max(0, free - 16) * .8;
        else x = side ? vw - c.w * .75 - r() * 14 : -c.w * .25 + r() * 14;
        out += '<div class="dd-g" style="left:' + f(x) + 'px;top:' + f(y) + 'px;width:' + f(c.w) + 'px;height:' + f(c.h) + 'px">' + c.html + '</div>';
        n++;
        // a veces un segundo grupo del lado opuesto en la misma franja (como en el moodboard)
        if (!mobile && r() < .38) {
          var k2 = keys[Math.floor(r() * keys.length)], c2 = CL.doodleCluster(k2, seedBase + n * 11 + 1, k, r() < .5), x2;
          var free2 = free > 24 ? Math.max(0, free - 16) * .8 : 0;
          x2 = free > 24 ? (side ? 8 + r() * free2 : vw - left + 8 + r() * free2) : (side ? -c2.w * .25 : vw - c2.w * .75);
          out += '<div class="dd-g" style="left:' + f(x2) + 'px;top:' + f(y + 60 + r() * 160) + 'px;width:' + f(c2.w) + 'px;height:' + f(c2.h) + 'px">' + c2.html + '</div>';
        }
        side = r() < .65 ? 1 - side : side;
        y += (mobile ? 360 : 420) * (.7 + r() * .9);
      }
      layer.innerHTML = out; app.appendChild(layer);
      var gs = app.querySelectorAll('.dd-g:not(.in)');
      if (!('IntersectionObserver' in window) || CL.reduce()) { for (var q = 0; q < gs.length; q++) gs[q].classList.add('in'); return; }
      io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
      for (var m = 0; m < gs.length; m++) io.observe(gs[m]);
    }
    function schedule() { clearTimeout(timer); timer = setTimeout(function () { var h = app.scrollHeight, w = window.innerWidth; if (Math.abs(h - lastH) > 40 || w !== lastW) { lastH = h; lastW = w; build(); } }, 220); }
    schedule(); lastH = -1;
    if ('ResizeObserver' in window) { ro = new ResizeObserver(schedule); ro.observe(app); }
    window.addEventListener('resize', schedule);
    CL.onCleanup(function () { clearTimeout(timer); if (ro) ro.disconnect(); if (io) io.disconnect(); window.removeEventListener('resize', schedule); });
  };
})();
