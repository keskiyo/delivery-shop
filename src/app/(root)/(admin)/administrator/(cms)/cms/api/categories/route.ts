// Назначение: API-маршрут categories.
// Как работает: Методы: GET, POST. Валидирует входные данные, обращается к нужным сервисам и возвращает JSON-ответ.

import {
	Category,
	FilterType,
	SortField,
} from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/types'
import { buildFilterQuery } from '@/app/(root)/(admin)/administrator/(cms)/cms/utils/buildFilterQuery'
import { buildSortObject } from '@/app/(root)/(admin)/administrator/(cms)/cms/utils/buildSortObject'
import { getDB } from '@/lib/api-routes'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'
import {
	getOptionalString,
	getRequiredString,
	getStringArray,
	isRecord,
} from '../../../../../../../../../utils/apiValidation'

export async function GET(request: Request) {
	try {
		const db = await getDB()

		const { searchParams } = new URL(request.url)
		const page = parseInt(searchParams.get('pageToLoad') || '1')
		const limit = parseInt(searchParams.get('limit')!)
		const sortBy: SortField = (searchParams.get('sortBy') ||
			'numericId') as SortField
		const sortOrder = searchParams.get('sortOrder') || 'desc'
		const search = searchParams.get('search') || ''
		const filterBy: FilterType = (searchParams.get('filterBy') ||
			'all') as FilterType

		const validPage = Math.max(1, page)
		const validLimit = Math.max(1, Math.min(limit, 100))
		const skip = (validPage - 1) * validLimit

		const sortObject = buildSortObject(sortBy, sortOrder)
		const filterQuery = buildFilterQuery(search, filterBy)

		const categories = await db
			.collection<Category>('article-category')
			.find(filterQuery)
			.sort(sortObject)
			.skip(skip)
			.limit(validLimit)
			.toArray()

		const totalInDB = await db
			.collection<Category>('article-category')
			.countDocuments({})

		const totalFiltered = await db
			.collection<Category>('article-category')
			.countDocuments(filterQuery)

		const totalPages = Math.ceil(totalFiltered / validLimit)

		const response = {
			success: true,
			data: {
				categories: categories.map(category => ({
					...category,
					_id: category._id.toString(),
				})),
				totalInDB,
				pagination: {
					page: validPage,
					limit: validLimit,
					total: totalFiltered,
					totalAll: totalInDB,
					totalPages,
				},
			},
		}

		return NextResponse.json(response)
	} catch (error) {
		console.error('Ошибка загрузки категорий:', error)
		return NextResponse.json(
			{ success: false, message: 'Ошибка загрузки категорий' },
			{ status: 500 },
		)
	}
}

export async function POST(request: Request) {
	try {
		const data: unknown = await request.json()

		if (!isRecord(data)) {
			return NextResponse.json(
				{ success: false, message: 'Некорректные данные категории' },
				{ status: 400 },
			)
		}

		const nameResult = getRequiredString(
			data,
			'name',
			'Название категории обязательно',
		)
		if (!nameResult.ok) {
			return NextResponse.json(
				{ success: false, message: nameResult.message },
				{ status: 400 },
			)
		}

		const slugResult = getRequiredString(
			data,
			'slug',
			'Алиас (slug) категории обязателен',
		)
		if (!slugResult.ok) {
			return NextResponse.json(
				{ success: false, message: slugResult.message },
				{ status: 400 },
			)
		}

		const name = nameResult.value
		const slug = slugResult.value.toLowerCase()

		const db = await getDB()

		const existingCategory = await db
			.collection<Category>('article-category')
			.findOne({ slug })

		if (existingCategory) {
			return NextResponse.json(
				{
					success: false,
					message: 'Категория с таким алиасом уже существует',
				},
				{ status: 400 },
			)
		}

		const result = await db
			.collection('article-category')
			.aggregate([
				{
					$group: {
						_id: null,
						maxNumericId: { $max: '$numericId' },
					},
				},
			])
			.toArray()

		let maxNumericId = 0
		if (
			result.length > 0 &&
			result[0].maxNumericId !== null &&
			result[0].maxNumericId !== undefined
		) {
			maxNumericId = result[0].maxNumericId
		}

		const newNumericId = maxNumericId + 1

		const newCategory = {
			_id: new ObjectId(),
			numericId: newNumericId,
			name,
			slug,
			description: getOptionalString(data, 'description'),
			keywords: getStringArray(data.keywords),
			image: getOptionalString(data, 'image'),
			imageAlt: getOptionalString(data, 'imageAlt', name),
			author: getOptionalString(data, 'author', 'Неизвестен'),
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		}

		await db.collection('article-category').insertOne(newCategory)

		const responseCategory: Category = {
			...newCategory,
			_id: newCategory._id.toString(),
		}

		return NextResponse.json({
			success: true,
			message: 'Категория создана',
			data: responseCategory,
		})
	} catch (error) {
		console.error('Ошибка создания категории:', error)
		return NextResponse.json(
			{
				success: false,
				message: 'Ошибка создания категории',
				error:
					error instanceof Error
						? error.message
						: 'Неизвестная ошибка',
			},
			{ status: 500 },
		)
	}
}
