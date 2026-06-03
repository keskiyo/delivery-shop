// Назначение: подбор окончания слова по числу.
// Как работает: Учитывает русские правила для 1, 2-4 и остальных значений.

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
