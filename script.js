const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const toast = document.querySelector('.toast');

menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('[data-scroll-to]').forEach((button) => {
  button.addEventListener('click', () => {
    document.getElementById(button.dataset.scrollTo)?.scrollIntoView({ behavior: 'smooth' });
    nav?.classList.remove('open');
  });
});

document.querySelectorAll('[data-action]').forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    if (action === 'book') {
      showToast(`Запись на «${button.dataset.workshop}» подключим следующим этапом`);
      return;
    }
    if (action === 'calendar') {
      showToast('Календарь бронирования подключим следующим этапом');
      return;
    }
    if (action === 'shop') {
      showToast('Магазин подключим следующим этапом');
    }
  });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2800);
}
