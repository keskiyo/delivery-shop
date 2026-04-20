/**
 * Перемешивает элементы массива в случайном порядке
 * 
 * Создает копию массива и сортирует элементы случайным образом
 * Используется для отображения товаров/статей в случайном порядке
 * 
 * @param array - Массив для перемешивания
 * @returns Новый массив с перемешанными элементами
 * 
 * @example
 * const products = [1, 2, 3, 4, 5]
 * const shuffled = shuffleArray(products) // [3, 1, 5, 2, 4]
 * 
 * // Безопасно обрабатывает невалидные входные данные
 * shuffleArray(null) // []
 * shuffleArray('not array') // []
 */
export const shuffleArray = <T>(array: T[]): T[] => {
	if (!Array.isArray(array)) {
		if (typeof window !== 'undefined' && console && console.error) {
			console.error('shuffleArray: Ожидается массив, но получено:', array)
		}
		return []
	}

	return [...array].sort(() => Math.random() - 0.5)
}
