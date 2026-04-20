/**
 * Форматирует дату рождения в короткий формат (день.месяц)
 * 
 * Используется в админ-панели для отображения дней рождения пользователей
 * Показывает только день и месяц без года
 * 
 * @param birthdayDate - Дата рождения в формате ISO строки
 * @returns Отформатированная дата в формате "дд.мм"
 * 
 * @example
 * formatBirthday('1990-05-15T00:00:00.000Z') // "15.05"
 * formatBirthday('2000-01-01T00:00:00.000Z') // "01.01"
 */
export const formatBirthday = (birthdayDate: string): string => {
	const date = new Date(birthdayDate)
	const day = date.getDate().toString().padStart(2, '0')
	const month = (date.getMonth() + 1).toString().padStart(2, '0')
	return `${day}.${month}`
}
