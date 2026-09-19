const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  });

  navigation.addEventListener('click', (event) => {
    if (!event.target.closest('a')) return;
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Открыть меню');
  });
}

const studioHeroImage = 'images/hero-gamayun-studio-enhanced.png';
try {
  const imageOverrides = JSON.parse(localStorage.getItem('gamayun-image-overrides')) || {};
  Object.entries(imageOverrides).forEach(([key, source]) => {
    const image = document.querySelector(`img[data-image-key="${key}"]`);
    if (image && source && !image.hasAttribute('data-studio-photo')) image.src = key === 'hero' ? studioHeroImage : key === 'corporate' ? 'images/corporate-workshop.png' : source;
  });
} catch { /* The public site stays unchanged if browser storage is unavailable. */ }

document.querySelectorAll('img[data-fallback-src]').forEach((image) => {
  image.addEventListener('error', () => {
    if (image.src !== image.dataset.fallbackSrc) image.src = image.dataset.fallbackSrc;
  }, { once: true });
});

const shopGrid = document.querySelector('.product-grid');
const filterButtons = document.querySelectorAll('[data-filter]');

const shopImages = {
  vases: 'images/shop-vase-moloko.png',
  mugs: 'https://images.unsplash.com/photo-1772453609632-2f4aa857f56e?auto=format&fit=crop&w=800&q=80',
  candles: 'https://images.unsplash.com/photo-1678296728930-775d299daaca?auto=format&fit=crop&w=800&q=80',
  plates: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
  decor: 'https://images.unsplash.com/photo-1738744654020-9dad6814fcf4?auto=format&fit=crop&w=800&q=80'
};

const catalogueSets = [
  ['vases', ['Ваза «Молоко»', 'Ваза «Песок»', 'Ваза «Луна»', 'Ваза «Течение»', 'Ваза «Роса»', 'Ваза «Берег»', 'Ваза «Тёплая форма»', 'Ваза «Утро»'], ['3 900 ₽', '4 400 ₽', '3 600 ₽', '4 800 ₽', '3 300 ₽', '4 100 ₽', '3 750 ₽', '4 200 ₽']],
  ['mugs', ['Кружка «Берег»', 'Кружка «Тёплый белый»', 'Кружка «Зерно»', 'Кружка «Глина»', 'Кружка «Медовый свет»', 'Кружка «Тишина»', 'Кружка «Сливки»', 'Кружка «Небо»'], ['1 800 ₽', '1 950 ₽', '1 700 ₽', '2 100 ₽', '1 900 ₽', '1 750 ₽', '2 050 ₽', '1 850 ₽']],
  ['candles', ['Подсвечник «Тень»', 'Свеча «Сумерки»', 'Подсвечник «Пламя»', 'Свеча «Тёплый вечер»', 'Подсвечник «Круг»', 'Свеча «Лён»', 'Подсвечник «Точка»', 'Свеча «Рассвет»'], ['1 500 ₽', '1 700 ₽', '1 600 ₽', '1 450 ₽', '1 800 ₽', '1 550 ₽', '1 650 ₽', '1 750 ₽']],
  ['plates', ['Тарелка «Лён»', 'Тарелка «Земля»', 'Тарелка «Белая глина»', 'Тарелка «Тёплый край»', 'Тарелка «Облако»', 'Тарелка «Линия»', 'Тарелка «Утро»', 'Тарелка «Дом»'], ['2 600 ₽', '2 900 ₽', '2 400 ₽', '3 100 ₽', '2 550 ₽', '2 750 ₽', '2 850 ₽', '3 200 ₽']],
  ['decor', ['Объект «Точка»', 'Форма «Волна»', 'Мини-ваза «Росток»', 'Объект «Песчинка»', 'Подставка «Камень»', 'Форма «Пауза»', 'Объект «Ритм»', 'Панно «Свет»'], ['2 200 ₽', '2 800 ₽', '1 900 ₽', '2 450 ₽', '1 700 ₽', '2 600 ₽', '2 300 ₽', '3 400 ₽']]
];

const products = catalogueSets.flatMap(([category, titles, prices]) => titles.map((title, index) => ({ category, title, price: prices[index], image: shopImages[category] })));
products.push(
  ...['Чашка «Облако»', 'Ваза «Мягкая форма»', 'Тарелка «Песок»', 'Кружка «Крем»', 'Подсвечник «Вечер»', 'Панно «Трава»', 'Ваза «Воздух»', 'Тарелка «Точка»'].map((title, index) => ({ category: 'sale', title, price: ['1 280 ₽', '2 720 ₽', '1 950 ₽', '1 350 ₽', '1 190 ₽', '2 200 ₽', '2 550 ₽', '1 890 ₽'][index], oldPrice: ['1 600 ₽', '3 200 ₽', '2 400 ₽', '1 700 ₽', '1 500 ₽', '2 800 ₽', '3 100 ₽', '2 300 ₽'][index], image: shopImages[['mugs', 'vases', 'plates', 'mugs', 'candles', 'decor', 'vases', 'plates'][index]] }))
);

function renderShop() {
  if (!shopGrid) return;
  shopGrid.innerHTML = products.map((product) => `<article class="product-card" data-category="${product.category}"><div class="product-image">${product.oldPrice ? '<span class="sale-badge">−20%</span>' : ''}<img src="${product.image}" alt="${product.title}" loading="lazy"></div><div><h3>${product.title}</h3><p>${product.oldPrice ? `<s>${product.oldPrice}</s> ` : ''}${product.price}</p><button class="add-to-cart" type="button" data-cart-title="${product.title}" data-cart-price="${product.price.replace(/[^0-9]/g,'')}" data-cart-image="${product.image}">В корзину</button></div></article>`).join('');
}

renderShop();

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('is-active', item === button));
    document.querySelectorAll('[data-category]').forEach((card) => card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter));
  });
});

/* The vase collection has its own 20-image catalogue and progressive loading. */
const loadMoreButton = document.querySelector('.load-more');
const vaseImages = [
  'images/shop-vase-moloko.png',
  'https://images.unsplash.com/photo-1687191883721-257d8cad5b54?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1631125915902-d8abe9225ff2?auto=format&fit=crop&w=800&q=80',
  'https://images.squarespace-cdn.com/content/v1/60ddc9195bf01408d0b19f9c/282ca764-030c-4236-a24a-99aabab2c0fe/tom-crew-E64Hv5Ab_nQ-unsplash.jpg',
  'https://localedition.com.au/cdn/shop/files/Celebrate_Our_New_Website_Launch._Use_Code_Artisan30_at_Checkout_for_30_Off_All_Artistry..png?v=1733095226&width=900',
  'https://images.squarespace-cdn.com/content/v1/61d589eb1a26df34636b3fb5/1642521602811-1CEAICMIG61P8I10CKQA/ELLISPAINTQUIETGREY%2CDOUBLEQUIETGREY%2B%281%29.jpg?format=1000w',
  'https://boticaamano.com/cdn/shop/files/Portugiesische_Keramik_Vase_Toepferei_10.jpg?v=1762799271&width=1024',
  'https://cdn.shopify.com/s/files/1/0762/1056/9554/files/TERRA.BIGWHITEVASE3.jpg?v=1715939556',
  'https://www.gharyan.com/cdn/shop/files/CL101280_Fomat_WEB.jpg?v=1743521055',
  'https://www.notaryceramics.com/cdn/shop/files/20260318-161820696_1080x.jpg?v=1773977743',
  'https://www.notaryceramics.com/cdn/shop/files/KrisLeBoeuf_NotaryCeramics-9572_620x.jpg?v=1718213866',
  'https://static.wixstatic.com/media/d62df8_791b7ab180144103a6510558a0583dc0~mv2.png/v1/fill/w_600,h_604,al_c/d62df8_791b7ab180144103a6510558a0583dc0~mv2.png',
  'https://assets.glamour.de/photos/623b25000c2a72d1b3e703c0/4:3/w_3779,h_2834,c_limit/handgefertigte-keramik-gettyimages-1348004814.jpg',
  'https://images.squarespace-cdn.com/content/v1/5ef162a98a170f6e0810fde3/1592955896201-Q5XZBJ96EOGADGJIZWB5/DSC09970.jpg',
  'https://static.wixstatic.com/media/2cd72f_86c65f65cb314f58a3ed803ca9558fcc~mv2.jpg/v1/fill/w_1200,h_1200,al_c/2cd72f_86c65f65cb314f58a3ed803ca9558fcc~mv2.jpg',
  'https://cdn.shopify.com/s/files/1/0366/7643/6012/articles/Plantilla-Portada-Blog_2048x2048.jpg?v=1669914629',
  'https://images.unsplash.com/photo-1738744654020-9dad6814fcf4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1772453609632-2f4aa857f56e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1678296728930-775d299daaca?auto=format&fit=crop&w=800&q=80'
];
const vaseNames = ['Ваза «Молоко»', 'Ваза «Песок»', 'Ваза «Луна»', 'Ваза «Течение»', 'Ваза «Роса»', 'Ваза «Берег»', 'Ваза «Тёплая форма»', 'Ваза «Утро»', 'Ваза «Дюна»', 'Ваза «Мел»', 'Ваза «Капля»', 'Ваза «Ракушка»', 'Ваза «Полдень»', 'Ваза «Иней»', 'Ваза «Земля»', 'Ваза «Форма»', 'Ваза «Оттиск»', 'Ваза «Тишина»', 'Ваза «Стебель»', 'Ваза «Круг»'];
const vasePrices = ['3 900 ₽', '4 400 ₽', '3 600 ₽', '4 800 ₽', '3 300 ₽', '4 100 ₽', '3 750 ₽', '4 200 ₽', '3 500 ₽', '4 600 ₽', '3 850 ₽', '4 300 ₽', '3 700 ₽', '4 500 ₽', '3 950 ₽', '4 150 ₽', '3 550 ₽', '4 750 ₽', '3 650 ₽', '4 250 ₽'];
const currentVases = products.filter((product) => product.category === 'vases');
currentVases.forEach((product, index) => { product.image = vaseImages[index]; });
products.push(...vaseNames.slice(8).map((title, index) => ({ category: 'vases', title, price: vasePrices[index + 8], image: vaseImages[index + 8] })));

renderShop();
let activeShopFilter = 'all';
let shownProducts = 8;

function updateShopVisibility() {
  const matchingCards = Array.from(document.querySelectorAll('.product-card')).filter((card) => activeShopFilter === 'all' || card.dataset.category === activeShopFilter);
  document.querySelectorAll('.product-card').forEach((card) => card.classList.add('is-hidden'));
  matchingCards.slice(0, shownProducts).forEach((card) => card.classList.remove('is-hidden'));
  if (loadMoreButton) loadMoreButton.hidden = shownProducts >= matchingCards.length;
}

filterButtons.forEach((button) => button.addEventListener('click', () => {
  activeShopFilter = button.dataset.filter;
  shownProducts = 8;
  updateShopVisibility();
}));
if (loadMoreButton) loadMoreButton.addEventListener('click', () => { shownProducts += 8; updateShopVisibility(); });
updateShopVisibility();

function updateCartCount() { let cart = []; try { cart = JSON.parse(localStorage.getItem('gamayun-cart')) || []; } catch {} document.querySelectorAll('[data-cart-count]').forEach((item) => { item.textContent = cart.length; }); }
document.addEventListener('click', (event) => { const button = event.target.closest('.add-to-cart'); if (!button) return; let cart = []; try { cart = JSON.parse(localStorage.getItem('gamayun-cart')) || []; } catch {} cart.push({ title: button.dataset.cartTitle, price: Number(button.dataset.cartPrice), image: button.dataset.cartImage }); localStorage.setItem('gamayun-cart', JSON.stringify(cart)); button.textContent = 'Добавлено'; updateCartCount(); setTimeout(() => { button.textContent = 'В корзину'; }, 900); });
updateCartCount();

const savedClient = (() => { try { return JSON.parse(localStorage.getItem('gamayun-current-client')); } catch { return null; } })();
const accountLink = document.querySelector('.account-link');
if (savedClient && accountLink) { accountLink.classList.add('account-name'); accountLink.href = 'account.html'; accountLink.setAttribute('aria-label', `Личный кабинет: ${savedClient.name}`); accountLink.title = 'Личный кабинет'; accountLink.textContent = savedClient.name; }
