import { baseUrl } from '../../../../../../../utils/baseUrl'
import { ApiError, CategoryPageResponse } from '../../types'

// Загружает данные страницы категории: саму категорию, список статей и данные пагинации.
export async function fetchCategoryPageData(
	categorySlug: string,
	page: number = 1,
	itemsPerPage: number = 3,
): Promise<CategoryPageResponse | ApiError> {
	try {
		// Серверный fetch кешируется Next.js на час, чтобы страница категории не дергала API при каждом запросе.
		const response = await fetch(
			`${baseUrl}/api/blog/${encodeURIComponent(categorySlug)}?page=${page}&itemsPerPage=${itemsPerPage}`,
			{
				next: {
					revalidate: 3600,
				},
			},
		)

		if (!response.ok) {
			// UI ожидает объект с error, поэтому не бросаем исключение для известных ошибок API.
			if (response.status === 404) {
				return { error: 'Категория не найдена' }
			}
			return { error: 'Ошибка сервера' }
		}

		return await response.json()
	} catch (error) {
		console.error('Ошибка при запросе категории:', error)
		return { error: 'Ошибка сети' }
	}
}
