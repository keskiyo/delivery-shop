/**
 * Форматирует вес товара для отображения
 * 
 * Логика:
 * - Если вес < 1 кг: показывает в граммах (например, "500 г")
 * - Если вес >= 1 кг: показывает в килограммах (например, "1,5 кг")
 * - Убирает лишние нули после запятой
 * 
 * @param weight - Вес в килограммах
 * @returns Отформатированная строка с весом
 * 
 * @example
 * formatWeight(0.5)   // "500 г"
 * formatWeight(0.250) // "250 г"
 * formatWeight(1)     // "1 кг"
 * formatWeight(1.5)   // "1,5 кг"
 * formatWeight(2.00)  // "2 кг"
 */
export const formatWeight = (weight: number): string => {
	if (weight < 1) {
		const grams = weight * 1000
		const formattedGrams =
			grams % 1 === 0
				? grams.toString()
				: grams.toFixed(1).replace(/\.0$/, '')
		return `${formattedGrams} г`
	} else {
		const formattedKg =
			weight % 1 === 0
				? weight.toString()
				: weight.toFixed(2).replace(/\.00$/, '')
		return `${formattedKg} кг`
	}
}
