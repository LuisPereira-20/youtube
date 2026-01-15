'use strict';

(function () {
  function injectShortsCss() {
    const css = `
    html, body { height: 100%; }
    #shorts-feed { display: grid; grid-auto-rows: 1fr; gap: 24px; max-width: 480px; margin: 0 auto; padding: 16px; }
    .short { position: relative; height: min(92vh, 720px); border-radius: 12px; overflow: hidden; background: #000; }
    .short video { width: 100%; height: 100%; object-fit: cover; display: block; }
    .short .meta { position: absolute; left: 12px; bottom: 12px; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,.6); }
    .short .title { margin: 0; font-size: 16px; }
    .short .channel { color: #cfcfcf; font-size: 13px; }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function renderShorts(list) {
    const feed = document.querySelector('#shorts-feed');
    if (!feed) return;
    const html = list.map(s => `
      <section class="short" data-id="${s.id}">
        <video src="${s.src}" muted playsinline loop preload="metadata"></video>
        <div class="meta">
          <h3 class="title">${escapeHtml(s.title || '')}</h3>
          <div class="channel">${escapeHtml(s.channel || '')}</div>
        </div>
      </section>
    `).join('');
    feed.innerHTML = html;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function setupAutoplay() {
    const sections = Array.from(document.querySelectorAll('#shorts-feed .short'));
    if (!sections.length) return;

    const playOnly = (el) => {
      sections.forEach(sec => {
        const v = sec.querySelector('video');
        if (!v) return;
        if (sec === el) { try { v.play(); } catch (e) {} }
        else { v.pause(); v.currentTime = v.currentTime; }
      });
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const sec = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          playOnly(sec);
        }
      });
    }, { threshold: [0, 0.25, 0.6, 1] });

    sections.forEach(sec => io.observe(sec));

    // Tap para pausar/reanudar
    sections.forEach(sec => {
      const v = sec.querySelector('video');
      if (!v) return;
      sec.addEventListener('click', () => {
        if (v.paused) v.play(); else v.pause();
      });
    });
  }

  function setupTopSearch() {
    const input = document.querySelector('.contenedor-busqueda input');
    const form = document.querySelector('.contenedor-busqueda form');
    const btn = document.querySelector('.boton-busqueda');
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
    injectShortsCss();

    // Normaliza idioma/branding/placeholder
    try { document.documentElement.lang = 'es'; } catch (e) {}
    const brand = document.querySelector('#logo-txt');
    if (brand) brand.textContent = 'YouTube';
    const input = document.querySelector('.contenedor-busqueda input');
    if (input) input.setAttribute('placeholder', 'Buscar');

    // Dataset de shorts basado en archivos locales disponibles
    const shorts = [
      { id: 's1', src: './videos/reels.mp4', title: 'Shorts #1', channel: 'Reels' },
      { id: 's2', src: './videos/cdi.mp4', title: 'Shorts #2', channel: 'Reels' },
      { id: 's3', src: './videos/ebqnld.mp4', title: 'Shorts #3', channel: 'Reels' },
      { id: 's4', src: './videos/ebs.mp4', title: 'Shorts #4', channel: 'Reels' }
    ];

    renderShorts(shorts);
    setupAutoplay();
    setupTopSearch();
  });
})();
