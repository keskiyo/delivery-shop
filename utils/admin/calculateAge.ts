/**
 * Вычисляет возраст пользователя на основе даты рождения
 * 
 * Учитывает, прошел ли день рождения в текущем году
 * Используется в админ-панели для отображения возраста пользователей
 * 
 * @param birthday - Дата рождения в формате ISO строки
 * @returns Возраст в годах (0 если дата не указана)
 * 
 * @example
 * // Сегодня: 16 апреля 2026
 * calculateAge('1990-05-15T00:00:00.000Z') // 35 (день рождения еще не прошел)
 * calculateAge('1990-03-15T00:00:00.000Z') // 36 (день рождения уже прошел)
 * calculateAge('')                          // 0
 */
export const calculateAge = (birthday: string): number => {
	if (!birthday) return 0

	const birthDate = new Date(birthday)
	const today = new Date()
	let age = today.getFullYear() - birthDate.getFullYear()
	const monthDiff = today.getMonth() - birthDate.getMonth()

	if (
		monthDiff < 0 ||
		(monthDiff === 0 && today.getDate() < birthDate.getDate())
	) {
		age--
	}

	return age
}
