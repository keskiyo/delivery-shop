import { ProductCardProps } from '@/types/product'
import { NextResponse } from 'next/server'
import { getDB } from '../../../lib/api-routes'

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
			.project({
				id: 1,
				title: 1,
				categories: 1,
				description: 1,
				_id: 1,
				img: 1,
				basePrice: 1,
				discountPercent: 1,
				rating: 1,
				weight: 1,
				quantity: 1,
				tags: 1,
			})
			.toArray()) as ProductCardProps[]

		return NextResponse.json(products)
	} catch (error) {
		console.error('Ошибка поиска продуктов', error)
		return NextResponse.json(
			{ error: 'Ошибка поиска продуктов' },
			{ status: 500 },
		)
	}
}
