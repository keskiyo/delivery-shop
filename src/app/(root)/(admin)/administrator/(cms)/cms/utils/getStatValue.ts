// Назначение: утилита getStatValue.
// Как работает: Содержит переиспользуемую бизнес-логику, форматирование, расчеты или подготовку данных.

export const getStatValue = (
	statTitle: string,
	categoriesCount: string,
	keywordsCount: string,
	publishedCount: string,
	viewsCount: string,
) => {
	switch (statTitle) {
		case 'Категорий':
			return categoriesCount
		case 'Ключевых слов':
			return keywordsCount
		case 'Опубликовано':
			return publishedCount
		case 'Просмотров':
			return viewsCount
		default:
			return '0'
	}
}
