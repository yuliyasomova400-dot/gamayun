const detailType = new URLSearchParams(location.search).get('type');
const detail = window.studioServices.find(service => service.id === detailType);
if (!detail) {
  document.querySelector('#detail-title').textContent = 'Этот формат больше не представлен';
  document.querySelector('#detail-book').textContent = 'Посмотреть актуальные занятия';
  document.querySelector('#detail-book').href = 'index.html#directions';
  document.querySelector('.detail-facts').hidden = true;
  document.querySelector('.detail-copy').hidden = true;
  document.querySelector('.details-photo').hidden = true;
} else {
  document.title = detail.title + ' — Гамаюн Керамика';
  document.querySelector('#detail-title').textContent = detail.title;
  document.querySelector('#detail-description').replaceChildren(...[detail.audience, ...detail.description].filter(Boolean).map(text => {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    return paragraph;
  }));
  document.querySelector('#detail-price').textContent = detail.price;
  const duration = document.querySelector('.detail-facts > div:first-child');
  duration.querySelector('strong').textContent = detail.duration;
  duration.hidden = !detail.duration;
  document.querySelector('.detail-copy').hidden = true;
  document.querySelector('#detail-image').src = detail.image;
  document.querySelector('#detail-image').alt = detail.title;
  const book = document.querySelector('#detail-book');
  book.href = detail.hours ? 'calendar.html?type=' + detail.id : 'tel:+79203214400';
  if (!detail.hours) book.textContent = 'Уточнить в студии';
}
