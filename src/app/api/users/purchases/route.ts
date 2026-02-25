import { getDB } from '@/lib/api-routes'
import { NextResponse } from 'next/server'
import { CONFIG } from '../../../../../config/config'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
	try {
		const db = await getDB()

		const url = new URL(request.url)
		const usersPurchasesLimit = url.searchParams.get('usersPurchasesLimit')
		const startIdx = parseInt(url.searchParams.get('startIdx') || '0')
		const perPage = parseInt(
			url.searchParams.get('perPage') || CONFIG.ITEMS_PER_PAGE.toString(),
		)

		const user = await db.collection('users').findOne({})

		if (!user?.purchases?.length) {
			return NextResponse.json({ products: [], totalCount: 0 })
		}

		const productsIds = user.purchases.map((p: { id: number }) => p.id)

		if (usersPurchasesLimit) {
			const limit = parseInt(usersPurchasesLimit)
			const purchases = await db
				.collection('products')
				.find({
					id: { $in: productsIds },
				})
				.limit(limit)
				.toArray()
			return NextResponse.json(
				purchases.map(product => {
					const { discountPercent, ...rest } = product
					void discountPercent
					return rest
				}),
			)
		}

		const totalCount = productsIds.length

		const purchases = await db
			.collection('products')
			.find({
				id: { $in: productsIds },
			})
			.sort({ _id: -1 })
			.limit(perPage)
			.skip(startIdx)
			.toArray()

		return NextResponse.json({
			products: purchases.map(product => {
				const { discountPercent, ...rest } = product
				void discountPercent
				return rest
			}),
			totalCount,
		})
	} catch (error) {
		console.error('Ошибка api users purchases', error)
		return NextResponse.error()
	}
}
