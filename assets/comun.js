// Funciones compartidas entre el sitio y las plantillas del carrusel.
window.IC = {
  el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  },
  // Texto con **negritas** (sin HTML: se arma con nodos para que el contenido nunca se ejecute).
  rich(tag, cls, text, boldCls) {
    const e = IC.el(tag, cls);
    String(text || '').split(/(\*\*[^*]+\*\*)/).forEach((part) => {
      if (/^\*\*[^*]+\*\*$/.test(part)) e.append(IC.el('b', boldCls || null, part.slice(2, -2)));
      else if (part) e.append(document.createTextNode(part));
    });
    return e;
  },
  plain(text) { return String(text || '').replace(/\*\*/g, ''); },
  day(s) { return new Date(String(s).slice(0, 10) + 'T12:00:00'); },
  fechaCorta(s) {
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic'];
    const d = IC.day(s);
    return d.getDate() + ' ' + meses[d.getMonth()];
  },
  fechaLarga(s) { return IC.day(s).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' }); },
  async json(path) {
    const r = await fetch(path, { cache: 'no-cache' });
    if (!r.ok) throw new Error(path + ' ' + r.status);
    return r.json();
  },
  async indice(base) { return (await IC.json((base || '') + 'ediciones/index.json')).ediciones || []; },
  async edicion(id, base) { return IC.json((base || '') + 'ediciones/' + id + '/edicion.json'); },
  // La edición vigente es la publicada más reciente.
  vigente(lista) { return lista.filter((e) => e.estado === 'publicada').sort((a, b) => b.id.localeCompare(a.id))[0]; },
  param(name) { return new URLSearchParams(location.search).get(name); }
};
