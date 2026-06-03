// Назначение: форматирование цены.
// Как работает: Приводит число к строке с двумя знаками и русским десятичным разделителем.

export const formatPrice = (price: number): string => {
	return price.toFixed(2).replace('.', ',')
}
