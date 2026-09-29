(() => {
  const dialog = document.getElementById('custom-lightbox');
  if (!dialog) return;
  const captions = ['Зеркало с керамическим морским декором', 'Детали керамической рамы', 'Панно с растениями', 'Керамика и растения — общий фрагмент', 'Детали зелёного панно', 'Композиция из белых рельефов', 'Рельефы в интерьере', 'Птицы и ботанические мотивы', 'Рельеф с птицами — детали', 'Рельеф с рыбой', 'Ботанический рельеф'];
  const photos = captions.map((caption, i) => ({caption, src: `images/custom-orders/${String(i + 1).padStart(2, '0')}.png`}));
  const full = document.getElementById('custom-full-image');
  const thumbs = dialog.querySelector('.custom-thumbnails');
  let current = 0, previousOverflow = '', opener;
  photos.forEach((photo, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', photo.caption);
    const img = document.createElement('img');
    img.src = photo.src; img.alt = ''; img.loading = 'lazy';
    button.append(img); button.addEventListener('click', () => select(i)); thumbs.append(button);
  });
  function select(i) {
    current = (i + photos.length) % photos.length;
    full.src = photos[current].src; full.alt = photos[current].caption;
    document.getElementById('custom-caption').textContent = photos[current].caption;
    document.getElementById('custom-count').textContent = `${current + 1} / ${photos.length}`;
    [...thumbs.children].forEach((b, n) => b.setAttribute('aria-pressed', String(n === current)));
    thumbs.children[current].scrollIntoView({block: 'nearest', inline: 'nearest'});
  }
  document.querySelectorAll('[data-custom-photo]').forEach(button => button.addEventListener('click', () => {
    opener = button; previousOverflow = document.body.style.overflow;
    dialog.showModal(); document.body.style.overflow = 'hidden'; select(Number(button.dataset.customPhoto));
  }));
  dialog.querySelector('[data-custom-close]').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-custom-prev]').addEventListener('click', () => select(current - 1));
  dialog.querySelector('[data-custom-next]').addEventListener('click', () => select(current + 1));
  dialog.addEventListener('close', () => {document.body.style.overflow = previousOverflow; opener?.focus({preventScroll:true});});
  dialog.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {e.preventDefault(); select(current + (e.key === 'ArrowRight' ? 1 : -1));}
  });
  let startX = null;
  full.addEventListener('touchstart', e => {startX = e.changedTouches[0].clientX;}, {passive:true});
  full.addEventListener('touchend', e => {if (startX !== null) {const delta = e.changedTouches[0].clientX - startX; if (Math.abs(delta) > 50) select(current + (delta < 0 ? 1 : -1));} startX = null;}, {passive:true});
})();
