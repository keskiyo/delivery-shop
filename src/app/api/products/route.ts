


import { getDB } from '@/lib/api-routes'
import { NextResponse } from 'next/server'
import { CONFIG } from '../../../../config/config'
export const dynamic = 'force-dynamic'
export const revalidate = 3600

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: Товары по тегу (с пагинацией / случайной выборкой)
 *     parameters:
 *       - in: query
 *         name: tag
 *         required: true
 *         schema: { type: string }
 *         description: Тег товара (например actions, new)
 *       - in: query
 *         name: random
 *         schema: { type: boolean }
 *         description: Случайная выборка вместо пагинации
 *       - in: query
 *         name: startIdx
 *         schema: { type: integer, default: 0 }
 *       - in: query
 *         name: perPage
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Товары и общее число
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Pagination' }
 *       400:
 *         description: Не передан tag
 *       500:
 *         description: Ошибка сервера
 */
export async function GET(request: Request) {
	try {
		const db = await getDB()
		const url = new URL(request.url)

		const tag = url.searchParams.get('tag')
		const random = url.searchParams.get('random') === 'true'
		const startIdx = parseInt(url.searchParams.get('startIdx') || '0')
		const perPage = parseInt(
			url.searchParams.get('perPage') || CONFIG.ITEMS_PER_PAGE.toString(),
		)

		if (!tag) {
			return NextResponse.json(
				{ message: 'Параметр категории не передан' },
				{ status: 400 },
			)
		}

		const query = {
			tags: tag,
			quantity: { $gt: 0 },
		}

		const totalCount = await db.collection('products').countDocuments(query)

		const products = random
			? await db
					.collection('products')
					.aggregate([
						{ $match: query },
						{ $sample: { size: perPage } },
					])
					.toArray()
			: await db
					.collection('products')
					.find(query)
					.sort({ _id: 1 })
					.skip(startIdx)
					.limit(perPage)
					.toArray()

		return NextResponse.json({ products, totalCount })
	} catch (error) {
		console.error('Ошибка api products', error)
		return NextResponse.error()
	}
}
