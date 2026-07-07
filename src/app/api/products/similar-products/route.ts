


import { getDB } from '@/lib/api-routes'
import { ProductCardProps } from '@/types/product'
import { NextRequest, NextResponse } from 'next/server'

/**
 * @swagger
 * /api/products/similar-products:
 *   get:
 *     tags: [Products]
 *     summary: Похожие товары из той же категории
 *     parameters:
 *       - in: query
 *         name: productId
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: category
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 4 }
 *     responses:
 *       200:
 *         description: similarProducts
 *       400:
 *         description: productId и category обязательны
 *       500:
 *         description: Ошибка сервера
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const productId = searchParams.get('productId')
		const category = searchParams.get('category')
		const limit = parseInt(searchParams.get('limit') || '4')

		if (!productId || !category) {
			return NextResponse.json(
				{ error: 'ID продукта и категория обязательны' },
				{ status: 400 },
			)
		}

		const db = await getDB()

		const similarProducts = await db
			.collection<ProductCardProps>('products')
			.aggregate([
				{
					$match: {
						categories: { $in: [category] },
						id: { $ne: parseInt(productId) },
					},
				},
				{ $sample: { size: limit } },
			])
			.toArray()

		return NextResponse.json({ similarProducts })
	} catch (error) {
		console.error('Ошибка получения похожих продуктов:', error)
		return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
	}
}
