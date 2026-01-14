'use strict';

(function () {
  function injectGridCss() {
    const css = `.videos-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-gap: 0; padding: 30px 6px; justify-items: center; }
    @media (max-width: 1050px) { .videos-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 820px)  { .videos-grid { grid-template-columns: 1fr; grid-gap: 10px; padding: 20px; } }`;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }
  function qs(sel) { return document.querySelector(sel); }
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  function getParam(name) { const u = new URL(window.location.href); return u.searchParams.get(name); }

  function channelInfo(name, videos) {
    const first = videos.find(v => (v.channel?.name || '').toLowerCase() === name.toLowerCase());
    return first?.channel || { name, avatar: '', subscribers: '' };
  }
  function renderGrid(list) {
    const html = list.map(v => `
      <div class="video-contenido-cover">
        <div class="contenido-video">
          <a href="watch.html?id=${encodeURIComponent(v.id)}" class="video-caja" title="${escapeHtml(v.title)}">
            <img src="${v.thumbnail}" width="300" height="150" alt="${escapeHtml(v.title)}" />
          </a>
          <div class="video-detalles">
            <div class="detalles">
              <h3 class="title">${escapeHtml(v.title)}</h3>
              <div class="vistas-tiempo">
                <div class="vistas">${window.utils?.formatNumber ? window.utils.formatNumber(v.stats?.views || 0) : (v.stats?.views || 0)} de visualizaciones</div>
                <div class="tiempo">${window.utils?.timeAgo ? window.utils.timeAgo(v.stats?.uploadedAt || new Date()) : ''}</div>
              </div>
            </div>
          </div>
        </div>
      </div>`).join('');
    return `<div class="videos-grid">${html}</div>`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    injectGridCss();
    const all = Array.isArray(window.VIDEOS) ? window.VIDEOS : [];
    const name = getParam('name') || '';
    const channel = channelInfo(name, all);

    qs('#channel-name').textContent = channel.name || name;
    qs('#channel-subs').textContent = channel.subscribers ? `${channel.subscribers} de suscriptores` : '';
    if (channel.avatar) qs('#channel-avatar').src = channel.avatar;

    const list = all.filter(v => (v.channel?.name || '').toLowerCase() === (channel.name || name).toLowerCase());
    qs('#channel-grid').innerHTML = renderGrid(list);

    // Top search
    const input = qs('#search-input');
    const form = qs('#search-form');
    const btn = qs('#search-button');
    const go = () => {
      const q = (input?.value || '').trim();
      if (q) window.location.href = `index.html?q=${encodeURIComponent(q)}`;
      else window.location.href = 'index.html';
    };
    input?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
    form?.addEventListener('submit', (e) => { e.preventDefault(); go(); });
    btn?.addEventListener('click', go);
  });
})();
