// Единое место для настроек, которые переиспользуются в UI, API-роутах и хуках.
// Если меняешь значение здесь, проверь связанные компоненты, указанные в комментариях ниже.
export const CONFIG = {
	// === ПАГИНАЦИЯ: ТОВАРЫ ===

	// Базовый размер страницы для списков товаров.
	// Используется в GenericListPage, PaginationWrapper, /api/products и /api/users/purchases.
	ITEMS_PER_PAGE: 3,

	// Сколько товаров показывать в блоках главной страницы.
	// Используется в Actions, NewProducts, Purchases и /api/products/brand.
	ITEMS_PER_PAGE_MAIN_PRODUCTS: 4,

	// Сколько статей загружать для блока статей на главной странице.
	// Используется в Articles и /api/articles.
	ITEMS_PER_PAGE_MAIN_ARTICLES: 3,

	// Размер страницы для категорий каталога и избранных товаров.
	// Используется в GenericListPage, PaginationWrapper, /api/category и /api/users/favorites/products.
	ITEMS_PER_PAGE_CATEGORY: 6,

	// Сколько заказов подгружать за один раз в истории заказов пользователя.
	// Используется в UserOrdersList.
	ITEMS_PER_ORDERS_PAGE: 4,

	// === ПАГИНАЦИЯ: СТАТЬИ/БЛОГ ===

	// Резервный лимит для списка статей блога.
	// Сейчас напрямую в компонентах не используется, оставлен для будущей пагинации /blog.
	ARTICLES_PER_BLOG_PAGE: 3,

	// Резервный лимит для блока похожих статей на странице статьи.
	// Сейчас напрямую в компонентах не используется, оставлен для будущего блока похожих материалов.
	ARTICLES_PER_ARTICLE_PAGE: 3,

	// Резервный лимит комментариев на странице статьи.
	// Сейчас напрямую в компонентах не используется, оставлен для будущей пагинации комментариев.
	COMMENTS_PER_ARTICLE_PAGE: 5,

	// === СКИДКИ И БОНУСЫ ===

	// Дополнительная скидка по карте лояльности в процентах.
	// Используется в ProductCard, ProductOffer, CartItem, orderHelpers, usePricing, userOrderPricing и usePriceComparison.
	CARD_DISCOUNT_PERCENT: 6,

	// Процент бонусов, который начисляется от суммы покупки.
	// Используется в ProductPageContent, usePricing и userOrderPricing.
	BONUSES_PERCENT: 5,

	// Максимальная часть заказа в процентах, которую можно оплатить бонусами.
	// Используется в CartSummary, BonusesSection, OrderSuccessMessage и usePricing.
	MAX_BONUSES_PERCENT: 10,

	// === ЦЕНЫ ===

	// Диапазон цен по умолчанию для фильтра товаров, если API не вернул свой диапазон.
	// Используется в PriceFilter, /api/category и /api/users/favorites/products.
	FALLBACK_PRICE_RANGE: { min: 0, max: 3000 },

	// Минимальная сумма заказа в рублях для оформления корзины.
	// Используется в usePricing и MinimumOrderWarning.
	MIN_ORDER_PRICE: 700,

	// === САЙТ И УЧЕТНЫЕ ЗАПИСИ ===

	// Основной URL сайта.
	// Сейчас напрямую в компонентах не используется, оставлен для SEO, писем и абсолютных ссылок.
	SITE_URL: 'https://delivery-shop.ru',

	// Домен для технических email, которые создаются при регистрации по телефону.
	// Используется в auth.ts, ProfileEmail, Email в списке пользователей и /api/admin/users.
	TEMPORARY_EMAIL_DOMAIN: '@delivery-shop.ru',

	// === OTP-КОДЫ ===

	// Количество попыток ввода OTP-кода до запроса нового кода.
	// Используется в EnterCode, LoginWithOTP и ProfilePhoneSettings.
	MAX_ATTEMPTS: 3,

	// Время жизни OTP-кода в секундах.
	// Используется в EnterCode, LoginWithOTP и ProfilePhoneSettings через useTimer.
	TIMEOUT_PERIOD: 180,

	// === ПРОЧЕЕ ===

	// Размер страницы по умолчанию для административных списков.
	// Используется в users-list/page.tsx и /api/admin/users.
	DEFAULT_PAGE_SIZE: 5,
}
