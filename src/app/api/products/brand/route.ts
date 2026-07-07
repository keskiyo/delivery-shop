import { getDB } from '@/lib/api-routes'
import { ProductCardProps } from '@/types/product'
import { NextRequest, NextResponse } from 'next/server'
import { CONFIG } from '../../../../../config/config'

/**
 * @swagger
 * /api/products/brand:
 *   get:
 *     tags: [Products]
 *     summary: Рекомендованные товары («с этим товаром покупают»)
 *     description: >
 *       Случайная подборка товаров в наличии, без дублей по названию, с исключением
 *       текущего товара и его копий. Параметр brand опционален и лишь приподнимает
 *       товары того же бренда в начале выборки.
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema: { type: integer }
 *         description: Текущий товар (исключается вместе с товарами того же названия)
 *       - in: query
 *         name: brand
 *         schema: { type: string }
 *         description: Необязательно; товары этого бренда идут первыми
 *     responses:
 *       200:
 *         description: sameBrandProducts (уникальные по названию)
 *       500:
 *         description: Ошибка сервера
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const brand = searchParams.get('brand')
		const productId = searchParams.get('productId')
		const limit = CONFIG.ITEMS_PER_PAGE_MAIN_PRODUCTS
		const currentId = productId ? parseInt(productId) : null

		const db = await getDB()
		const collection = db.collection<ProductCardProps>('products')

		const current =
			currentId !== null
				? await collection.findOne(
						{ id: currentId },
						{ projection: { title: 1 } },
					)
				: null

		const currentTitleKey = (current?.title || '').trim().toLowerCase()

		// Берём широкую случайную выборку, потом дедупим по названию в JS.
		const pool = await collection
			.aggregate<ProductCardProps>([
				{
					$match: {
						quantity: { $gt: 0 },
						...(currentId !== null ? { id: { $ne: currentId } } : {}),
					},
				},
				{ $sample: { size: Math.max(limit * 8, 40) } },
			])
			.toArray()

		// Если указан бренд — товары этого бренда идут первыми (но не обязательны).
		const decodedBrand = brand ? decodeURIComponent(brand) : ''
		if (decodedBrand) {
			pool.sort((a, b) => {
				const aBrand = a.brand === decodedBrand ? 0 : 1
				const bBrand = b.brand === decodedBrand ? 0 : 1
				return aBrand - bBrand
			})
		}

		const seenTitles = new Set<string>()
		const sameBrandProducts: ProductCardProps[] = []

		for (const product of pool) {
			const key = (product.title || '').trim().toLowerCase()
			if (!key || key === currentTitleKey || seenTitles.has(key)) continue

			seenTitles.add(key)
			sameBrandProducts.push(product)
			if (sameBrandProducts.length >= limit) break
		}

		return NextResponse.json({ sameBrandProducts })
	} catch (error) {
		console.error('Ошибка получения рекомендованных товаров:', error)
		return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
	}
}
