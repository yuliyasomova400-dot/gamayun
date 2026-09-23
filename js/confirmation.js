const bookingId = new URLSearchParams(location.search).get('booking');
let bookings = []; try { bookings = JSON.parse(localStorage.getItem('gamayun-bookings')) || []; } catch { bookings = []; }
const booking = bookings.find((item) => item.id === bookingId);
let client; try { client = JSON.parse(localStorage.getItem('gamayun-current-client')); } catch { client = null; }
if (!booking || !client) { location.replace('booking.html'); } else {
  const date = new Intl.DateTimeFormat('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(booking.date));
  document.querySelector('#booking-review').innerHTML = `<div><span>Занятие</span><strong>${booking.service}</strong></div><div><span>Дата</span><strong>${date}</strong></div><div><span>Время</span><strong>${String(booking.hour).padStart(2, '0')}:00</strong></div><div><span>Адрес</span><strong>г. Смоленск, ул. Коммунистическая, 14</strong></div><div class="review-total"><span>К оплате</span><strong>${booking.price}</strong></div>`;
  document.querySelector('#pay-booking').innerHTML = `Оплатить ${booking.price} <span>→</span>`;
  const form = document.querySelector('#contact-details');
  form.elements.firstName.value = client.firstName || client.name || '';
  form.elements.lastName.value = client.lastName || '';
  form.elements.middleName.value = client.middleName || '';
  form.elements.phone.value = client.phone || '';
  form.elements.email.value = client.email || '';
  document.querySelector('#pay-booking').addEventListener('click', () => { if (!form.reportValidity()) return; const contact = Object.fromEntries(new FormData(form)); booking.contact = contact; booking.status = 'Оплачено'; booking.paidAt = new Date().toISOString(); localStorage.setItem('gamayun-bookings', JSON.stringify(bookings)); const clients = (() => { try { return JSON.parse(localStorage.getItem('gamayun-clients')) || []; } catch { return []; } })(); const clientIndex = clients.findIndex((item) => item.email === client.email); const updatedClient = { ...client, ...contact, name: contact.firstName }; if (clientIndex >= 0) clients[clientIndex] = updatedClient; localStorage.setItem('gamayun-clients', JSON.stringify(clients)); localStorage.setItem('gamayun-current-client', JSON.stringify(updatedClient)); location.href = 'account.html'; });
}
