// Назначение: утилита fetchArticle.
// Как работает: Содержит переиспользуемую бизнес-логику, форматирование, расчеты или подготовку данных.

import { getUserById } from '../../../../../../../utils/auth-helpers'
import { baseUrl } from '../../../../../../../utils/baseUrl'
import { getServerUserId } from '../../../../../../../utils/getServerUserId'
import { ArticlePageData } from '../../types'

// Загружает статью с учетом роли текущего пользователя.
export async function fetchArticlePageData(
	categorySlug: string,
	articleSlug: string,
): Promise<ArticlePageData | { error: string }> {
	// 1. Определяем текущего пользователя, чтобы API понял уровень доступа к статье.
	const currentUserId = await getServerUserId()
	let currentUserData = null

	if (currentUserId) {
		try {
			currentUserData = await getUserById(currentUserId)
		} catch (error) {
			console.error('Не удалось получить данные пользователя', error)
		}
	}

	const currentUserRole = currentUserData?.role || 'user'

	try {
		// 2. Загружаем статью и передаем роль query-параметром для серверной проверки доступа.
		const response = await fetch(
			`${baseUrl}/api/blog/category/${categorySlug}/${articleSlug}?role=${currentUserRole}`,
			{
				next: { revalidate: 3600 },
			},
		)

		if (!response.ok) {
			// 3. API может вернуть человекочитаемую ошибку, сохраняем ее для страницы.
			const errorData = await response.json().catch(() => ({}))

			if (response.status === 404) {
				return { error: errorData.error || 'Не найдено' }
			}

			return { error: errorData.error || `Ошибка ${response.status}` }
		}

		// 4. Возвращаем данные статьи и категории для страницы /blog/[category]/[slug].
		const data: ArticlePageData = await response.json()
		return data
	} catch (error) {
		console.error('Ошибка при запросе статьи:', error)
		return { error: 'Ошибка сети' }
	}
}
