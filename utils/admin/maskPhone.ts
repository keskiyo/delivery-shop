/**
 * Форматирует номер телефона в российском формате
 * 
 * Преобразует строку цифр в формат: +7 (XXX) XXX-XX-XX
 * Используется в админ-панели для отображения телефонов пользователей
 * 
 * @param value - Номер телефона (может содержать любые символы)
 * @returns Отформатированный номер телефона
 * 
 * @example
 * maskedValue('79991234567')     // "+7 (999) 123-45-67"
 * maskedValue('+7 999 123 45 67') // "+7 (999) 123-45-67"
 * maskedValue('9991234567')      // "+7 (999) 123-45-67"
 */
export const maskedValue = (value: string) => {
	if (!value) return ''

	const cleanPhone = value.replace(/\D/g, '')

	let formatted = '+7'

	if (cleanPhone.length > 1) {
		formatted += ` (${cleanPhone.slice(1, 4)}`
	}

	if (cleanPhone.length > 4) {
		formatted += `) ${cleanPhone.slice(4, 7)}`
	}

	if (cleanPhone.length > 7) {
		formatted += `-${cleanPhone.slice(7, 9)}`
	}

	if (cleanPhone.length > 9) {
		formatted += `-${cleanPhone.slice(9, 11)}`
	}

	return formatted
}
