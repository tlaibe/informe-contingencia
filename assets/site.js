(async function () {
  const { el, rich, fechaLarga } = IC;
  const $ = (id) => document.getElementById(id);

  let lista = [];
  try { lista = await IC.indice(); } catch (e) { $('ic-kicker').textContent = 'No se pudo cargar el informe.'; return; }
  const vig = IC.vigente(lista);
  const pedida = IC.param('ed');
  const meta = lista.find((e) => e.id === pedida) || vig;
  if (!meta) { $('ic-kicker').textContent = 'Aún no hay ediciones publicadas.'; return; }
  const ed = await IC.edicion(meta.id);

  // Selector y archivo: solo ediciones publicadas, más la que se está viendo si es borrador.
  const visibles = lista.filter((e) => e.estado === 'publicada' || e.id === meta.id).sort((a, b) => b.id.localeCompare(a.id));
  const sel = $('ic-ediciones');
  visibles.forEach((e) => {
    const o = new Option('N° ' + e.numero + ' · ' + e.rango + (e.estado !== 'publicada' ? ' (borrador)' : ''), e.id);
    o.selected = e.id === meta.id;
    sel.append(o);
  });
  sel.addEventListener('change', () => {
    location.search = sel.value === (vig && vig.id) ? '' : '?ed=' + encodeURIComponent(sel.value);
  });
  visibles.forEach((e) => {
    const li = el('li');
    const a = el('a');
    a.href = e.id === (vig && vig.id) ? './' : '?ed=' + encodeURIComponent(e.id);
    a.append(el('span', null, 'Edición N° ' + e.numero + ' · ' + e.rango));
    if (e.id === (vig && vig.id)) a.append(el('span', 'actual', 'Vigente'));
    li.append(a);
    $('ic-archivo').append(li);
  });

  // Encabezado
  $('ic-kicker').textContent = 'Edición N° ' + ed.numero + ' · ' + ed.rango;
  $('ic-bajada').textContent = (ed.portada && ed.portada.bajada) || '';
  document.title = 'Radar Informativo N° ' + ed.numero + ' · Ingeniería Institucional';
  $('ic-borrador').hidden = ed.estado === 'publicada';
  $('ic-anterior').hidden = !(ed.estado === 'publicada' && vig && ed.id !== vig.id);
  const desc = $('ic-descarga');
  desc.href = 'ediciones/' + ed.id + '/carrusel/';
  desc.hidden = false;

  // 02 Resumen político
  (ed.resumen.items || []).forEach((r) => {
    const c = el('article', 'ic-card ic-pol-item');
    c.append(el('span', 'ic-pol-num', r.cifra), el('span', 'ic-pol-lab', r.etiqueta), el('h3', null, r.titulo), rich('p', null, r.texto));
    $('ic-pol').append(c);
  });
  $('ic-cierre-titulo').textContent = ed.resumen.cierre_titulo || 'Qué significa para los gremios';
  $('ic-cierre').textContent = ed.resumen.cierre || '';

  // 03 Seguimiento legislativo
  (ed.frentes || []).forEach((f) => {
    const c = el('article', 'ic-card ic-f');
    const head = el('div', 'ic-f-head');
    head.append(el('h3', 'ic-f-title', f.frente));
    if (f.carrusel && f.carrusel.etiqueta) head.append(el('span', 'ic-pill ' + (f.carrusel.color === 'azul' ? 'azul' : ''), f.carrusel.etiqueta));
    c.append(head);
    const pasos = String(f.pasos || '').split('|').filter(Boolean);
    const n = Number(f.paso_actual);
    const steps = el('div', 'ic-steps');
    steps.setAttribute('aria-label', 'Etapa actual: ' + (pasos[n - 1] || ''));
    pasos.forEach((p, i) => steps.append(el('div', 'ic-step' + (i + 1 < n ? ' done' : i + 1 === n ? ' now' : ''), p)));
    c.append(steps);
    const row = (lab, txt, cls) => { const d = el('div', 'ic-f-row' + (cls ? ' ' + cls : '')); d.append(el('span', 'ic-f-lab', lab), rich('span', null, txt)); return d; };
    c.append(row('En qué va', f.en_que_va), row('Qué viene', f.que_viene), row('Qué hacer', f.que_hacer, 'ic-f-do'));
    if (f.detalle) { const d = el('details'); d.append(el('summary', null, 'Ver análisis'), rich('p', null, f.detalle)); c.append(d); }
    $('ic-frentes').append(c);
  });

  // 01 Economía en fácil
  (ed.economia.indicadores || []).forEach((i) => {
    const c = el('article', 'ic-card ic-ind');
    c.append(el('h3', null, i.pregunta), el('span', 'ic-ind-val', i.valor), el('span', 'ic-light ' + i.semaforo, i.estado), rich('p', null, i.texto), el('span', 'ic-ind-src', 'Fuente: ' + i.fuente));
    $('ic-indicadores').append(c);
  });
  $('ic-econ-sintesis').textContent = ed.economia.sintesis || '';

  // 04 Noticias de la semana
  const grupos = new Map();
  (ed.noticias || []).slice().sort((a, b) => String(b.fecha).localeCompare(String(a.fecha))).forEach((n) => {
    if (!grupos.has(n.tema)) grupos.set(n.tema, []);
    grupos.get(n.tema).push(n);
  });
  grupos.forEach((items, tema) => {
    const g = el('div', 'ic-card ic-n-group');
    g.append(el('h3', null, tema));
    items.forEach((n) => {
      const a = el('a', 'ic-n-item');
      if (/^https:\/\//.test(n.url || '')) { a.href = n.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      a.append(el('div', 'ic-n-top', n.medio + ' · ' + (n.fecha_texto || fechaLarga(n.fecha))), el('div', 'ic-n-title', n.titulo), el('div', 'ic-n-sum', n.resumen || ''));
      g.append(a);
    });
    $('ic-noticias').append(g);
  });
})();
