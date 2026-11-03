# Informe de Contingencia · Ingeniería Institucional

Informe semanal para gremios del sector público: resumen político, seguimiento legislativo, economía en fácil y radar de noticias. Producto gratuito de libre distribución.

## Ver el informe

Con GitHub Pages activado (Settings › Pages › Deploy from a branch › `main` / root), el informe queda publicado en `https://<usuario>.github.io/<repositorio>/`.

Para verlo en tu computador, abre una terminal en esta carpeta y ejecuta `python3 -m http.server`. Luego entra a `http://localhost:8000` (abrir el `index.html` directo no carga los datos).

## Cómo actualizar cada edición

| Qué cambia | Dónde se edita |
|---|---|
| Edición, fecha y resumen político | `index.html` |
| Tarjetas de seguimiento legislativo | `data/frentes.json` |
| Economía en fácil | `data/indicadores.json` |
| Radar de noticias | `data/noticias.json` |

En `data/frentes.json`, `pasos` lista las etapas separadas por `|` y `paso_actual` indica en cuál vamos (empieza en 1).

---

© Ingeniería Institucional 2026 · contacto@ingenieriainstitucional.cl
