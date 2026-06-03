// Назначение: значение статистики CMS по ключу.
// Как работает: Изолирует мапинг карточек дашборда от структуры объекта статистики.

export const getStatValue = (
	statTitle: string,
	categoriesCount: string,
	keywordsCount: string,
) => {
	switch (statTitle) {
		case 'Категорий':
			return categoriesCount
		case 'Ключевых слов':
			return keywordsCount
		case 'Опубликовано':
			return '0'
		case 'Просмотров':
			return '0'
		default:
			return '0'
	}
}
