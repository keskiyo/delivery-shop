// Назначение: утилита getWordEnding.
// Как работает: Содержит переиспользуемую бизнес-логику, форматирование, расчеты или подготовку данных.

export function getWordEnding(count: number): string {
	if (count % 10 === 1 && count % 100 !== 11) {
		return ''
	} else if (
		[2, 3, 4].includes(count % 10) &&
		![12, 13, 14].includes(count % 100)
	) {
		return 'а'
	} else {
		return 'ов'
	}
}
