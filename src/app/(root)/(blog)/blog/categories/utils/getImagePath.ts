// Назначение: утилита getImagePath.
// Как работает: Содержит переиспользуемую бизнес-логику, форматирование, расчеты или подготовку данных.

export function getImagePath(image: string): string {
	// 1. Пустой путь оставляем пустым, чтобы компонент мог показать fallback.
	if (!image || image.trim() === '') {
		return ''
	}

	let imagePath = image

	// 2. Убираем ведущий slash, чтобы не получить двойной путь при сборке URL.
	if (imagePath.startsWith('/')) {
		imagePath = imagePath.substring(1)
	}

	// 3. Старые записи могут хранить только имя файла, поэтому добавляем папку категорий.
	if (!imagePath.startsWith('blogCategories/')) {
		imagePath = `blogCategories/${imagePath}`
	}

	return `/${imagePath}`
}
