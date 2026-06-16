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
		const res = await fetch(`${baseUrl}/api/sitemap-data`)

		if (!res.ok) {
			console.error(
				`Не удалось получить данные для карты сайта: ${res.status}`,
			)
			return EMPTY_SITEMAP_DATA
		}

		const data = await res.json()

		return {
			categories: Array.isArray(data.categories) ? data.categories : [],
			products: Array.isArray(data.products) ? data.products : [],
			articleCategories: Array.isArray(data.articleCategories)
				? data.articleCategories
				: [],
			articles: Array.isArray(data.articles) ? data.articles : [],
		}
	} catch (error) {
		console.error('Ошибка при получении данных для карты сайта:', error)
		return EMPTY_SITEMAP_DATA
	}
}
