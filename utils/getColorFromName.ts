// Назначение: утилита getColorFromName.
// Как работает: Содержит переиспользуемую бизнес-логику, форматирование, расчеты или подготовку данных.

export function getColorFromName(name?: string | null) {
	const colors = [
		'from-blue-500 to-cyan-500',
		'from-purple-500 to-pink-500',
		'from-green-500 to-emerald-500',
		'from-orange-500 to-red-500',
		'from-indigo-500 to-blue-500',
		'from-teal-500 to-green-500',
		'from-rose-500 to-pink-500',
		'from-amber-500 to-orange-500',
	]

	const safeName = name?.trim() || 'default'

	const hash = safeName.split('').reduce((acc, char) => {
		return char.charCodeAt(0) + ((acc << 5) - acc)
	}, 0)

	return colors[Math.abs(hash) % colors.length]
}
