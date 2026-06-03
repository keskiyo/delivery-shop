// Назначение: человекочитаемая дата заказа.
// Как работает: Возвращает дату с учетом русской локали для карточек заказа.

export const formatDisplayDate = (dateString: string) => {
	const date = new Date(dateString)
	return date.toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long',
	})
}
