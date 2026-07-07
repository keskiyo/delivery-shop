


import { getDB } from '@/lib/api-routes'
import { NextRequest, NextResponse } from 'next/server'

/**
 * @swagger
 * /api/search-products:
 *   get:
 *     tags: [Search]
 *     summary: Поиск товаров для админки (по title/article/description)
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema: { type: string, minLength: 3 }
 *     responses:
 *       200:
 *         description: success + products
 *       400:
 *         description: Запрос короче 3 символов
 *       500:
 *         description: Ошибка сервера
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const query = searchParams.get('query')

		if (!query || query.trim().length < 3) {
			return NextResponse.json(
				{
					error: 'Поисковый запрос должен содержать минимум 3 символа',
				},
				{ status: 400 },
			)
		}

		const db = await getDB()

		const searchRegex = new RegExp(query.trim(), 'i')

		const products = await db
			.collection('products')
			.find({
				$or: [
					{ title: { $regex: searchRegex } },
					{ article: { $regex: searchRegex } },
					{ description: { $regex: searchRegex } },
				],
			})
			.project({
				id: 1,
				title: 1,
				article: 1,
				basePrice: 1,
				quantity: 1,
				categories: 1,
			})
			.sort({ title: 1 })
			.toArray()

		return NextResponse.json({
			success: true,
			products,
		})
	} catch (error) {
		console.error('Ошибка при поиске продуктов:', error)
		return NextResponse.json(
			{ error: 'Ошибка сервера при поиске продуктов' },
			{ status: 500 },
		)
	}
}
