// Назначение: утилита getRelatedArticles.
// Как работает: Содержит переиспользуемую бизнес-логику, форматирование, расчеты или подготовку данных.

import { getDB } from '@/lib/api-routes'
import { ObjectId } from 'mongodb'
import { CONFIG } from '../../../../../../../config/config'
import { RelatedArticle } from '../../types'

// Возвращает опубликованные статьи из той же категории, исключая текущую статью.
export async function getRelatedArticles(
	categoryId: string | ObjectId,
	excludeSlug: string,
	limit: number = CONFIG.ARTICLES_PER_ARTICLE_PAGE,
): Promise<RelatedArticle[]> {
	try {
		// 1. Подключаемся напрямую к MongoDB, потому что связанные статьи нужны только на сервере.
		const db = await getDB()

		// 2. Берем только поля карточки и исключаем текущую статью из выдачи.
		const articles = await db
			.collection('articles')
			.find(
				{
					categoryId:
						typeof categoryId === 'string'
							? categoryId
							: categoryId.toString(),
					slug: { $ne: excludeSlug },
					status: { $in: ['published'] },
				},
				{
					projection: {
						_id: 1,
						name: 1,
						slug: 1,
						description: 1,
						image: 1,
						imageAlt: 1,
						views: 1,
						publishedAt: 1,
						createdAt: 1,
						author: 1,
						keywords: 1,
					},
				},
			)
			.sort({ publishedAt: -1 })
			.limit(limit)
			.toArray()

		// 3. ObjectId и даты приводим к строкам, чтобы данные были serializable для React-компонентов.
		return articles.map(article => ({
			...article,
			_id: article._id.toString(),
			publishedAt: article.publishedAt as string,
			createdAt: article.createdAt as string,
		})) as RelatedArticle[]
	} catch (error) {
		console.error('Ошибка получения связанных статей:', error)
		return []
	}
}
