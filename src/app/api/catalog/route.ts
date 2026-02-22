import { getDB } from '@/lib/api-routes'
import { CatalogProps } from '@/types/catalog'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'
export const revalidate = 3600

export async function GET() {
	try {
		const db = await getDB()

		const catalog = await db.collection('catalog').find({}).toArray()

		return NextResponse.json(catalog)
	} catch (error) {
		console.error('Ошибка api catalog', error)
		return NextResponse.json(
			{ message: 'Ошибка при загрузке каталога' },
			{ status: 500 },
		)
	}
}

export async function POST(request: Request) {
	try {
		const db = await getDB()

		const updatedCategories: CatalogProps[] = await request.json()

		const bulkOps = updatedCategories.map(category => ({
			updateOne: {
				filter: { _id: new ObjectId(category._id) },
				update: {
					$set: {
						order: category.order,
						title: category.title,
						img: category.img,
						colSpan: category.colSpan,
						tabletColSpan: category.tabletColSpan,
						mobileColSpan: category.mobileColSpan,
					},
				},
			},
		}))

		const result = await db.collection('catalog').bulkWrite(bulkOps)

		return NextResponse.json(result.modifiedCount)
	} catch (error) {
		console.error('Ошибка обновления категорий', error)
		return NextResponse.json(
			{ message: 'Ошибка обновления категорий' },
			{ status: 500 },
		)
	}
}
