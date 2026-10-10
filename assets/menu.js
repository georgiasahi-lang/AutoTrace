/* Menu titik 3: Dokumen, Credit, Putar ulang intro */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); }, btn = $('menuBtn'), menu = $('menu');
  function setOpen(o) { menu.hidden = !o; btn.setAttribute('aria-expanded', o ? 'true' : 'false'); if (o) menu.querySelector('button').focus(); }
  function openDlg(id) { var d = $(id); if (d.showModal) d.showModal(); else d.setAttribute('open', ''); }
  btn.onclick = function (e) { e.stopPropagation(); setOpen(menu.hidden); };
  document.addEventListener('click', function (e) { if (!menu.hidden && !menu.contains(e.target)) setOpen(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { setOpen(false); btn.focus(); } });
  menu.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-act]'); if (!b) return; setOpen(false);
    if (b.dataset.act === 'docs') openDlg('dlgDocs'); else if (b.dataset.act === 'credit') openDlg('dlgCredit'); else if (window.AutoTraceIntro) window.AutoTraceIntro.play();
  });
  document.querySelectorAll('dialog.doc').forEach(function (d) {
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
    d.querySelector('.doc-h button').onclick = function () { d.close(); };
  });
})();
