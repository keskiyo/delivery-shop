// Назначение: утилита baseUrl.
// Как работает: Содержит переиспользуемую бизнес-логику, форматирование, расчеты или подготовку данных.

export const baseUrl =
	process.env.NEXT_PUBLIC_BASE_URL || 'https://delivery-shop.ru'
