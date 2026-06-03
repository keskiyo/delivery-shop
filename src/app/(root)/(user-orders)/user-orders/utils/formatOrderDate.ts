// Назначение: форматирование даты заказа.
// Как работает: Приводит дату к ru-RU и заменяет разделители на точки.

export const formatOrderDate = (dateString: string): string => {
	const date = new Date(dateString)

	return date
		.toLocaleDateString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		})
		.replace(/\//g, '.')
}
