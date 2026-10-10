/* Intro showreel ±9,5 dtk — canvas 2D. Raster → Vector → Layer → XML → Lockup. */
(function () {
  'use strict';
  var R = document.getElementById('intro'); if (!R) return;
  var cv = document.getElementById('introCv'), x = cv.getContext('2d'), sk = document.getElementById('introSkip');
  var DUR = 9.5, W, H, D, U, t = 0, last = 0, raf = 0, on = false, fin = false;
  var AC = '#98ce7b', BG = '#0b0f08', CY = '#67e8f9', PK = '#f0abfc', INK = '#e8f0de', MU = '#9aa88f';
  var cl = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; }, pr = function (t, a, b) { return cl((t - a) / (b - a)); };
  var eo = function (p) { return 1 - Math.pow(1 - p, 4); }, eio = function (p) { return p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
  var eb = function (p) { var c = 1.7; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  var rn = function (n) { var s = Math.sin(n * 127.1 + 311.7) * 43758.5; return s - Math.floor(s); };
  var MARK = new Path2D('M5 23c3-11 8-15 13-15s8 5 9 10');
  function F(s, m) { x.font = (m ? '600 ' : '900 ') + s + 'px ' + (m ? 'ui-monospace,Menlo,Consolas,monospace' : '"Arial Black",Impact,system-ui,sans-serif'); }
  function fit(s, mw, mx) { F(100); return Math.min(mx, 100 * mw / x.measureText(s).width); }
  function mono(s, px, py, col, al, ali) { F(1.8 * U, 1); x.textAlign = ali || 'left'; x.fillStyle = col; x.globalAlpha = al == null ? 1 : al; x.fillText(s, px, py); x.globalAlpha = 1; }
  function size() { W = R.clientWidth || innerWidth; H = R.clientHeight || innerHeight; D = Math.min(devicePixelRatio || 1, 2); cv.width = W * D; cv.height = H * D; x.setTransform(D, 0, 0, D, 0, 0); U = Math.min(W, H * 1.1) / 100; }
  function word(s, cx, cy, sz, tt, a, col, o) {
    o = o || {}; F(sz); x.textAlign = 'left'; var w = [], tot = 0, i, px;
    for (i = 0; i < s.length; i++) { w[i] = x.measureText(s[i]).width; tot += w[i]; } px = cx - tot / 2;
    for (i = 0; i < s.length; i++) {
      var p = eo(pr(tt, a + i * .06, a + i * .06 + .55));
      if (p > 0) { x.save(); x.beginPath(); x.rect(px - sz * .1, cy - sz * .95, w[i] + sz * .2, sz * 1.25); x.clip(); x.translate(0, (1 - p) * sz * 1.15); x.fillStyle = col; x.fillText(s[i], px, cy); x.restore(); }
      px += w[i];
    }
  }
  function mosaic(cx, cy, Rr, th, c, tt, x0, x1) {
    x.save(); x.beginPath(); x.rect(x0, 0, x1 - x0, H); x.clip();
    var b = Rr + th / 2 + c, fl = Math.floor(tt * 14), gx, gy, i, j = 0;
    for (gy = Math.floor((cy - b) / c) * c; gy < cy + b; gy += c, j++) for (gx = Math.floor((cx - b) / c) * c, i = 0; gx < cx + b; gx += c, i++) {
      var px = gx + c / 2, py = gy + c / 2; if (Math.abs(Math.hypot(px - cx, py - cy) - Rr) > th / 2) continue;
      var k = .5 + .5 * Math.sin(Math.atan2(py - cy, px - cx) * 2 + tt * 2);
      x.fillStyle = 'hsl(98 ' + (30 + rn(i * 7 + j * 13 + fl) * 25) + '% ' + (26 + k * 28 + rn(i + j * 31 + fl) * 10) + '%)'; x.fillRect(gx, gy, c + .5, c + .5);
    }
    x.restore();
  }
  function bigGlitch(s, cx, cy, sz, col, dx, gl, fl, sc) {
    F(sz); x.textAlign = 'center'; x.fillStyle = col;
    for (var i = 0; i < 6; i++) {
      x.save(); x.beginPath(); x.rect(0, cy - sz * .9 + i * sz * .2, W, sz * .2 + 1); x.clip();
      x.translate(cx + dx + (gl ? (rn(i * 3 + fl) - .5) * 5 * U : 0), cy); x.scale(1, sc); x.fillText(s, 0, 0); x.restore();
    }
  }
  var XML = ['<scene w="1440" h="1440">', '  <layer id="01" fill="#e8f0de">', '    <path d="M12.4 8.1 C14 9 …"/>', '  </layer>', '  <layer id="02" fill="#98ce7b">', '    <path d="M31.0 4.7 C33 6 …"/>', '  </layer>', '  … 14 layer', '</scene>'];
  function frame(t) {
    var cx = W / 2, cy = H * .4, Rr = 21 * U, inv = 0, u, i, k, fl;
    x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.fillStyle = BG; x.fillRect(0, 0, W, H);

    if (t < 2.05) { /* 1 · RASTER: mosaik piksel, kiri jarum halus */
      var bar = eio(pr(t, .25, 1.75)) * (W + 4);
      F(30 * U); x.textAlign = 'left'; x.lineWidth = 1.5; x.strokeStyle = 'rgba(152,206,123,.22)';
      var mw = x.measureText('PIXEL ').width; for (k = 0; k < 4; k++) x.strokeText('PIXEL ', -t * 14 * U + k * mw, H * .86);
      mosaic(cx, cy, Rr, 7 * U, 9 * U * (1 - .45 * pr(t, 0, 2)), t, bar, W);
      mosaic(cx, cy, Rr, 7 * U, 1.15 * U, t, 0, bar);
      if (bar < W) { x.fillStyle = AC; x.fillRect(bar - 1, 0, 2, H); }
      mono('01 / RASTER', 4 * U, 6 * U, INK); mono(Math.round(pr(t, .25, 1.75) * 100) + '%', W - 4 * U, H - 6 * U, AC, 1, 'right');
    }
    if (t >= 1.95 && t < 4.05) { /* 2 · VEKTOR: kurva Bézier, node, handle, TRACE */
      u = t - 1.95; var o = Rr + 3.5 * U, n = Rr - 3.5 * U, p = eio(pr(u, .1, 1)), a0 = -Math.PI / 2, g = eo(pr(u, 0, .5));
      x.strokeStyle = 'rgba(232,240,222,.18)'; x.lineWidth = 1; x.beginPath(); x.moveTo(cx - W * .5 * g, cy); x.lineTo(cx + W * .5 * g, cy); x.moveTo(cx, cy - H * .3 * g); x.lineTo(cx, cy + H * .3 * g); x.stroke();
      if (u > 1.15) { x.globalAlpha = eo(pr(u, 1.15, 1.6)); x.fillStyle = AC; x.beginPath(); x.arc(cx, cy, o, 0, 7); x.arc(cx, cy, n, 0, 7); x.fill('evenodd'); x.globalAlpha = 1; }
      x.lineWidth = 2; x.strokeStyle = u > 1.3 ? BG : AC;
      x.beginPath(); x.arc(cx, cy, o, a0, a0 + 6.2832 * p); x.stroke(); x.beginPath(); x.arc(cx, cy, n, a0, a0 - 6.2832 * p, true); x.stroke();
      [o, n].forEach(function (r) { for (var q = 0; q < 8; q++) {
        var ang = q * Math.PI / 4 + a0, d = .25 + q * .07, e = eb(pr(u, d, d + .35)); if (e <= 0) continue;
        var px = cx + Math.cos(ang) * r, py = cy + Math.sin(ang) * r, tx = -Math.sin(ang), ty = Math.cos(ang), hl = 3 * U * e;
        x.strokeStyle = 'rgba(232,240,222,.75)'; x.lineWidth = 1; x.beginPath(); x.moveTo(px - tx * hl, py - ty * hl); x.lineTo(px + tx * hl, py + ty * hl); x.stroke();
        x.fillStyle = INK; [-1, 1].forEach(function (s) { x.beginPath(); x.arc(px + tx * hl * s, py + ty * hl * s, .45 * U * e, 0, 7); x.fill(); });
        x.fillStyle = INK; x.strokeStyle = BG; x.lineWidth = 1.5; x.fillRect(px - .6 * U * e, py - .6 * U * e, 1.2 * U * e, 1.2 * U * e); x.strokeRect(px - .6 * U * e, py - .6 * U * e, 1.2 * U * e, 1.2 * U * e);
      } });
      var sw = ['#98ce7b', '#67e8f9', '#f0abfc', '#f2c46b', '#e8f0de', '#ff8f8f'], cs = 4.4 * U, gap = 1.2 * U, x0 = cx - (6 * cs + 5 * gap) / 2;
      for (k = 0; k < 6; k++) { var e2 = eb(pr(u, .5 + k * .06, .85 + k * .06)); if (e2 > 0) { x.fillStyle = sw[k]; x.fillRect(x0 + k * (cs + gap) + cs * (1 - e2) / 2, H * .66 + cs * (1 - e2) / 2, cs * e2, cs * e2); } }
      word('TRACE', cx, H * .84, fit('TRACE', W * .88, 22 * U), u, .35, INK);
      mono('02 / VEKTOR · BÉZIER', 4 * U, 6 * U, INK);
      x.globalAlpha = (1 - pr(u, 0, .3)) * .9; x.fillStyle = AC; x.fillRect(0, 0, W, H); x.globalAlpha = 1;
    }
    if (t >= 3.95 && t < 5.85) { /* 3 · LAYER: pita warna bertumpuk + SVG */
      u = t - 3.95; var cols = ['#e8f0de', '#c8e6b4', '#98ce7b', '#3f5c2e', '#1b2314'], bh = H / 5, s = bh * .6;
      for (k = 0; k < 5; k++) {
        var ox = (1 - eo(pr(u, k * .07, k * .07 + .45))) * W * 1.25, oy = -eio(pr(u, 1.35 + k * .06, 1.8 + k * .06)) * (H + bh), y = k * bh + oy;
        x.fillStyle = cols[k]; x.beginPath(); x.moveTo(ox, y); x.lineTo(ox + W + s, y); x.lineTo(ox + W, y + bh + 1); x.lineTo(ox - s, y + bh + 1); x.fill();
      }
      x.save(); x.globalCompositeOperation = 'difference'; x.globalAlpha = 1 - pr(u, 1.35, 1.7);
      word('SVG', cx, H * .56, fit('SVG', W * .9, 34 * U), u, .45, '#fff'); x.restore();
      var ly = 1 - pr(u, 1.35, 1.7); mono('03 / LAYER', 4 * U, 6 * U, BG, ly);
      mono('LAYER ' + ('0' + Math.max(1, Math.ceil(eo(pr(u, .3, 1.2)) * 14))).slice(-2), W - 4 * U, 6 * U, BG, ly, 'right');
    }
    if (t >= 5.75 && t < 8.05) { /* 4 · XML: kode mengetik + glitch RGB */
      u = t - 5.75; var typed = Math.floor(u * 80), ln = 3.6 * U; F(1.9 * U, 1); x.textAlign = 'left';
      for (i = 0; i < XML.length && typed > 0; i++) { var sub = XML[i].slice(0, typed); typed -= XML[i].length; x.fillStyle = /^\s*</.test(sub) ? AC : MU; x.globalAlpha = .85; x.fillText(sub, 4 * U, H * .15 + i * ln); }
      x.globalAlpha = 1; fl = Math.floor(u * 18); var gl = (u > .35 && u < .65) || (u > 1.25 && u < 1.45) ? 1 : 0, sz = fit('XML', W * .9, 34 * U), sc = eo(pr(u, 0, .35)), by = H * .66;
      x.globalCompositeOperation = 'lighter'; bigGlitch('XML', cx, by, sz, CY, -gl * 1.3 * U, gl, fl, sc); bigGlitch('XML', cx, by, sz, PK, gl * 1.3 * U, gl, fl + 5, sc); bigGlitch('XML', cx, by, sz, AC, 0, gl, fl + 9, sc); x.globalCompositeOperation = 'source-over';
      var e3 = eb(pr(u, .6, 1)); if (e3 > 0) { F(2 * U, 1); var tw = x.measureText('ALIGHT MOTION  →').width + 5 * U, ch = 5.4 * U; x.save(); x.translate(cx, H * .82); x.scale(e3, e3); x.fillStyle = AC; x.beginPath(); x.roundRect ? x.roundRect(-tw / 2, -ch / 2, tw, ch, ch / 2) : x.rect(-tw / 2, -ch / 2, tw, ch); x.fill(); x.fillStyle = BG; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('ALIGHT MOTION  →', 0, 0); x.restore(); x.textBaseline = 'alphabetic'; }
      mono('04 / XML', 4 * U, 6 * U, INK);
    }
    if (t >= 7.5) { /* 5 · LOCKUP */
      u = t - 7.5; x.fillStyle = AC; x.beginPath(); x.arc(cx, H / 2, eio(pr(u, 0, .55)) * Math.hypot(W, H) * .52, 0, 7); x.fill(); inv = u > .55;
      if (u > .5) {
        var mk = 12 * U / 32, my = H * .2, pm = eo(pr(u, .6, 1.2));
        x.save(); x.translate(cx - 6 * U, my); x.scale(mk, mk); x.strokeStyle = BG; x.lineWidth = 3; x.lineCap = 'round'; x.setLineDash([60 * pm, 60]); x.stroke(MARK); x.setLineDash([]);
        x.fillStyle = BG; [[5, 23], [27, 18]].forEach(function (c, q) { var e = eb(pr(u, .7 + q * .25, 1.05 + q * .25)); if (e > 0) { x.beginPath(); x.arc(c[0], c[1], 3 * e, 0, 7); x.fill(); } }); x.restore();
        var fs = fit('TRACE', W * .86, 20 * U), b1 = H * .46, b2 = b1 + fs * .98;
        word('AUTO', cx, b1, fs, u, .6, BG); word('TRACE', cx, b2, fs, u, .75, BG);
        x.fillStyle = BG; x.fillRect(cx - W * .43 * eo(pr(u, 1, 1.5)), b2 + 2 * U, W * .86 * eo(pr(u, 1, 1.5)), .5 * U);
        mono('GAMBAR → SVG → XML ALIGHT MOTION', cx, b2 + 7 * U, BG, eo(pr(u, 1.2, 1.6)), 'center');
        mono('BY GYZEEN2K', cx, H - 6 * U, BG, eo(pr(u, 1.4, 1.8)), 'center');
      }
    }
    x.fillStyle = inv ? BG : AC; x.fillRect(0, H - 3, W * cl(t / DUR), 3);
    if (t > 9.1) R.style.clipPath = 'circle(' + ((1 - eio(pr(t, 9.1, DUR))) * Math.hypot(W, H) / 2) + 'px at 50% 50%)';
  }
  function lock(v) { document.querySelectorAll('header.top,main').forEach(function (e) { if (v) e.setAttribute('inert', ''); else e.removeAttribute('inert'); }); }
  function finish() {
    if (!on) return; on = false; cancelAnimationFrame(raf); R.style.clipPath = ''; document.documentElement.classList.remove('intro-on'); lock(false);
  }
  function loop(n) {
    raf = requestAnimationFrame(loop); t += Math.min((n - last) / 1000 || 0, .08); last = n; frame(t);
    if (t >= DUR && document.readyState === 'complete') finish();
  }
  function play() {
    if (on) return; document.documentElement.classList.add('intro-on'); size(); on = true; t = 0; last = performance.now(); R.style.clipPath = ''; lock(true); sk.focus({ preventScroll: true }); raf = requestAnimationFrame(loop);
  }
  sk.onclick = finish; addEventListener('resize', function () { if (on) size(); });
  document.addEventListener('keydown', function (e) { if (on && e.key === 'Escape') finish(); });
  window.AutoTraceIntro = { play: play, skip: finish };
  if (document.documentElement.classList.contains('intro-on')) { document.documentElement.classList.remove('intro-on'); play(); }
})();
