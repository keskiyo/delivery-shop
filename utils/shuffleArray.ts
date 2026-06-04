// Назначение: утилита shuffleArray.
// Как работает: Содержит переиспользуемую бизнес-логику, форматирование, расчеты или подготовку данных.

export const shuffleArray = <T>(array: T[]): T[] => {
	if (!Array.isArray(array)) {
		if (typeof window !== 'undefined' && console && console.error) {
			console.error('shuffleArray: Ожидается массив, но получено:', array)
		}
		return []
	}

	return [...array].sort(() => Math.random() - 0.5)
}
