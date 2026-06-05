// Назначение: утилита fetchCategory.
// Как работает: Содержит переиспользуемую бизнес-логику, форматирование, расчеты или подготовку данных.

import { baseUrl } from '../../../../../../../utils/baseUrl'
import { ApiError, CategoryPageResponse } from '../../types'

// Загружает данные страницы категории: саму категорию, список статей и данные пагинации.
export async function fetchCategoryPageData(
	categorySlug: string,
	page: number = 1,
	itemsPerPage: number = 3,
): Promise<CategoryPageResponse | ApiError> {
	try {
		// 1. Получаем категорию, статьи и пагинацию одним API-запросом.
		const response = await fetch(
			`${baseUrl}/api/blog/category/${encodeURIComponent(categorySlug)}?page=${page}&itemsPerPage=${itemsPerPage}`,
			{
				next: {
					revalidate: 3600,
				},
			},
		)

		if (!response.ok) {
			// 2. UI ожидает объект с error, поэтому не бросаем исключение для известных ошибок API.
			if (response.status === 404) {
				return { error: 'Категория не найдена' }
			}
			return { error: 'Ошибка сервера' }
		}

		// 3. Возвращаем ответ API как есть: тип данных описан в CategoryPageResponse.
		return await response.json()
	} catch (error) {
		console.error('Ошибка при запросе категории:', error)
		return { error: 'Ошибка сети' }
	}
}
