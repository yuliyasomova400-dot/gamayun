const detailServices = {
  wheel: ['Гончарный круг', 'Первое знакомство с кругом: научимся центрировать глину и создадим свою первую форму.', 'от 2 500 ₽', '1609881582441-7c9385db15c3'],
  handbuilding: ['Лепка из глины', 'Работаем руками, без спешки, и превращаем комок глины в личную вещь.', 'от 2 200 ₽', '1610701596007-11502861dcfa'],
  painting: ['Роспись керамики', 'Добавляем цвет, линии и детали — и создаём вещь с вашим характером.', 'от 1 800 ₽', '1579783902614-a3fb3927b6a5'],
  date: ['Свидание для двоих', 'Тёплый творческий вечер, в котором вы создадите общее воспоминание.', 'от 5 500 ₽', '1686472240661-db7f4eda4afe'],
  family: ['Семейный подряд', 'Время вместе за одним столом: каждому найдётся своя форма и задача.', 'от 4 500 ₽', '1565193566173-7a0ee3dbe261'],
  kids: ['Детский мастер-класс', 'Знакомство с глиной в бережном и свободном творческом формате.', 'от 1 600 ₽', '1615486511484-92e172affd6a'],
  course: ['Обучающий курс', 'Несколько встреч, чтобы уверенно освоить материал и найти свой почерк.', 'от 9 900 ₽', '1610701596007-11502861dcfa'],
  corporate: ['Корпоративное занятие', 'Творческий формат, который объединяет команду и оставляет память.', 'по запросу', '1678296728930-775d299daaca']
};
const detailType = new URLSearchParams(location.search).get('type');
const detail = detailServices[detailType] || detailServices.wheel;
document.title = `${detail[0]} — Гамаюн Керамика`;
document.querySelector('#detail-title').textContent = detail[0];
document.querySelector('#detail-description').textContent = detail[1];
document.querySelector('#detail-price').textContent = detail[2];
document.querySelector('#detail-image').src = `https://images.unsplash.com/photo-${detail[3]}?auto=format&fit=crop&w=1400&q=85`;
document.querySelector('#detail-book').href = `calendar.html?type=${detailType in detailServices ? detailType : 'wheel'}`;
