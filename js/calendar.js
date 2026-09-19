const services = {
  'vase': { title: 'Изготовление вазы', meta: 'Длительность уточняется в студии', price: 'от 7 000 ₽' },
  'wheel-clay': { title: 'Круг + лепка', meta: 'Длительность уточняется в студии', price: '5 500 ₽' },
  'ceramics-courses': { title: 'Курсы керамики', meta: 'Длительность уточняется в студии', price: 'от 10 000 ₽' },
  'coworking': { title: 'Коворкинг', meta: 'Длительность уточняется в студии', price: 'от 2 500 ₽' },
  wheel: { title: 'Гончарный круг', meta: 'Первое знакомство с кругом · 2 часа', price: 'от 2 500 ₽' },
  handbuilding: { title: 'Ручная лепка', meta: 'Кружки, тарелки и личные формы · 2 часа', price: 'от 2 200 ₽' },
  painting: { title: 'Роспись керамики', meta: 'Цвет, детали и готовая форма · 2 часа', price: 'от 1 800 ₽' },
  date: { title: 'Свидание для двоих', meta: 'Гончарный круг или общее изделие руками · 2 часа', price: 'от 5 500 ₽' },
  family: { title: 'Семейный подряд', meta: 'Для всей семьи за одним творческим столом · 2 часа', price: 'от 4 500 ₽' },
  kids: { title: 'Детский мастер-класс', meta: 'Для маленьких авторов · 2 часа', price: 'от 1 600 ₽' },
  course: { title: 'Время для девчонок!', meta: 'Каждую пятницу · ручная лепка, чай и разговоры · 2 часа', price: 'от 2 200 ₽' },
  corporate: { title: 'Корпоративное занятие', meta: 'Творческий формат для команды · 2 часа', price: 'по запросу' }
};

const type = new URLSearchParams(location.search).get('type');
const service = services[type] || services.wheel;
const today = new Date(); today.setHours(0, 0, 0, 0);
const viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
let selectedDate = null;
let selectedHour = null;
const busySlots = [[1, 12, 3], [2, 18, 2], [3, 14, 3], [5, 12, 3], [6, 16, 3], [8, 18, 2], [9, 14, 3], [10, 12, 3], [12, 16, 3]];

const monthLabel = document.querySelector('#month-label');
const calendar = document.querySelector('#calendar');
const slotDialog = document.querySelector('#slot-dialog');
const timeOptions = document.querySelector('#time-options');
const selectedSlot = document.querySelector('#selected-slot');
const continueButton = document.querySelector('#continue-button');

document.title = `${service.title} — запись | Гамаюн Керамика`;
document.querySelector('#service-title').textContent = service.title;
document.querySelector('#service-meta').textContent = service.meta;
document.querySelector('#summary-service').textContent = service.title;
document.querySelector('#summary-price').textContent = service.price;

function sameDay(first, second) { return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate(); }
function formatDate(date) { return new Intl.DateTimeFormat('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' }).format(date); }
function readBookings() { try { return JSON.parse(localStorage.getItem('gamayun-bookings')) || []; } catch { return []; } }
function hasActiveBooking(date, hour) {
  return readBookings().some((booking) => {
    if (['Отменено', 'Оплата возвращена'].includes(booking.status)) return false;
    const bookingDate = new Date(booking.date);
    const duration = booking.duration || 2;
    return sameDay(date, bookingDate) && hour >= booking.hour && hour < booking.hour + duration;
  });
}
function isBusy(date, hour) {
  const demoBusy = busySlots.some(([offset, start, duration]) => { const busyDate = new Date(today); busyDate.setDate(today.getDate() + offset); return sameDay(date, busyDate) && hour >= start && hour < start + duration; });
  return demoBusy || hasActiveBooking(date, hour);
}

function renderDates() {
  monthLabel.textContent = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' }).format(viewDate);
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const calendarStart = new Date(firstDay); calendarStart.setDate(firstDay.getDate() - ((firstDay.getDay() + 6) % 7));
  calendar.replaceChildren(...Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStart); date.setDate(calendarStart.getDate() + index);
    const isOutside = date.getMonth() !== viewDate.getMonth();
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'calendar-day'; button.textContent = String(date.getDate());
    button.disabled = isOutside || date < today;
    if (isOutside) button.classList.add('is-outside');
    if (sameDay(date, today)) button.classList.add('is-today');
    if (selectedDate && sameDay(date, selectedDate)) button.classList.add('is-selected');
    if (!button.disabled) button.addEventListener('click', () => { selectedDate = date; selectedHour = null; selectedSlot.textContent = 'Выберите свободное время ниже'; continueButton.disabled = true; renderDates(); renderTimes(); });
    return button;
  }));
}

function renderTimes() {
  if (!selectedDate) return;
  document.querySelector('#dialog-date').textContent = formatDate(selectedDate);
  timeOptions.replaceChildren(...Array.from({ length: 11 }, (_, index) => index + 10).map((hour) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'time-option'; button.textContent = `${String(hour).padStart(2, '0')}:00`;
    if (isBusy(selectedDate, hour)) { button.disabled = true; button.classList.add('is-busy'); button.title = 'Это время уже занято'; }
    if (selectedHour === hour) button.classList.add('is-selected');
    if (!button.disabled) button.addEventListener('click', () => { selectedHour = hour; selectedSlot.textContent = `${formatDate(selectedDate)}, ${String(hour).padStart(2, '0')}:00`; continueButton.disabled = false; slotDialog.close(); });
    return button;
  }));
  slotDialog.showModal();
}

document.querySelector('#previous-month').addEventListener('click', () => { const previous = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1); if (previous >= new Date(today.getFullYear(), today.getMonth(), 1)) { viewDate.setMonth(viewDate.getMonth() - 1); renderDates(); } });
document.querySelector('#next-month').addEventListener('click', () => { viewDate.setMonth(viewDate.getMonth() + 1); renderDates(); });
slotDialog.addEventListener('click', (event) => { if (event.target === slotDialog) slotDialog.close(); });
continueButton.addEventListener('click', () => { let client; try { client = JSON.parse(localStorage.getItem('gamayun-current-client')); } catch { client = null; } if (!client) { alert('Чтобы продолжить к оплате, войдите в личный кабинет.'); location.href = 'account.html'; return; } if (hasActiveBooking(selectedDate, selectedHour)) { alert('Это время только что заняли. Пожалуйста, выберите другой слот.'); selectedHour = null; selectedSlot.textContent = 'Выберите свободное время ниже'; continueButton.disabled = true; renderTimes(); return; } const bookings = readBookings(); const booking = { id: `booking-${Date.now()}`, email: client.email, service: service.title, price: service.price, date: selectedDate.toISOString(), hour: selectedHour, duration: 2, status: 'Не оплачено' }; bookings.unshift(booking); localStorage.setItem('gamayun-bookings', JSON.stringify(bookings)); location.href = `confirmation.html?booking=${booking.id}`; });
renderDates();
