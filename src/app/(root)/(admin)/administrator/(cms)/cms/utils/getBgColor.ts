// Назначение: утилита getBgColor.
// Как работает: Содержит переиспользуемую бизнес-логику, форматирование, расчеты или подготовку данных.

export const getBgColor = (color: string): string => {
	const colors: Record<string, string> = {
		blue: 'bg-brand-soft',
		green: 'bg-success-soft',
		purple: 'bg-promo-soft',
		indigo: 'bg-brand-soft',
		orange: 'bg-warning-soft',
	}
	return colors[color] || 'bg-surface-hover'
}
