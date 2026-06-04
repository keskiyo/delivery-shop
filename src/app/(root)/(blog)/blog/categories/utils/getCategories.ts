// Назначение: утилита getCategories.
// Как работает: Содержит переиспользуемую бизнес-логику, форматирование, расчеты или подготовку данных.

import { BlogCategory } from '../types/categories.types'

export async function getCategories(): Promise<BlogCategory[]> {
	try {
		// 1. Получаем опубликованные категории блога через публичный API.
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/categories`,
			{
				cache: 'force-cache',
				next: {
					tags: ['categories'],
					revalidate: 3600,
				},
			},
		)

		// 2. Если API недоступен, возвращаем пустой список, чтобы страница могла отрисовать empty state.
		if (!response.ok) {
			console.error('Ошибка HTTP:', response.status)
			return []
		}

		const data = await response.json()

		// 3. API возвращает данные в поле data только при success=true.
		if (data.success) {
			return data.data
		}

		// 4. Ошибки данных логируем на сервере, но не ломаем публичную страницу блога.
		console.error('Ошибка данных:', data.message)
		return []
	} catch (error) {
		console.error('Ошибка получения категорий:', error)
		return []
	}
}
