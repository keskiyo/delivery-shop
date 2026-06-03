// Назначение: короткий читаемый id из Mongo ObjectId.
// Как работает: Берет последние hex-символы и переводит их в десятичное число.

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
