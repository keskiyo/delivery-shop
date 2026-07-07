


import { SearchProduct } from '@/types/searchProduct'
import { NextResponse } from 'next/server'
import { getDB } from '../../../lib/api-routes'

/**
 * @swagger
 * /api/search:
 *   get:
 *     tags: [Search]
 *     summary: Поиск товаров, сгруппированных по категориям
 *     parameters:
 *       - in: query
 *         name: query
 *         schema: { type: string }
 *         description: Строка поиска (по title и description)
 *     responses:
 *       200:
 *         description: Массив групп по категориям
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   category: { type: string }
 *                   products:
 *                     type: array
 *                     items: { type: object }
 *       500:
 *         description: Ошибка поиска
 */
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const query = searchParams.get('query') || ''

		const db = await getDB()
		const products = (await db
			.collection('products')
			.find({
				$and: [
					{
						$or: [
							{ title: { $regex: query, $options: 'i' } },
							{ description: { $regex: query, $options: 'i' } },
						],
					},
					{ quantity: { $gt: 0 } },
				],
			})
			.project({ id: 1, title: 1, categories: 1 })
			.toArray()) as SearchProduct[]

		if (!products.length) {
			return NextResponse.json([])
		}

		const groupedByCategory: Record<string, SearchProduct[]> = {}

		for (const product of products) {
			for (const category of product.categories) {
				const normalizedCategory = category.toLowerCase()

				if (!groupedByCategory[normalizedCategory]) {
					groupedByCategory[normalizedCategory] = []
				}
				groupedByCategory[normalizedCategory].push(product)
			}
		}

		const result = Object.entries(groupedByCategory).map(
			([category, products]) => ({
				category,
				products,
			}),
		)

		return NextResponse.json(result)
	} catch (error) {
		console.error('Ошибка поиска продуктов', error)
		return NextResponse.json(
			{ error: 'Ошибка поиска продуктов' },
			{ status: 500 },
		)
	}
}
