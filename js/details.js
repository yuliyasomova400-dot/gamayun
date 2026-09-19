const detailServices = {
  'vase': ['Изготовление вазы', [], 'от 7 000 ₽', '1565193566173-7a0ee3dbe261'],
  'wheel-clay': ['Круг + лепка', [], '5 500 ₽', '1609881582441-7c9385db15c3'],
  'ceramics-courses': ['Курсы керамики', [], 'от 10 000 ₽', '1610701596007-11502861dcfa'],
  'coworking': ['Коворкинг', [], 'от 2 500 ₽', ''],
  wheel: ['Гончарный круг', ['Первое знакомство с кругом: научимся центрировать глину и создадим свою первую форму.'], 'от 2 500 ₽', '1609881582441-7c9385db15c3'],
  handbuilding: ['Ручная лепка', ['Работаем руками, без спешки, и превращаем комок глины в личную вещь.'], 'от 2 200 ₽', '1610701596007-11502861dcfa'],
  painting: ['Роспись керамики', ['Добавляем цвет, линии и детали — и создаём вещь с вашим характером.'], 'от 1 800 ₽', '1579783902614-a3fb3927b6a5'],
  date: ['Свидание в гончарной мастерской', ['Сходить в кино и посидеть в кафе – это здорово, но мы предлагаем вам немного разнообразить ваш досуг и приглашаем на необычное свидание в нашей мастерской!', 'Проведите время вдвоём за гончарным кругом или за ручным изготовлением общего керамического изделия!', 'Чай, уютную атмосферу и помощь наших мастеров обещаем!'], 'от 5 500 ₽', '1686472240661-db7f4eda4afe'],
  family: ['Мастер-класс «Ручная лепка» и мастер-класс «Гончарный круг»: выбирай любой!', ['Мамы и папы, дети, бабушки и дедушки! Приходите к нам в гости!', 'Мы все вместе большой дружной компанией будем учиться работать с керамикой.', 'В дружеской атмосфере вы создадите керамическое изделие своими руками или за гончарным кругом! Мы познакомим вас со всеми этапами изготовления керамики от куска сырой глины до обжига, росписи и глазуровки готового изделия.', 'Приходите, вам будет интересно!'], 'от 4 500 ₽', '1565193566173-7a0ee3dbe261'],
  kids: ['Детский мастер-класс', ['Знакомство с глиной в бережном и свободном творческом формате.'], 'от 1 600 ₽', '1615486511484-92e172affd6a'],
  course: ['Время для девчонок!', ['Бери с собой своих подруг и приходи к нам!', 'Каждую пятницу в нашей мастерской мастер-класс по ручной лепке «Время для девчонок!».', 'За чаем и разговорами, под чутким и ненавязчивым руководством наших мастеров, в уютной обстановке вы и не заметите, как изготовите настоящее керамическое изделие: кружку, тарелку, - которые будут радовать вас и напоминать вам о хорошо проведённом времени!', 'У тебя и твоих подруг свободная пятница? Приходите к нам!'], 'от 2 200 ₽', '1610701596007-11502861dcfa'],
  corporate: ['Корпоративное занятие', ['Творческий формат, который объединяет команду и оставляет память.'], 'по запросу', '1678296728930-775d299daaca']
};
const detailType = new URLSearchParams(location.search).get('type');
const detail = detailServices[detailType] || detailServices.wheel;
document.title = `${detail[0]} — Гамаюн Керамика`;
document.querySelector('#detail-title').textContent = detail[0];
document.querySelector('#detail-description').replaceChildren(...detail[1].map((paragraph) => { const element = document.createElement('p'); element.textContent = paragraph; return element; }));
document.querySelector('#detail-price').textContent = detail[2];
document.querySelector('#detail-image').src = detail[3] ? `https://images.unsplash.com/photo-${detail[3]}?auto=format&fit=crop&w=1400&q=85` : 'images/hero-gamayun-studio-enhanced.png';
if (['vase', 'wheel-clay', 'ceramics-courses', 'coworking'].includes(detailType)) {
  document.querySelector('.detail-facts > div:first-child strong').textContent = 'Уточняется в студии';
  document.querySelector('.detail-copy').hidden = true;
}
document.querySelector('#detail-book').href = `calendar.html?type=${detailType in detailServices ? detailType : 'wheel'}`;
const studioPhotoTypes = ["wheel","handbuilding","painting","date","family","kids","course","vase","wheel-clay","ceramics-courses","coworking"];
if (studioPhotoTypes.includes(detailType)) document.querySelector('#detail-image').src = `images/class-${detailType}.png`;
