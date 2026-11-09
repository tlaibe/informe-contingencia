#!/usr/bin/env node
// Exporta las 5 láminas del carrusel de una edición a PNG (1080 × 1350).
// Uso: node scripts/generar-carrusel.js AAAA-MM-DD
// Requiere Playwright con Chromium. Deja los PNG y una página de descarga en
// ediciones/AAAA-MM-DD/carrusel/ y avisa si alguna lámina se desborda.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const raiz = path.resolve(__dirname, '..');
const id = process.argv[2];
if (!/^\d{4}-\d{2}-\d{2}$/.test(id || '')) { console.error('Uso: node scripts/generar-carrusel.js AAAA-MM-DD'); process.exit(1); }
const edPath = path.join(raiz, 'ediciones', id, 'edicion.json');
if (!fs.existsSync(edPath)) { console.error('No existe ' + edPath); process.exit(1); }
const ed = JSON.parse(fs.readFileSync(edPath, 'utf8'));

const tipos = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = path.normalize(path.join(raiz, rel));
  if (!file.startsWith(raiz) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': tipos[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

const nombres = ['01-portada', '02-economia-en-facil', '03-resumen-politico', '04-seguimiento-legislativo', '05-noticias-de-la-semana'];

server.listen(0, '127.0.0.1', async () => {
  const port = server.address().port;
  const salida = path.join(raiz, 'ediciones', id, 'carrusel');
  fs.mkdirSync(salida, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  const problemas = [];
  page.on('pageerror', (e) => problemas.push('Error en la plantilla: ' + e.message));
  for (let n = 1; n <= nombres.length; n++) {
    await page.goto(`http://127.0.0.1:${port}/plantillas/carrusel.html?ed=${id}&lamina=${n}`);
    await page.waitForSelector('body[data-listo="1"]', { timeout: 20000 });
    // Revisión de desborde: cualquier elemento que se salga del cuadro de 1080 × 1350.
    const desborde = await page.evaluate(() => {
      const lam = document.querySelector('.lamina');
      const box = lam.getBoundingClientRect();
      let peor = 0;
      lam.querySelectorAll('*').forEach((e) => {
        if (getComputedStyle(e).position === 'absolute') return; // círculos decorativos
        const r = e.getBoundingClientRect();
        peor = Math.max(peor, r.bottom - box.bottom, r.right - box.right);
      });
      return Math.round(peor);
    });
    if (desborde > 0) problemas.push(`Lámina ${n} (${nombres[n - 1]}): el contenido se pasa ${desborde}px del borde. Acorta textos.`);
    await page.locator('.lamina').screenshot({ path: path.join(salida, nombres[n - 1] + '.png') });
  }
  await browser.close();
  server.close();

  // Página simple para ver y descargar las láminas desde el sitio.
  const items = nombres.map((n) => `<figure><img src="${n}.png" alt="${n}" loading="lazy"><figcaption><a href="${n}.png" download>Descargar ${n}.png</a></figcaption></figure>`).join('\n');
  fs.writeFileSync(path.join(salida, 'index.html'), `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Carrusel N° ${ed.numero} · Radar Informativo</title>
<link rel="stylesheet" href="../../../assets/fonts.css">
<style>body{margin:0;background:#F4F5F7;color:#0B2D5E;font-family:Montserrat,system-ui,sans-serif;padding:24px}
main{max-width:1100px;margin:0 auto}h1{font-size:1.5rem}a{color:#C2410C;font-weight:700}
.grid{display:grid;gap:20px;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))}
figure{margin:0;background:#fff;border-radius:12px;padding:12px}img{width:100%;height:auto;display:block;border-radius:6px}figcaption{margin-top:8px;font-size:.85rem}</style></head>
<body><main><p><a href="../../../?ed=${id}">← Volver al informe</a></p>
<h1>Carrusel · Edición N° ${ed.numero} · ${ed.rango}</h1>
<p>Láminas de 1080 × 1350 px para Instagram, LinkedIn o WhatsApp.</p>
<div class="grid">${items}</div></main></body></html>
`);

  if (problemas.length) { console.log('ATENCIÓN:\n- ' + problemas.join('\n- ')); process.exitCode = 2; }
  else console.log('Carrusel generado sin desbordes en ' + path.relative(raiz, salida));
});
