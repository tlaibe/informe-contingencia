// Plantillas de las 5 láminas del carrusel (1080 × 1350).
// Uso: carrusel.html?ed=AAAA-MM-DD            → todas las láminas
//      carrusel.html?ed=AAAA-MM-DD&lamina=3   → solo la lámina 3 (para exportar a PNG)
// El diseño replica el carrusel aprobado en el lienzo de Claude Design.
(async function () {
  const { el, rich } = IC;
  const css = (node, style) => { node.setAttribute('style', style); return node; };
  const NAVY = '#0B2D5E', ORANGE = '#F15A0C', ORANGE_T = '#C2410C', BODY = '#3F4A5A', GRAY = '#5B6470';
  const TOTAL = 5;

  const lista = await IC.indice('../');
  const id = IC.param('ed') || (IC.vigente(lista) || {}).id || (lista[0] || {}).id;
  const ed = await IC.edicion(id, '../');

  function base(fondo) {
    return css(el('div', 'lamina'), `background:${fondo};color:${NAVY};padding:72px 80px;display:flex;flex-direction:column;gap:28px`);
  }
  function encabezado(n) {
    const h = css(el('div'), 'display:flex;justify-content:space-between;align-items:center');
    const img = css(el('img'), 'height:60px;width:auto;display:block');
    img.src = '../assets/logo-color.png'; img.alt = 'Ingeniería Institucional';
    h.append(img, css(el('span', null, String(n).padStart(2, '0') + ' / 0' + TOTAL), 'font-size:24px;font-weight:700'));
    return h;
  }
  function titulo(kicker, texto, size) {
    const t = css(el('div'), 'display:flex;flex-direction:column;gap:12px');
    t.append(
      css(el('span', null, kicker), `font-size:26px;font-weight:700;letter-spacing:5px;text-transform:uppercase;color:${ORANGE_T}`),
      css(el('h2', null, texto), `margin:0;font-size:${size || 80}px;line-height:1.05;font-weight:800`)
    );
    return t;
  }
  function cajaAzul(etiqueta, texto, size) {
    const c = css(el('div'), `background:${NAVY};border-radius:20px;padding:26px 36px;display:flex;flex-direction:column;gap:6px;color:#fff`);
    c.append(
      css(el('span', null, etiqueta), `font-size:22px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${ORANGE}`),
      css(el('p', null, texto), `margin:0;font-size:${size || 26}px;line-height:1.4;font-weight:600`)
    );
    return c;
  }

  // 01 Portada
  function portada() {
    const s = css(el('div', 'lamina'), `background:${NAVY};color:#fff;padding:80px;display:flex;flex-direction:column;justify-content:space-between`);
    const c1 = css(el('div'), 'position:absolute;right:-220px;top:-220px;width:720px;height:720px;border:3px solid rgba(255,255,255,0.10);border-radius:50%');
    const c2 = css(el('div'), 'position:absolute;right:-120px;top:-120px;width:520px;height:520px;border:3px solid rgba(241,90,12,0.35);border-radius:50%');
    const top = css(el('div'), 'display:flex;justify-content:space-between;align-items:flex-start;position:relative');
    const logo = css(el('img'), 'height:104px;width:auto;display:block');
    logo.src = '../assets/logo-blanco.png'; logo.alt = 'Ingeniería Institucional';
    top.append(logo, css(el('span', null, '01 / 0' + TOTAL), 'font-size:24px;font-weight:700;color:rgba(255,255,255,0.8)'));
    const mid = css(el('div'), 'display:flex;flex-direction:column;gap:28px;position:relative');
    mid.append(
      css(el('div', null, (ed.portada && ed.portada.kicker) || ('Edición N° ' + ed.numero + ' · ' + ed.rango)), `font-size:26px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:${ORANGE}`),
      css(el('h1', null, 'Radar Informativo'), 'margin:0;font-size:116px;line-height:1.0;font-weight:800;letter-spacing:-2px'),
      css(el('div'), `width:140px;height:8px;background:${ORANGE};border-radius:4px`),
      css(el('p', null, (ed.portada && ed.portada.bajada) || ''), 'margin:0;font-size:36px;line-height:1.35;font-weight:500;color:rgba(255,255,255,0.88);max-width:880px')
    );
    const bot = css(el('div'), 'display:flex;flex-direction:column;gap:24px;position:relative');
    const fila = css(el('div'), 'display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:20px');
    const desliza = css(el('span', null, 'Desliza'), 'display:flex;align-items:center;gap:12px;font-size:26px;font-weight:600');
    desliza.insertAdjacentHTML('beforeend', '<svg width="40" height="24" viewBox="0 0 40 24" fill="none" stroke="#F15A0C" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12h34M26 3l10 9-10 9"></path></svg>');
    fila.append(css(el('span', null, 'contacto@ingenieriainstitucional.cl'), `font-size:28px;font-weight:700;background:${ORANGE};color:#fff;border-radius:999px;padding:16px 30px`), desliza);
    bot.append(
      css(el('span', null, 'Semanal · Gratuito · Libre distribución'), `align-self:flex-start;font-size:22px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:${ORANGE};border:2px solid ${ORANGE};border-radius:999px;padding:10px 22px`),
      css(el('p', null, 'Un aporte de Ingeniería Institucional a la construcción de buena política pública.'), 'margin:0;font-size:30px;line-height:1.4;font-weight:600;max-width:880px'),
      fila
    );
    s.append(c1, c2, top, mid, bot);
    return s;
  }

  // 03 Resumen político
  function resumen() {
    const s = base('#F4F5F7');
    s.style.gap = '32px';
    const cuerpo = css(el('div'), 'display:flex;flex-direction:column;gap:18px;flex-grow:1;justify-content:space-between');
    (ed.resumen.items || []).slice(0, 3).forEach((r) => {
      const c = css(el('div'), 'background:#fff;border-radius:20px;padding:28px 36px;display:flex;gap:28px;align-items:center');
      const izq = css(el('div'), 'flex:none;width:210px;display:flex;flex-direction:column;gap:2px');
      izq.append(css(el('span', null, r.cifra), `font-size:76px;font-weight:800;color:${ORANGE};line-height:1`), css(el('span', null, r.etiqueta), `font-size:18px;font-weight:600;color:${GRAY}`));
      const der = css(el('div'), 'display:flex;flex-direction:column;gap:6px');
      der.append(css(el('h3', null, r.titulo), 'margin:0;font-size:31px;line-height:1.2;font-weight:700'), css(rich('p', null, r.texto), `margin:0;font-size:23px;line-height:1.45;font-weight:500;color:${BODY}`));
      c.append(izq, der);
      cuerpo.append(c);
    });
    cuerpo.append(cajaAzul(ed.resumen.cierre_titulo || 'Qué significa para los gremios', ed.resumen.cierre, 27));
    s.append(encabezado(3), titulo('Nuestra lectura de la semana', 'Resumen político'), cuerpo);
    return s;
  }

  // 04 Seguimiento legislativo
  function legislativo() {
    const s = base('#F4F5F7');
    const cuerpo = css(el('div'), 'display:flex;flex-direction:column;gap:16px;flex-grow:1;justify-content:space-between');
    (ed.frentes || []).filter((f) => f.carrusel).slice(0, 4).forEach((f) => {
      const k = f.carrusel;
      const c = css(el('div'), 'background:#fff;border-radius:20px;padding:24px 36px;display:flex;flex-direction:column;gap:10px');
      const h = css(el('div'), 'display:flex;justify-content:space-between;align-items:center;gap:16px');
      h.append(
        css(el('h3', null, k.titulo || f.frente), 'margin:0;font-size:32px;font-weight:800'),
        css(el('span', null, k.etiqueta), `flex:none;font-size:19px;font-weight:700;background:${k.color === 'azul' ? NAVY : ORANGE};color:#fff;border-radius:999px;padding:7px 16px`)
      );
      c.append(h, css(rich('p', null, k.texto), `margin:0;font-size:23px;line-height:1.42;font-weight:500;color:${BODY}`), css(el('span', null, 'Próximo: ' + k.proximo), `font-size:21px;font-weight:700;color:${ORANGE_T}`));
      cuerpo.append(c);
    });
    s.append(encabezado(4), titulo('En qué va cada tema', 'Seguimiento legislativo', 64), cuerpo);
    return s;
  }

  // 02 Economía en fácil
  function economia() {
    const s = base('#F4F5F7');
    s.style.gap = '24px';
    const grid = css(el('div'), 'display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;flex-grow:1');
    const colores = { rojo: ['#B42318', '#B42318'], amarillo: ['#A15C00', '#E0A100'], verde: ['#1A7F4B', '#1A7F4B'] };
    (ed.economia.indicadores || []).slice(0, 4).forEach((i) => {
      const [txt, dot] = colores[i.semaforo] || colores.amarillo;
      const c = css(el('div'), `background:#fff;border-radius:20px;padding:28px 30px;display:flex;flex-direction:column;gap:10px;border-top:8px solid ${NAVY}`);
      const luz = css(el('span'), `display:flex;align-items:center;gap:10px;font-size:23px;font-weight:700;color:${txt}`);
      luz.append(css(el('span'), `width:18px;height:18px;border-radius:50%;background:${dot}`), document.createTextNode(i.estado));
      c.append(css(el('span', null, i.pregunta), 'font-size:28px;font-weight:700'), css(el('span', null, i.valor), 'font-size:80px;font-weight:800;line-height:1'), luz, css(rich('p', null, i.texto), `margin:0;font-size:22px;line-height:1.35;font-weight:500;color:${BODY}`));
      grid.append(c);
    });
    const pie = css(el('div'), `display:flex;align-items:center;gap:20px;font-size:20px;font-weight:600;color:${GRAY}`);
    pie.append(css(el('div'), `width:64px;height:5px;background:${ORANGE};border-radius:3px`), el('span', null, 'Fuentes: ' + (ed.economia.fuentes || '')));
    s.append(encabezado(2), titulo('Datos en fácil', '¿Cómo está la economía?', 60), grid, cajaAzul('En síntesis', ed.economia.sintesis, 24), pie);
    return s;
  }

  // 05 Noticias de la semana
  function noticias() {
    const s = base('#F4F5F7');
    s.style.gap = '32px';
    const caja = css(el('div'), 'background:#fff;border-radius:20px;padding:14px 40px;display:flex;flex-direction:column;flex-grow:1;justify-content:space-around');
    const notas = (ed.noticias || []).filter((n) => n.carrusel).sort((a, b) => (a.orden_carrusel || 99) - (b.orden_carrusel || 99)).slice(0, 6);
    notas.forEach((n, i) => {
      const d = css(el('div'), 'display:flex;flex-direction:column;gap:6px;padding:16px 0' + (i < notas.length - 1 ? ';border-bottom:2px solid #E6E9EE' : ''));
      d.append(
        css(el('span', null, n.medio + ' · ' + (n.fecha_texto || IC.fechaCorta(n.fecha))), `font-size:20px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${ORANGE_T}`),
        css(el('span', null, n.titulo_carrusel || n.titulo), 'font-size:28px;line-height:1.3;font-weight:700')
      );
      caja.append(d);
    });
    s.append(encabezado(5), titulo('Lo que hay que leer', 'Noticias de la semana', 64), caja);
    return s;
  }

  const laminas = [portada, economia, resumen, legislativo, noticias];
  const pedida = Number(IC.param('lamina'));
  const cont = document.getElementById('laminas');
  if (pedida >= 1 && pedida <= TOTAL) cont.append(laminas[pedida - 1]());
  else { document.body.classList.add('vista-todas'); laminas.forEach((f) => cont.append(f())); }
  await document.fonts.ready;
  await Promise.all([...document.images].map((im) => im.complete ? 0 : new Promise((r) => { im.onload = im.onerror = r; })));
  document.body.dataset.listo = '1';
})();
