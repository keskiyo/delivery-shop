// Назначение: утилита formatDeliveryDateTime.
// Как работает: Содержит переиспользуемую бизнес-логику, форматирование, расчеты или подготовку данных.

export const formatDeliveryDateTime = (
	dateString: string,
	timeSlot: string,
): string => {
	const date = new Date(dateString)
	const day = date.getDate()
	const month = date.toLocaleDateString('ru-RU', { month: 'long' })
	const year = date.getFullYear()
	const time = timeSlot.split('-')[0]

	return `${day} ${month} ${year} ${time}`
}
