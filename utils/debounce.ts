/**
 * Создает debounced версию функции
 * 
 * Откладывает выполнение функции до тех пор, пока не пройдет указанное время
 * с момента последнего вызова. Используется для оптимизации частых событий
 * (например, ввод в поле поиска, изменение размера окна)
 * 
 * @param fn - Функция для debounce
 * @param delay - Задержка в миллисекундах
 * @returns Debounced версия функции
 * 
 * @example
 * const handleSearch = debounce((query: string) => {
 *   console.log('Searching for:', query)
 * }, 300)
 * 
 * // При быстром вводе "hello" функция вызовется только один раз через 300ms
 * handleSearch('h')
 * handleSearch('he')
 * handleSearch('hel')
 * handleSearch('hell')
 * handleSearch('hello') // Только этот вызов выполнится
 */
export function debounce<F extends (...args: unknown[]) => unknown>(
	fn: F,
	delay: number,
): (...args: Parameters<F>) => void {
	let timeoutId: number
	return function (...args: Parameters<F>) {
		window.clearTimeout(timeoutId)
		timeoutId = window.setTimeout(() => fn(...args), delay)
	}
}
