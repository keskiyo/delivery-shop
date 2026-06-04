// Назначение: утилита formatPrice.
// Как работает: Содержит переиспользуемую бизнес-логику, форматирование, расчеты или подготовку данных.

export const formatPrice = (price: number): string => {
	return price.toFixed(2).replace('.', ',')
}
