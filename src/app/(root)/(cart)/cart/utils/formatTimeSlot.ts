// Назначение: утилита formatTimeSlot.
// Как работает: Содержит переиспользуемую бизнес-логику, форматирование, расчеты или подготовку данных.

export const formatTimeSlot = (
	timeSlot: string,
): { mobileLabel: string; desktopLabel: string } => {
	const [start, end] = timeSlot.split('-')

	const mobileStart = start
		.replace(/^0(\d):00$/, '$1')
		.replace(/^(\d+):00$/, '$1')
	const mobileEnd = end
		.replace(/^0(\d):00$/, '$1')
		.replace(/^(\d+):00$/, '$1')
	const mobileLabel = `${mobileStart}-${mobileEnd}`

	// На десктопе оставляем полный формат времени, но меняем двоеточие на точку по дизайну.
	const desktopStart = start.replace(':', '.')
	const desktopEnd = end.replace(':', '.')
	const desktopLabel = `${desktopStart} - ${desktopEnd}`

	return { mobileLabel, desktopLabel }
}
