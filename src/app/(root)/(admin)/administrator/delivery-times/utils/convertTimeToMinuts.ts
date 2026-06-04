// Назначение: утилита convertTimeToMinuts.
// Как работает: Содержит переиспользуемую бизнес-логику, форматирование, расчеты или подготовку данных.

export const convertTimeToMinutes = (time: string): number => {
	const [hours, minutes] = time.split(':').map(Number)
	return hours * 60 + minutes
}
