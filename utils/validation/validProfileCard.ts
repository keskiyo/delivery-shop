/**
 * Удаляет все нецифровые символы из номера карты
 * 
 * @param cardNumber - Номер карты (может содержать пробелы, дефисы и т.д.)
 * @returns Строка только с цифрами
 * 
 * @example
 * cleanCardNumber('1234 5678 9012 3456') // "1234567890123456"
 * cleanCardNumber('1234-5678-9012-3456') // "1234567890123456"
 */
export const cleanCardNumber = (cardNumber: string): string => {
	return cardNumber.replace(/\D/g, '')
}

/**
 * Проверяет валидность номера карты лояльности
 * 
 * Требования: ровно 16 цифр
 * 
 * @param cardNumber - Номер карты для проверки
 * @returns true если номер валиден (16 цифр), false если нет
 * 
 * @example
 * isValidCardNumber('1234567890123456')      // true
 * isValidCardNumber('1234 5678 9012 3456')   // true
 * isValidCardNumber('123456789012345')       // false (15 цифр)
 */
export const isValidCardNumber = (cardNumber: string): boolean => {
	const cleaned = cleanCardNumber(cardNumber)
	return /^\d{16}$/.test(cleaned)
}

/**
 * Форматирует номер карты для отображения
 * 
 * Два режима:
 * - Режим просмотра (isEditing=false): показывает только последние 4 цифры (**** **** **** 1234)
 * - Режим редактирования (isEditing=true): показывает все цифры с пробелами (1234 5678 9012 3456)
 * 
 * @param cardNumber - Номер карты
 * @param isEditing - Режим редактирования (по умолчанию false)
 * @returns Отформатированный номер карты
 * 
 * @example
 * formatCardNumber('1234567890123456', false) // "**** **** **** 3456"
 * formatCardNumber('1234567890123456', true)  // "1234 5678 9012 3456"
 * formatCardNumber('1234', true)              // "1234"
 */
export const formatCardNumber = (
	cardNumber: string,
	isEditing: boolean = false,
): string => {
	const cleanValue = cleanCardNumber(cardNumber)

	if (!cleanValue) return ''

	if (!isEditing) {
		// В режиме просмотра показываем только последние 4 цифры
		if (cleanValue.length <= 4) return cleanValue
		return `**** **** **** ${cleanValue.slice(-4)}`
	}

	// В режиме редактирования форматируем с пробелами
	if (cleanValue.length <= 4) return cleanValue
	if (cleanValue.length <= 8)
		return `${cleanValue.slice(0, 4)} ${cleanValue.slice(4)}`
	if (cleanValue.length <= 12)
		return `${cleanValue.slice(0, 4)} ${cleanValue.slice(4, 8)} ${cleanValue.slice(8)}`
	return `${cleanValue.slice(0, 4)} ${cleanValue.slice(4, 8)} ${cleanValue.slice(8, 12)} ${cleanValue.slice(12)}`
}
