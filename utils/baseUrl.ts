// Назначение: базовый URL приложения.
// Как работает: Выбирает адрес из переменных окружения или локального значения для серверных запросов.

export const baseUrl =
	process.env.NEXT_PUBLIC_BASE_URL || 'https://delivery-shop.ru'
