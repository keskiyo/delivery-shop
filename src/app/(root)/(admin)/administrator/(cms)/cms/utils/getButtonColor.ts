// Назначение: утилита getButtonColor.
// Как работает: Содержит переиспользуемую бизнес-логику, форматирование, расчеты или подготовку данных.

export const getButtonColor = (color: string): string => {
	const colors: Record<string, string> = {
		blue: 'bg-brand',
		green: 'bg-success',
		purple: 'bg-promo',
		indigo: 'bg-brand',
		orange: 'bg-warning',
	}
	return colors[color] || 'bg-brand'
}
