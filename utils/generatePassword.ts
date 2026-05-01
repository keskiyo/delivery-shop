/**
 * Генерирует случайный пароль, соответствующий требованиям валидации
 * 
 * Требования к паролю:
 * - Минимум 6 символов
 * - Хотя бы одна строчная буква (a-z)
 * - Хотя бы одна заглавная буква (A-Z)
 * - Хотя бы одна цифра (0-9)
 * 
 * @param length - Длина генерируемого пароля (по умолчанию 8)
 * @returns Сгенерированный пароль
 * 
 * @example
 * generatePassword()     // 'Abc123xy'
 * generatePassword(10)   // 'Abc123xyZw'
 */
export const generatePassword = (length: number = 8): string => {
	const lowercase = 'abcdefghijklmnopqrstuvwxyz'
	const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	const digits = '0123456789'
	const allChars = lowercase + uppercase + digits

	// Гарантируем наличие хотя бы одного символа каждого типа
	const passwordChars: string[] = [
		lowercase[Math.floor(Math.random() * lowercase.length)],
		uppercase[Math.floor(Math.random() * uppercase.length)],
		digits[Math.floor(Math.random() * digits.length)],
	]

	// Заполняем оставшиеся позиции случайными символами
	for (let i = passwordChars.length; i < length; i++) {
		passwordChars.push(allChars[Math.floor(Math.random() * allChars.length)])
	}

	// Перемешиваем массив для случайного порядка символов
	for (let i = passwordChars.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]]
	}

	return passwordChars.join('')
}
