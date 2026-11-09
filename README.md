# Radar Informativo · Ingeniería Institucional

Lo que todo dirigente necesita saber para empezar la semana: economía en fácil, resumen político, seguimiento legislativo y noticias de la semana. Es un aporte semanal y de libre distribución de Ingeniería Institucional para la construcción de buena política pública.

- **Sitio:** https://tlaibe.github.io/informe-contingencia/ (siempre muestra la edición vigente y permite revisar las anteriores).
- **Carrusel:** cada edición tiene sus 5 imágenes en `ediciones/AAAA-MM-DD/carrusel/`.

## Cómo está organizado

| Ruta | Qué contiene |
|---|---|
| `index.html`, `assets/` | Sitio web (lee los datos de cada edición) |
| `ediciones/index.json` | Lista de ediciones y su estado (`borrador` o `publicada`) |
| `ediciones/AAAA-MM-DD/edicion.json` | Contenido completo de una edición (la fecha es el lunes de distribución) |
| `ediciones/AAAA-MM-DD/carrusel/` | Las 5 láminas en PNG y una página para descargarlas |
| `plantillas/` | Diseño de las láminas del carrusel |
| `scripts/generar-carrusel.js` | Exporta las láminas a PNG y avisa si un texto no cabe |
| `GUIA-EDITORIAL.md` | Criterios, fuentes y paso a paso de cada edición |

## Ciclo semanal

1. **Domingo, 21:00:** la tarea automática deja lista la edición nueva como borrador, con su carrusel, y avisa.
2. **Revisión:** Tomás o Andrés revisan el borrador en `?ed=AAAA-MM-DD` y lo aprueban o piden cambios.
3. **Publicación:** al aprobarlo, la edición pasa a `publicada` y se vuelve la vigente del sitio.
4. **Lunes temprano:** se distribuyen el link del sitio y las imágenes.

## Generar el carrusel a mano

```
npm install playwright   # solo la primera vez, si no está instalado
node scripts/generar-carrusel.js 2026-11-09
```

Para ver el sitio en tu computador, ejecuta `python3 -m http.server` en esta carpeta y abre `http://localhost:8000`.

---

© Ingeniería Institucional 2026 · contacto@ingenieriainstitucional.cl
