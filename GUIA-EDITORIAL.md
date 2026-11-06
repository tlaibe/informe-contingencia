# Guía editorial y de producción · Informe de Contingencia

Esta guía la sigue la tarea automática de cada domingo, y sirve también para quien prepare una edición a mano. Si cambia el criterio editorial, se edita este archivo.

## El producto

- **Qué es:** informe semanal de Ingeniería Institucional para dirigentes sindicales y gremiales, nacionales y regionales, sobre todo del sector público.
- **Bajada:** "Lo que todo dirigente necesita saber para empezar la semana."
- **Formatos:** sitio web (este repositorio, con GitHub Pages) y carrusel de 5 imágenes (1080 × 1350).
- **Ciclo:** se prepara el domingo y queda listo a las 21:00 como **borrador**. Se publica cuando Tomás Laibe o Andrés Smith lo aprueban, y se distribuye el lunes a primera hora.
- **Secciones, en este orden:**
  1. Resumen político
  2. Seguimiento legislativo
  3. Economía en fácil
  4. Radar de noticias

## Criterios de escritura

- Español de Chile, claro y directo. El público **no** es experto en economía: cero jerga técnica, sin siglas sin explicar y pocas cifras. Lo que importa es "qué significa para un dirigente".
- Tono serio y responsable, sin consignas ni adjetivos panfletarios. El análisis puede ser crítico, pero siempre debe estar respaldado por datos o hechos verificables.
- Pieza de libre distribución para gremios de distintas sensibilidades: no tomar partido por partidos ni por figuras. Describir lo que hacen el Gobierno, la oposición y el Congreso, y explicar qué implica para los trabajadores.
- **Toda cifra debe tener fuente** (INE, Banco Central, Dipres, Senado o Cámara, encuestas con nombre y fecha, prensa identificada). Si un dato no se pudo confirmar, no se pone. Se usa la cifra exacta, no aproximaciones del tipo "algo más de".
- **Comparar peras con peras:** no mezclar inflación promedio anual con inflación a diciembre, ni cifras nominales con reales, sin aclararlo.
- Fechas: "9 nov" o "9–12 nov" en el carrusel, y "9 de noviembre" en el sitio.

## Fuentes que se revisan cada semana

- **Congreso:** senado.cl y camara.cl (tramitación, tabla de la semana, comisiones, plazos de indicaciones). Durante la discusión del Presupuesto, también la Comisión Especial Mixta y las subcomisiones.
- **Ejecutivo:** Hacienda y Dipres (Presupuesto, Informe de Finanzas Públicas, reajuste), Diario Oficial (leyes publicadas), SII (circulares).
- **Datos:** INE (desempleo de la ENE, IPC; las fechas de publicación están en su calendario), Banco Central (Imacec, IPoM, reuniones de política monetaria, Encuesta de Expectativas Económicas).
- **Encuestas:** Cadem (semanal) y Pulso Ciudadano, entre otras, siempre citando nombre y fecha.
- **Mundo gremial:** Mesa del Sector Público, ANEF, CUT, gremios de salud y educación.
- **Prensa:** La Tercera, Emol, Diario Financiero, BioBioChile, CNN Chile, El Mostrador, Radio U. de Chile, Cooperativa y prensa regional cuando sea relevante.

## Estructura de datos

Cada edición vive en `ediciones/AAAA-MM-DD/edicion.json`. La fecha es el **lunes** en que se distribuye. La lista de ediciones está en `ediciones/index.json`.

Como plantilla se usa la edición anterior: se copia su `edicion.json` y se actualiza todo su contenido. Los campos son:

- `id`, `numero` (correlativo), `estado` (`"borrador"` o `"publicada"`), `rango` (por ejemplo, "9 al 13 de noviembre de 2026").
- `portada.kicker` ("Edición N° 2 · 9 al 13 de noviembre 2026") y `portada.bajada` (se mantiene).
- `resumen.items`: exactamente 3, cada uno con `cifra` (un número llamativo, como "22%"), `etiqueta` (2 a 5 palabras), `titulo` (hasta unos 40 caracteres) y `texto` (hasta unos 230 caracteres, con la fuente entre paréntesis). Además, `resumen.cierre_titulo` ("Qué significa para los gremios") y `resumen.cierre` (hasta unos 200 caracteres).
- `frentes`: los temas legislativos o administrativos en seguimiento. Cada uno lleva:
  - Para el sitio: `frente`, `pasos` (etapas separadas por `|`), `paso_actual` (empieza en 1), `en_que_va`, `que_viene`, `que_hacer` y `detalle` (opcional, más extenso).
  - Para el carrusel, en `carrusel`: `titulo`, `etiqueta` (la etapa, en pocas palabras), `color` (`"naranjo"` si hay una urgencia o algo en juego esta semana, `"azul"` si está en implementación o estable), `texto` (hasta unos 230 caracteres; se puede usar `**negrita**` en cifras clave) y `proximo` (el próximo hito con fecha).
  - Se arrastran los de la semana anterior: se actualizan, se sacan los cerrados y se agregan los nuevos relevantes para trabajadores del sector público. Máximo 4 con `carrusel`.
- `economia.indicadores`: exactamente 4, en lenguaje simple. Cada uno con `pregunta`, `valor`, `semaforo` (`rojo`, `amarillo` o `verde`), `estado` (2 a 4 palabras), `texto` (hasta unos 130 caracteres) y `fuente`. Además, `economia.sintesis` (hasta unos 230 caracteres, que amarre los 4 datos) y `economia.fuentes`.
- `noticias`: entre 10 y 18 notas, con `fecha` (AAAA-MM-DD), `tema`, `medio`, `titulo`, `resumen` (una línea propia) y `url` (https). Exactamente 6 llevan `carrusel: true` y `orden_carrusel` del 1 al 6; pueden llevar `titulo_carrusel` si el titular original es muy largo (máximo unos 95 caracteres).

## Producción paso a paso

1. Investigar la semana con las fuentes de arriba: qué pasó, qué viene en los próximos 7 días y qué datos se publicaron.
2. Crear `ediciones/<lunes>/edicion.json` con `estado: "borrador"` y agregarla a `ediciones/index.json` con el mismo estado.
3. Generar el carrusel con `node scripts/generar-carrusel.js <lunes>`. Si el script avisa de desbordes, acortar los textos indicados y repetir hasta que no haya avisos.
4. Revisar las imágenes generadas, mirándolas, antes de dar la edición por lista.
5. Hacer commit y push a `main`. El borrador queda visible solo en `?ed=<lunes>`; la portada del sitio sigue mostrando la última edición publicada.
6. Enviar el aviso de revisión, con el link del borrador, las 5 imágenes, un resumen de los cambios respecto de la semana anterior y las dudas o datos que no se pudieron confirmar.
7. **Publicar solo con aprobación explícita:** cambiar `estado` a `"publicada"` en `edicion.json` y en `index.json`, y hacer commit y push. Desde ese momento la edición pasa a ser la vigente en la portada.

## Links útiles

- Sitio: https://tlaibe.github.io/informe-contingencia/
- Una edición: `https://tlaibe.github.io/informe-contingencia/?ed=AAAA-MM-DD`
- Carrusel de una edición: `https://tlaibe.github.io/informe-contingencia/ediciones/AAAA-MM-DD/carrusel/`
- Vista previa de las láminas sin exportar: `plantillas/carrusel.html?ed=AAAA-MM-DD`
