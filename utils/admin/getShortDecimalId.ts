/**
 * Преобразует MongoDB ObjectId в короткий числовой ID
 * 
 * Берет последние 4 символа hex-строки ObjectId и конвертирует в десятичное число
 * Используется в админ-панели для отображения коротких ID пользователей
 * 
 * @param id - MongoDB ObjectId (hex-строка)
 * @returns Короткий числовой ID (строка)
 * 
 * @example
 * getShortDecimalId('507f1f77bcf86cd799439011') // "36881" (0x9011 в десятичной)
 * getShortDecimalId('abc')                      // "abc" (если ID короче 4 символов)
 */
export const getShortDecimalId = (id: string): string => {
	if (id.length < 4) return id
	try {
		const last4Hex = id.slice(-4)
		const decimal = parseInt(last4Hex, 16)
		return decimal.toString()
	} catch {
		return id.slice(-4)
	}
}
