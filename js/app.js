'use strict';

(function () {
  function injectCollapsedCss() {
    const css = `/* Sidebar collapsed */
    .sidebar.collapsed { width: 70px; overflow-x: hidden; }
    .sidebar.collapsed .sidebar-item { justify-content: center; font-size: 0; padding: 0 12px; }
    .sidebar.collapsed .sidebar-item i { margin-right: 0; font-size: 1.4rem; }
    .sidebar.collapsed .suscripciones, .sidebar.collapsed .mas { display: none; }
    .sidebar.collapsed .canales-txt p { display: none; }
    .sidebar.collapsed .sidebar-item:hover { background-color: #4c4c4c; }

    /* Chips bar */
    .chips-bar { grid-column: 1 / -1; position: sticky; top: 0; z-index: 2; background-color: black; padding: 8px 6px; display: flex; gap: 8px; overflow-x: auto; }
    .chip { background-color: #222; color: #fff; padding: 6px 12px; border-radius: 14px; white-space: nowrap; border: 1px solid rgba(255,255,255,.1); cursor: pointer; user-select: none; }
    .chip.active { background-color: #fff; color: #000; }

    /* Duration badge */
    .duration-badge { position: absolute; right: 6px; bottom: 6px; background: rgba(0,0,0,0.8); color: #fff; font-size: 12px; padding: 2px 4px; border-radius: 3px; }
    .video-caja { position: relative; display: block; }

    /* Feed container override + videos grid */
    .contenedor-video { display: block !important; overflow-y: auto; height: calc(100vh - 166px); background-color: black; }
    .videos-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-gap: 0; padding: 30px 6px; justify-items: center; }
    @media (max-width: 1050px) { .videos-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 820px)  { .videos-grid { grid-template-columns: 1fr; grid-gap: 10px; padding: 20px; } }
    .empty-state { color: #aaa; padding: 24px; }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }
  
  // Estado global simple
  const state = { q: '', cat: '', allCategories: [] };

  // Mapeo manual de categorías por id
  const CATEGORY_MAP = {
    'cold': ['Pop'],
    'starboy': ['Pop'],
    'sugar': ['Pop'],
    'shape-of-you': ['Pop'],
    'classy-101': ['Latino'],
    'que-te-vas': ['Indie'],
    'paramore-emergency': ['Rock'],
    'when-youre-gone': ['Pop Rock'],
    'my-december': ['Rock'],
    'monaco': ['Latino']
  };

  function getAllCategories(videos) {
    const set = new Set();
    videos.forEach(v => {
      const cats = CATEGORY_MAP[v.id] || [];
      cats.forEach(c => set.add(c));
    });
    return ['Todos', ...Array.from(set)];
  }

  function renderChipsBar(categories, selectedCat) {
    if (!categories?.length) return '';
    return `<div class="chips-bar">${categories.map(c => {
      const isActive = (selectedCat || 'Todos') === c;
      return `<div class="chip${isActive ? ' active' : ''}" data-cat="${c}">${c}</div>`;
    }).join('')}</div>`;
  }

  function filterVideos(videos, qLower, cat) {
    let list = videos;
    if (qLower) {
      list = list.filter(
        (v) => v.title.toLowerCase().includes(qLower) || (v.channel?.name || '').toLowerCase().includes(qLower)
      );
    }
    if (cat && cat !== 'Todos') {
      list = list.filter(v => (CATEGORY_MAP[v.id] || []).includes(cat));
    }
    return list;
  }
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderFeedHtml(list) {
    if (!Array.isArray(list)) return '';
    const html = list
      .map((v) => {
        const views = (window.utils && window.utils.formatNumber)
          ? window.utils.formatNumber(v.stats?.views || 0)
          : (v.stats?.views || 0);
        const time = (window.utils && window.utils.timeAgo)
          ? window.utils.timeAgo(v.stats?.uploadedAt || new Date())
          : '';
        const duration = v.duration ? `<span class="duration-badge">${escapeHtml(v.duration)}</span>` : '';
        return `
        <div class="video-contenido-cover">
          <div class="contenido-video">
            <a href="watch.html?id=${encodeURIComponent(v.id)}" class="video-caja" title="${escapeHtml(v.title)}">
              <img src="${v.thumbnail}" loading="lazy" width="300" height="150" alt="${escapeHtml(v.title)}" />
              ${duration}
            </a>
            <div class="video-detalles">
              <div class="detalles">
                <h3 class="title">${escapeHtml(v.title)}</h3>
                <div class="canal-nombre"><a href="channel.html?name=${encodeURIComponent(v.channel?.name || '')}" style="color:inherit;text-decoration:none;">${escapeHtml(v.channel?.name || '')}</a></div>
                <div class="vistas-tiempo">
                  <div class="vistas">${views} de visualizaciones</div>
                  <div class="tiempo">${time}</div>
                </div>
              </div>
            </div>
          </div>
        </div>`;
      })
      .join('');
    return html;
  }

  function setupSearch(videos) {
    const input = document.querySelector('.contenedor-busqueda input');
    const form = document.querySelector('.contenedor-busqueda form');
    const searchBtn = document.querySelector('.boton-busqueda');

    function doSearch() {
      const qRaw = (input?.value || '').trim();
      state.q = qRaw;
      updateUrl();
      renderPage(videos);
    }

    input?.addEventListener('input', doSearch);
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      doSearch();
    });
    searchBtn?.addEventListener('click', doSearch);
  }

  function setupSidebarToggle() {
    const menuBtn = document.querySelector('.header .logo-contenedor .ri-menu-line');
    const sidebar = document.querySelector('.sidebar');
    if (!menuBtn || !sidebar) return;
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
  }

  function setupSidebarLinks() {
    const items = document.querySelectorAll('.sidebar .sidebar-item');
    items.forEach((a) => {
      const label = (a.textContent || '').trim().toLowerCase();
      if (label.startsWith('shorts')) a.setAttribute('href', 'shorts.html');
      if (label.startsWith('inicio')) a.setAttribute('href', 'index.html');
    });
  }

  function updateUrl() {
    const url = new URL(window.location.href);
    if (state.q) url.searchParams.set('q', state.q);
    else url.searchParams.delete('q');
    if (state.cat && state.cat !== 'Todos') url.searchParams.set('cat', state.cat);
    else url.searchParams.delete('cat');
    history.replaceState({}, '', url.toString());
  }

  function renderPage(videos) {
    const container = document.querySelector('.contenedor-video');
    if (!container) return;
    const qLower = (state.q || '').toLowerCase();
    const list = filterVideos(videos, qLower, state.cat || 'Todos');
    const chips = renderChipsBar(state.allCategories, state.cat || 'Todos');
    const grid = renderFeedHtml(list);
    const body = list.length ? `<div class="videos-grid">${grid}</div>` : `<div class="empty-state">No se encontraron resultados.</div>`;
    container.innerHTML = `${chips}${body}`;
  }

  function setupChips(container, videos) {
    container.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      const cat = chip.getAttribute('data-cat');
      state.cat = cat || 'Todos';
      updateUrl();
      renderPage(videos);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Inyecta estilos de colapso del sidebar
    injectCollapsedCss();

    // Normaliza idioma/branding/placeholder en Home
    try { document.documentElement.lang = 'es'; } catch (e) {}
    const brand = document.querySelector('#logo-txt');
    if (brand) brand.textContent = 'YouTube';
    const headerInput = document.querySelector('.contenedor-busqueda input');
    if (headerInput) headerInput.setAttribute('placeholder', 'Buscar');
    const mas = document.querySelector('.mas');
    if (mas) mas.textContent = 'Más de YouTube';

    const container = document.querySelector('.contenedor-video');
    if (!container) return;

    const videos = Array.isArray(window.VIDEOS) ? window.VIDEOS.slice() : [];

    // Soporte para búsqueda inicial desde ?q= y categoría ?cat=
    const url = new URL(window.location.href);
    const qParamRaw = url.searchParams.get('q') || '';
    const catParamRaw = url.searchParams.get('cat') || '';
    if (qParamRaw) {
      const input = document.querySelector('.contenedor-busqueda input');
      if (input) input.value = qParamRaw;
    }
    state.q = qParamRaw;
    state.cat = catParamRaw || 'Todos';
    state.allCategories = getAllCategories(videos);

    // Render inicial (chips + grid)
    renderPage(videos);

    setupSearch(videos);
    setupSidebarToggle();
    setupSidebarLinks();
    setupChips(container, videos);
  });
})();
