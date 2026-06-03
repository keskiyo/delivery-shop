// Назначение: цвет текста CMS-элемента.
// Как работает: Мапит ключ темы на CSS-класс текста.

export const getTextColor = (color: string): string => {
	const colors: Record<string, string> = {
		blue: 'text-brand',
		green: 'text-success',
		purple: 'text-promo',
		indigo: 'text-brand',
		orange: 'text-warning',
	}
	return colors[color] || 'text-text-soft'
}
