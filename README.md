# YouTube Clone (estático)

Clon simple de YouTube con HTML/CSS/JS puro.

## Estructura
- **`index.html`**: Home. Render dinámico del feed (tarjetas) desde `js/data.js` + búsqueda.
- **`watch.html`**: Vista de reproducción dinámica por `?id=` con recomendaciones.
- **`css/youtube.css`**: Estilos del Home.
- **`css/cold.css`**: Estilos de la vista de reproducción (reusados por `watch.html`).
- **`js/data.js`**: Catálogo de videos (editar/añadir aquí).
- **`js/app.js`**: Render del feed, búsqueda en vivo, soporte `?q=`, y colapso del sidebar (CSS inyectado).
- **`js/watch.js`**: Carga del video y recomendaciones en `watch.html`.

## Ejecutar
- Opción rápida: abrir `index.html` en el navegador (doble clic).
- Recomendado: usar un servidor estático (p. ej. Live Server) para rutas limpias.

## Uso
- Home: ver tarjetas; buscar por título o canal. Soporta `?q=palabra` para abrir con filtro aplicado.
- Reproducción: clic en una tarjeta → `watch.html?id=<id>`.
- Sidebar: botón de menú (☰) colapsa/expande la barra lateral.

## Añadir videos
Editar `js/data.js`, añadir un objeto con la forma:
```js
{
  id: 'mi-id-unico',
  title: 'Título',
  channel: { name: 'Canal', avatar: 'ruta/a/imagen', subscribers: 'X M' },
  stats: { views: 123456, uploadedAt: new Date('2020-01-01'), likes: 1000 },
  thumbnail: 'ruta/a/miniatura',
  videoSrc: 'ruta/a/video.mp4' // opcional; si no existe, se verá la miniatura
}
```

## Notas
- El CSS de colapso del sidebar se inyecta desde `js/app.js` para evitar modificar `css/youtube.css`.
- `watch.html` usa `css/cold.css` existente para mantener el diseño.

## Próximas mejoras sugeridas
- Chips de categorías en Home.
- Página de canal (`channel.html`) con header, tabs y lista de videos del canal.
- Paginación/carga diferida (infinite scroll).
- Modo claro/oscuro.
- Local storage para “Me gusta”/“Ver más tarde”.
- Subida de videos simulada (catálogo editable desde UI).
