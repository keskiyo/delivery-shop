// Назначение: утилита getSitemapData.
// Как работает: Содержит переиспользуемую бизнес-логику, форматирование, расчеты или подготовку данных.

import { SitemapDataResponse } from '@/types/sitemap'
import { baseUrl } from './baseUrl'

const EMPTY_SITEMAP_DATA: SitemapDataResponse = {
	categories: [],
	products: [],
	articleCategories: [],
	articles: [],
}

export async function getSitemapData(): Promise<SitemapDataResponse> {
	try {
		// 1. Получаем агрегированные данные через внутренний API, чтобы sitemap не дублировал MongoDB-запросы.
		const res = await fetch(`${baseUrl}/api/sitemap-data`)

		if (!res.ok) {
			console.error(
				`Не удалось получить данные для карты сайта: ${res.status}`,
			)
			return EMPTY_SITEMAP_DATA
		}

		const data = await res.json()

		// 2. Приводим каждую секцию к массиву, чтобы генерация sitemap не падала на неполном ответе API.
		return {
			categories: Array.isArray(data.categories) ? data.categories : [],
			products: Array.isArray(data.products) ? data.products : [],
			articleCategories: Array.isArray(data.articleCategories)
				? data.articleCategories
				: [],
			articles: Array.isArray(data.articles) ? data.articles : [],
		}
	} catch (error) {
		// 3. При ошибке сети оставляем sitemap со статическими страницами вместо падения build.
		console.error('Ошибка при получении данных для карты сайта:', error)
		return EMPTY_SITEMAP_DATA
	}
}
