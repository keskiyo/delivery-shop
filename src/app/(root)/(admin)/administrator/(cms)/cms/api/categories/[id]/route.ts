// Назначение: API-маршрут categories/[id].
// Как работает: Методы: PUT, DELETE. Валидирует входные данные, обращается к нужным сервисам и возвращает JSON-ответ.

import { getDB } from '@/lib/api-routes'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'
import {
	getOptionalString,
	getRequiredString,
	getStringArray,
	isRecord,
} from '../../../../../../../../../../utils/apiValidation'

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const db = await getDB()
		const { id } = await params

		const rawData: unknown = await request.json()

		if (!ObjectId.isValid(id)) {
			return NextResponse.json(
				{ success: false, message: 'Неверный ID категории' },
				{ status: 400 },
			)
		}

		if (!isRecord(rawData)) {
			return NextResponse.json(
				{ success: false, message: 'Некорректные данные категории' },
				{ status: 400 },
			)
		}

		const nameResult = getRequiredString(
			rawData,
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
			rawData,
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
		const categoryId = new ObjectId(id)

		const description = getOptionalString(rawData, 'description')
		const image = getOptionalString(rawData, 'image')
		const imageAlt = getOptionalString(rawData, 'imageAlt')

		const existingCategory = await db
			.collection('article-category')
			.findOne({
				slug,
				_id: { $ne: categoryId },
			})

		if (existingCategory) {
			return NextResponse.json(
				{
					success: false,
					message: 'Категория с таким алиасом уже существует',
				},
				{ status: 400 },
			)
		}

		const updateFields = {
			name,
			slug,
			description,
			keywords: getStringArray(rawData.keywords),
			image,
			imageAlt,
			updatedAt: new Date().toISOString(),
		}

		const updateFilter = {
			$set: updateFields,
		}

		const result = await db
			.collection('article-category')
			.updateOne({ _id: categoryId }, updateFilter)

		if (result.matchedCount === 0) {
			return NextResponse.json(
				{ success: false, message: 'Категория не найдена' },
				{ status: 404 },
			)
		}

		return NextResponse.json({
			success: true,
			message: 'Категория обновлена',
			categoryId: id,
		})
	} catch (error) {
		console.error('Ошибка обновления категории:', error)
		return NextResponse.json(
			{
				success: false,
				message: 'Ошибка обновления категории',
				error:
					error instanceof Error
						? error.message
						: 'Неизвестная ошибка',
			},
			{ status: 500 },
		)
	}
}

export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const db = await getDB()
		const { id } = await params

		if (!ObjectId.isValid(id)) {
			return NextResponse.json(
				{ success: false, message: 'Неверный ID категории' },
				{ status: 400 },
			)
		}

		const categoryId = new ObjectId(id)

		const articlesCount = await db
			.collection('articles')
			.countDocuments({ categoryId: id })

		if (articlesCount > 0) {
			return NextResponse.json(
				{
					success: false,
					message: `Невозможно удалить категорию. В ней ${articlesCount} статей.`,
				},
				{ status: 400 },
			)
		}

		const result = await db
			.collection('article-category')
			.deleteOne({ _id: categoryId })

		if (result.deletedCount === 0) {
			return NextResponse.json(
				{ success: false, message: 'Категория не найдена' },
				{ status: 404 },
			)
		}

		return NextResponse.json({
			success: true,
			message: 'Категория удалена',
		})
	} catch (error) {
		console.error('Ошибка удаления категории:', error)
		return NextResponse.json(
			{ success: false, message: 'Ошибка удаления категории' },
			{ status: 500 },
		)
	}
}
