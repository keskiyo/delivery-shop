/**
 * Рассчитывает финальную цену с учетом скидки в процентах
 * 
 * @param price - Исходная цена товара
 * @param discount - Процент скидки (например, 15 для 15%)
 * @returns Цена со скидкой. Если скидки нет (0) - возвращает исходную цену
 * 
 * @example
 * calculateFinalPrice(1000, 15) // 850 (скидка 15%)
 * calculateFinalPrice(1000, 0)  // 1000 (без скидки)
 */
export const calculateFinalPrice = (
	price: number,
	discount: number,
): number => {
	return discount > 0 ? price * (1 - discount / 100) : price
}

/**
 * Рассчитывает цену с учетом скидки по карте лояльности
 * Использует ту же логику, что и calculateFinalPrice
 * 
 * @param price - Цена товара (обычно уже со скидкой товара)
 * @param discount - Процент скидки по карте (обычно 6%)
 * @returns Финальная цена с учетом карты лояльности
 * 
 * @example
 * calculatePriceByCard(1000, 6) // 940 (скидка 6% по карте)
 */
export const calculatePriceByCard = (
	price: number,
	discount: number,
): number => {
	return calculateFinalPrice(price, discount)
}
