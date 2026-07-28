// Relógio real (São Paulo) — pequeno detalhe editorial, mas de verdade, não estático
function updateClock() {
  const el = document.getElementById('nav-time');
  if (!el) return;
  const now = new Date().toLocaleTimeString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
  });
  el.textContent = now;
}
updateClock();
setInterval(updateClock, 1000 * 30);

// ===== Galeria Stage + Lightbox =====
// Lê as imagens direto dos thumbnails no HTML (uma fonte de dados só,
// não duplica em um array separado) e funciona em qualquer .case-gallery
// da página, mesmo se houver mais de uma.
(function initCaseGalleries() {
  const galleries = document.querySelectorAll('.case-gallery[data-lightbox-root]');

  galleries.forEach((gallery) => {
    const thumbs = [...gallery.querySelectorAll('.gallery-thumb')];
    if (!thumbs.length) return;

    const items = thumbs.map((thumb) => {
      const img = thumb.querySelector('img');
      return {
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt') || '',
        caption: thumb.getAttribute('data-caption') || img.getAttribute('alt') || '',
      };
    });

    let current = 0;
    const mainButton = gallery.querySelector('[data-open-lightbox]');
    const mainImage = gallery.querySelector('[data-gallery-main]');
    const caption = gallery.querySelector('[data-caption]');
    const currentLabel = gallery.querySelector('[data-current]');
    const totalLabel = gallery.querySelector('[data-total]');
    const lightbox = document.querySelector(gallery.dataset.lightboxRoot);
    const lightboxImage = lightbox.querySelector('[data-lightbox-image]');
    const lightboxCaption = lightbox.querySelector('[data-lightbox-caption]');

    totalLabel.textContent = String(items.length).padStart(2, '0');

    function render(index, moveFocus = false, isInitial = false) {
      current = (index + items.length) % items.length;
      const item = items[current];
      mainButton.classList.add('is-changing');

      const preload = new Image();
      preload.onload = () => {
        mainImage.src = item.src;
        mainImage.alt = item.alt;
        caption.textContent = item.caption;
        currentLabel.textContent = String(current + 1).padStart(2, '0');
        thumbs.forEach((thumb, i) => {
          const active = i === current;
          thumb.classList.toggle('is-active', active);
          thumb.setAttribute('aria-current', active ? 'true' : 'false');
        });
        if (!isInitial) {
          thumbs[current].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }
        mainButton.classList.remove('is-changing');
        if (moveFocus) mainButton.focus();
        updateLightbox();
      };
      preload.src = item.src;
    }

    function updateLightbox() {
      const item = items[current];
      lightboxImage.src = item.src;
      lightboxImage.alt = item.alt;
      lightboxCaption.textContent = `${String(current + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')} — ${item.caption}`;
    }

    gallery.querySelector('[data-prev]').addEventListener('click', () => render(current - 1));
    gallery.querySelector('[data-next]').addEventListener('click', () => render(current + 1));
    thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => render(i)));

    mainButton.addEventListener('click', () => {
      updateLightbox();
      lightbox.showModal();
      document.body.style.overflow = 'hidden';
    });

    lightbox.querySelector('[data-close-lightbox]').addEventListener('click', () => lightbox.close());
    lightbox.querySelector('[data-lightbox-prev]').addEventListener('click', () => render(current - 1));
    lightbox.querySelector('[data-lightbox-next]').addEventListener('click', () => render(current + 1));
    lightbox.addEventListener('close', () => { document.body.style.overflow = ''; });
    lightbox.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });

    gallery.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') render(current - 1);
      if (event.key === 'ArrowRight') render(current + 1);
    });
    lightbox.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') render(current - 1);
      if (event.key === 'ArrowRight') render(current + 1);
    });

    render(0, false, true);
  });
})();

// ===== Escritos — busca posts reais do Substack via API própria =====
async function loadSubstackPosts({ containerSelector, limit, render, fallbackLink }) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  try {
    const res = await fetch('/api/substack-feed');
    if (!res.ok) throw new Error('Falha ao buscar feed');
    const { posts } = await res.json();

    if (!posts || !posts.length) throw new Error('Feed vazio');

    container.innerHTML = posts.slice(0, limit).map(render).join('');
  } catch (err) {
    // Fallback: se a API falhar (ex: rodando local sem `vercel dev`),
    // mostra um link direto pro Substack em vez de deixar a seção vazia.
    container.innerHTML = `
      <p style="color:var(--ink-soft); font-size: var(--size-small);">
        Não foi possível carregar os posts automaticamente.
        <a href="${fallbackLink}" target="_blank" rel="noopener" style="color:var(--accent);">Ver no Substack →</a>
      </p>`;
  }
}

// Home: lista curta de 3 posts recentes
loadSubstackPosts({
  containerSelector: '[data-substack-home]',
  limit: 3,
  fallbackLink: 'https://aviniciuss.substack.com/',
  render: (post) => `
    <div class="writing-item">
      <span class="writing-date">${post.date}</span>
      <a href="${post.link}" target="_blank" rel="noopener" class="writing-title">${post.title}</a>
    </div>`,
});

// Página Escritos: lista completa com resumo
loadSubstackPosts({
  containerSelector: '[data-substack-full]',
  limit: 12,
  fallbackLink: 'https://aviniciuss.substack.com/',
  render: (post) => `
    <div class="writing-row">
      <span class="writing-row-date">${post.date}</span>
      <span class="writing-row-title">${post.title}</span>
      <a href="${post.link}" target="_blank" rel="noopener" class="writing-row-link">Ler →</a>
      <p class="writing-row-excerpt">${post.excerpt}</p>
    </div>`,
});

// ===== Galeria Multimídia (.media-gallery + .media-lightbox) =====
// Estilo sem chrome: sem card, sem fundo, sem botão sólido — a imagem/vídeo
// é o próprio protagonista. Lê os thumbs direto do HTML (data-type,
// data-src, data-caption), sem duplicar dado em array separado.
(function initMediaGallery() {
  const gallery = document.querySelector('.media-gallery');
  const lightbox = document.querySelector('.media-lightbox');
  if (!gallery || !lightbox) return;

  const thumbs = [...gallery.querySelectorAll('[data-src]')];
  if (!thumbs.length) return;

  const items = thumbs.map((thumb) => ({
    type: thumb.dataset.type || 'image',
    src: thumb.dataset.src,
    caption: thumb.dataset.caption || '',
  }));

  let current = 0;

  const stage = gallery.querySelector('[data-media-stage]');
  const openBtn = gallery.querySelector('[data-media-open]');
  const caption = gallery.querySelector('[data-media-caption]');
  const currentLabel = gallery.querySelector('[data-media-current]');
  const totalLabel = gallery.querySelector('[data-media-total]');
  const prevBtn = gallery.querySelector('[data-media-prev]');
  const nextBtn = gallery.querySelector('[data-media-next]');

  const lbStage = lightbox.querySelector('[data-media-lightbox-stage]');
  const lbCaption = lightbox.querySelector('[data-media-lightbox-caption]');
  const lbPrev = lightbox.querySelector('[data-media-lightbox-prev]');
  const lbNext = lightbox.querySelector('[data-media-lightbox-next]');
  const lbClose = lightbox.querySelector('[data-media-close]');

  totalLabel.textContent = String(items.length).padStart(2, '0');

  function buildMediaEl(item, { autoplayMuted = false, withControls = false } = {}) {
    if (item.type === 'video') {
      const v = document.createElement('video');
      v.src = item.src;
      v.playsInline = true;
      v.preload = 'metadata';
      if (withControls) v.controls = true;
      if (autoplayMuted) { v.muted = true; v.autoplay = true; v.loop = true; }
      return v;
    }
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.caption;
    return img;
  }

  // Troca a mídia do palco principal com um crossfade quase imperceptível
  function render(index, { isInitial = false } = {}) {
    current = (index + items.length) % items.length;
    const item = items[current];

    const swap = () => {
      stage.innerHTML = '';
      stage.appendChild(buildMediaEl(item, { autoplayMuted: item.type === 'video' }));
      caption.textContent = item.caption;
      currentLabel.textContent = String(current + 1).padStart(2, '0');
      thumbs.forEach((t, i) => t.classList.toggle('is-active', i === current));
      requestAnimationFrame(() => stage.classList.remove('is-swapping'));
      if (lightbox.open) renderLightbox();
    };

    if (isInitial) {
      swap();
    } else {
      stage.classList.add('is-swapping');
      setTimeout(swap, 140);
    }
  }

  function renderLightbox() {
    const item = items[current];
    lbStage.innerHTML = '';
    lbStage.appendChild(buildMediaEl(item, { withControls: item.type === 'video' }));
    lbCaption.textContent = `${String(current + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')} — ${item.caption}`;
  }

  prevBtn.addEventListener('click', () => render(current - 1));
  nextBtn.addEventListener('click', () => render(current + 1));
  thumbs.forEach((t, i) => t.addEventListener('click', () => render(i)));

  openBtn.addEventListener('click', () => {
    renderLightbox();
    lightbox.showModal();
    document.body.style.overflow = 'hidden';
  });

  lbClose.addEventListener('click', () => lightbox.close());
  lbPrev.addEventListener('click', () => render(current - 1));
  lbNext.addEventListener('click', () => render(current + 1));

  lightbox.addEventListener('close', () => {
    document.body.style.overflow = '';
    const v = lbStage.querySelector('video');
    if (v) v.pause();
  });
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.close();
  });

  document.addEventListener('keydown', (e) => {
    const relevant = lightbox.open || gallery.contains(document.activeElement);
    if (!relevant) return;
    if (e.key === 'ArrowLeft') render(current - 1);
    if (e.key === 'ArrowRight') render(current + 1);
    if (e.key === 'Escape' && lightbox.open) lightbox.close();
  });

  render(0, { isInitial: true });
})();
