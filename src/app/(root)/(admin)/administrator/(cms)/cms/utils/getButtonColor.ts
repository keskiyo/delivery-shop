// Назначение: цвет кнопки CMS по настройкам.
// Как работает: Мапит ключ темы на CSS-классы кнопки.

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
