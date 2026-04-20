/**
 * Валидирует дату рождения пользователя
 * 
 * Проверки:
 * - Формат даты: дд.мм.гггг (10 символов)
 * - Корректность даты (существует ли такая дата)
 * - Дата не раньше 1900 года
 * - Дата не в будущем
 * - Возраст не менее 14 лет
 * 
 * @param dateStr - Дата в формате "дд.мм.гггг"
 * @returns Объект с флагом валидности и текстом ошибки (если есть)
 * 
 * @example
 * validateBirthDate('15.05.1990') // { isValid: true }
 * validateBirthDate('32.13.2000') // { isValid: false, error: 'Некорректная дата' }
 * validateBirthDate('15.05.2020') // { isValid: false, error: 'Вам должно быть не меньше 14 лет' }
 * validateBirthDate('15.05')      // { isValid: false, error: 'Введите полную дату в формате дд.мм.гггг' }
 */
export function validateBirthDate(dateStr: string): {
	isValid: boolean
	error?: string
} {
	if (!dateStr || dateStr.length < 10) {
		return {
			isValid: false,
			error: 'Введите полную дату в формате дд.мм.гггг',
		}
	}

	const [day, month, year] = dateStr.split('.').map(Number)

	const date = new Date(year, month - 1, day)

	const today = new Date()

	const minDate = new Date(1900, 0, 1)

	const maxDate = new Date()
	maxDate.setFullYear(maxDate.getFullYear() - 14)

	if (
		date.getDate() !== day ||
		date.getMonth() !== month - 1 ||
		date.getFullYear() !== year
	) {
		return { isValid: false, error: 'Некорректная дата' }
	}

	if (date < minDate) {
		return { isValid: false, error: 'Дата не может быть раньше 1900 года' }
	}

	if (date > today) {
		return { isValid: false, error: 'Дата не может быть в будущем' }
	}

	if (date > maxDate) {
		return { isValid: false, error: 'Вам должно быть не меньше 14 лет' }
	}

	return { isValid: true }
}
