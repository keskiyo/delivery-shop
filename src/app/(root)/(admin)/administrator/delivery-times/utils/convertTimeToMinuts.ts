// Назначение: перевод времени HH:mm в минуты.
// Как работает: Используется для сортировки и проверки пересечений слотов доставки.

export const convertTimeToMinutes = (time: string): number => {
	const [hours, minutes] = time.split(':').map(Number)
	return hours * 60 + minutes
}
