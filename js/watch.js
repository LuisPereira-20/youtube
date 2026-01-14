'use strict';

(function () {
  function qs(sel) { return document.querySelector(sel); }
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  }

  function renderRecommendations(currentId, all) {
    const rec = qs('#watch-recommendations');
    if (!rec) return;
    const list = all.filter(v => v.id !== currentId).slice(0, 8);
    const html = list.map(v => `
      <div class="opcion">
        <a href="watch.html?id=${encodeURIComponent(v.id)}" title="${escapeHtml(v.title)}">
          <img src="${v.thumbnail}" width="250" height="125" alt="${escapeHtml(v.title)}" />
        </a>
        <div class="artista-reproduciones">
          <h3>${escapeHtml(v.title)}</h3>
          <div class="artista">${escapeHtml(v.channel?.name || '')}</div>
          <div class="reproducciones">${(window.utils?.formatNumber ? window.utils.formatNumber(v.stats?.views || 0) : v.stats?.views || 0)} de reproducciones</div>
        </div>
      </div>
    `).join('');
    rec.innerHTML = html;
  }

  function renderVideo(v) {
    const videoWrap = qs('#watch-video');
    const titleEl = qs('#watch-title');
    const avatar = qs('#watch-avatar');
    const channel = qs('#watch-channel');
    const subs = qs('#watch-subs');
    const likes = qs('#watch-likes');

    if (!v) {
      if (videoWrap) videoWrap.innerHTML = '<p style="color:#fff">Video no encontrado.</p>';
      return;
    }

    const hasSrc = Boolean(v.videoSrc);
    const media = hasSrc
      ? `<video height="424" controls><source src="${v.videoSrc}" type="video/mp4"></video>`
      : `<img src="${v.thumbnail}" width="100%" alt="${escapeHtml(v.title)}" />`;

    videoWrap.innerHTML = media;
    titleEl.textContent = v.title;
    avatar.src = v.channel?.avatar || '';
    channel.textContent = v.channel?.name || '';
    subs.textContent = v.channel?.subscribers ? `${v.channel.subscribers} de suscriptores` : '';
    likes.textContent = (window.utils?.formatNumber ? window.utils.formatNumber(v.stats?.likes || 0) : (v.stats?.likes || 0));
  }

  function setupTopSearch() {
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
  }

  document.addEventListener('DOMContentLoaded', () => {
    const id = getParam('id');
    const all = Array.isArray(window.VIDEOS) ? window.VIDEOS : [];
    const video = all.find(v => v.id === id) || all[0];

    renderVideo(video);
    renderRecommendations(video?.id, all);
    setupTopSearch();
  });
})();
