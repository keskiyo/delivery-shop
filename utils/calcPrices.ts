// Назначение: утилита calcPrices.
// Как работает: Содержит переиспользуемую бизнес-логику, форматирование, расчеты или подготовку данных.

export const calculateFinalPrice = (
	price: number,
	discount: number,
): number => {
	return discount > 0 ? price * (1 - discount / 100) : price
}

export const calculatePriceByCard = (
	price: number,
	discount: number,
): number => {
	return calculateFinalPrice(price, discount)
}
