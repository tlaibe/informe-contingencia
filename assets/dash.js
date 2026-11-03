// Versión mínima del entorno de datos del informe para publicarlo en GitHub Pages.
// Carga los archivos de /data y dibuja cada sección. Para actualizar el informe,
// basta con editar los JSON de /data y el texto de index.html.
(function () {
  var sources = ['frentes', 'indicadores', 'noticias', 'calendario'];
  var store = {};
  var drawers = {};
  sources.forEach(function (id) { store[id] = { status: 'loading', data: [] }; });

  function runAll() {
    Object.keys(drawers).forEach(function (name) {
      document.querySelectorAll('[data-draw="' + name + '"]').forEach(function (el) {
        try { drawers[name](el); } catch (e) { console.error(e); }
      });
    });
  }

  window.dash = {
    data: function (id) { return store[id] || { status: 'missing', data: [] }; },
    draw: function (name, fn) { drawers[name] = fn; },
    onData: function (fn) { fn(); },
    setLink: function (name) { try { history.replaceState(null, '', '#' + name); } catch (e) {} },
    params: function () { return {}; },
    setParams: function () {},
    resetParams: function () {},
    refresh: function () {},
    colors: ['#0B2D5E', '#F15A0C', '#5B6470']
  };

  document.addEventListener('DOMContentLoaded', function () {
    runAll();
    sources.forEach(function (id) {
      fetch('data/' + id + '.json', { cache: 'no-cache' })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (rows) { store[id] = { status: 'ok', data: rows }; })
        .catch(function () { store[id] = { status: 'error', data: [] }; })
        .then(runAll);
    });
  });
})();
