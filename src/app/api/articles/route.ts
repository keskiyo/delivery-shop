


import { getDB } from '@/lib/api-routes'
import { NextResponse } from 'next/server'
import { CONFIG } from '../../../../config/config'
export const dynamic = 'force-dynamic'
export const revalidate = 3600

/**
 * @swagger
 * /api/articles:
 *   get:
 *     tags: [Articles]
 *     summary: Статьи (лимит или пагинация)
 *     parameters:
 *       - in: query
 *         name: articlesLimit
 *         schema: { type: integer }
 *         description: Если задан — вернуть N последних статей массивом
 *       - in: query
 *         name: startIdx
 *         schema: { type: integer, default: 0 }
 *       - in: query
 *         name: perPage
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Массив статей или '{ articles, totalCount }'
 *       500:
 *         description: Ошибка сервера
 */
export async function GET(request: Request) {
	try {
		const db = await getDB()
		const url = new URL(request.url)

		const articlesLimit = url.searchParams.get('articlesLimit')
		const startIdx = parseInt(url.searchParams.get('startIdx') || '0')
		const perPage = parseInt(
			url.searchParams.get('perPage') ||
				CONFIG.ITEMS_PER_PAGE_MAIN_ARTICLES.toString(),
		)

		if (articlesLimit) {
			const limit = parseInt(articlesLimit)

			const articles = await db
				.collection('articles')
				.find()
				.sort({ createdAt: -1 })
				.limit(limit)
				.toArray()

			return NextResponse.json(articles)
		}

		const totalCount = await db.collection('articles').countDocuments()

		const articles = await db
			.collection('articles')
			.find()
			.sort({ createdAt: 1 })
			.skip(startIdx)
			.limit(perPage)
			.toArray()

		return NextResponse.json({ articles, totalCount })
	} catch (error) {
		console.error('Ошибка api articles', error)
		return NextResponse.error()
	}
}
