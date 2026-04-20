/**
 * Проверяет, скоро ли у пользователя день рождения (в ближайшие 3 дня)
 * 
 * Используется в админ-панели для выделения пользователей с приближающимся днем рождения
 * Проверяет только день и месяц, игнорируя год
 * 
 * @param birthdayDate - Дата рождения в формате ISO строки
 * @returns true если день рождения в ближайшие 0-3 дня, false в остальных случаях
 * 
 * @example
 * // Сегодня: 16 апреля 2026
 * isBirthdaySoon('1990-04-16T00:00:00.000Z') // true (сегодня)
 * isBirthdaySoon('1990-04-17T00:00:00.000Z') // true (завтра)
 * isBirthdaySoon('1990-04-19T00:00:00.000Z') // true (через 3 дня)
 * isBirthdaySoon('1990-04-20T00:00:00.000Z') // false (через 4 дня)
 * isBirthdaySoon('1990-04-15T00:00:00.000Z') // false (вчера)
 */
export const isBirthdaySoon = (birthdayDate: string): boolean => {
	try {
		const now = new Date()
		const birthday = new Date(birthdayDate)

		// Устанавливаем текущий год для обоих дат
		const currentYearBirthday = new Date(
			now.getFullYear(),
			birthday.getMonth(),
			birthday.getDate(),
		)

		// Считаем разницу в днях (игнорируя год)
		const diffTime = currentYearBirthday.getTime() - now.getTime()
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

		// Проверяем ближайшие 3 дня (0 - сегодня, 1-3 - следующие дни)
		return diffDays <= 3 && diffDays >= 0
	} catch {
		return false
	}
}
