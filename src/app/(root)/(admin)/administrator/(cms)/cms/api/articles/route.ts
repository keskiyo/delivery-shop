


import { getDB } from '@/lib/api-routes'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'
import {
	getOptionalBoolean,
	getOptionalString,
	getRequiredString,
	getStringArray,
	isRecord,
} from '../../../../../../../../../utils/apiValidation'
import { sanitizeArticleHTML } from '../../../../../../../../../utils/sanitizeArticleHTML'
import { processArticleImages } from '../../articles/utils/processArticleImages'

export async function POST(request: Request) {
	try {
		const data: unknown = await request.json()

		if (!isRecord(data)) {
			return NextResponse.json(
				{ success: false, message: 'Некорректные данные статьи' },
				{ status: 400 },
			)
		}

		const nameResult = getRequiredString(
			data,
			'name',
			'Название статьи обязательно',
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
			'Алиас (slug) статьи обязателен',
		)
		if (!slugResult.ok) {
			return NextResponse.json(
				{ success: false, message: slugResult.message },
				{ status: 400 },
			)
		}

		const authorResult = getRequiredString(
			data,
			'author',
			'Автор статьи обязателен',
		)
		if (!authorResult.ok) {
			return NextResponse.json(
				{ success: false, message: authorResult.message },
				{ status: 400 },
			)
		}

		const categoryIdResult = getRequiredString(
			data,
			'categoryId',
			'Категория статьи обязательна',
		)
		if (!categoryIdResult.ok) {
			return NextResponse.json(
				{ success: false, message: categoryIdResult.message },
				{ status: 400 },
			)
		}

		const name = nameResult.value
		const slug = slugResult.value.toLowerCase()
		const description = getOptionalString(data, 'description')
		const keywords = getStringArray(data.keywords)
		const image = getOptionalString(data, 'image')
		const imageAlt = getOptionalString(data, 'imageAlt', name)
		const author = authorResult.value
		const categoryId = categoryIdResult.value
		const categoryName = getOptionalString(data, 'categoryName')
		const categorySlug = getOptionalString(data, 'categorySlug')
		const isFeatured = getOptionalBoolean(data, 'isFeatured')
		const statusValue = getOptionalString(data, 'status', 'draft')
		const status = ['published', 'draft', 'archived', 'deleted'].includes(
			statusValue,
		)
			? statusValue
			: 'draft'
		const articleId = getOptionalString(data, '_id')

		if (articleId && !ObjectId.isValid(articleId)) {
			return NextResponse.json(
				{ success: false, message: 'Неверный ID статьи' },
				{ status: 400 },
			)
		}

		if (!ObjectId.isValid(categoryId)) {
			return NextResponse.json(
				{ success: false, message: 'Неверный ID категории' },
				{ status: 400 },
			)
		}

		const db = await getDB()

		const query: Record<string, unknown> = { slug }

		if (articleId) {
			query._id = { $ne: ObjectId.createFromHexString(articleId) }
		}

		const existingArticle = await db.collection('articles').findOne(query)

		if (existingArticle) {
			return NextResponse.json(
				{
					success: false,
					message: 'Статья с таким алиасом уже существует',
				},
				{ status: 400 },
			)
		}

		if (categoryId) {
			const categoryExists = await db
				.collection('article-category')
				.findOne({ _id: ObjectId.createFromHexString(categoryId) })

			if (!categoryExists) {
				return NextResponse.json(
					{
						success: false,
						message: 'Указанная категория не найдена',
					},
					{ status: 400 },
				)
			}
		}

		const sanitizedContent = sanitizeArticleHTML(
			getOptionalString(data, 'content'),
		)

		const finalContent = await processArticleImages(sanitizedContent)

		if (articleId) {
			try {
				const objectId = ObjectId.createFromHexString(articleId)

				const updateData = {
					name,
					slug,
					description,
					keywords,
					image,
					imageAlt,
					author,
					categoryId,
					categoryName,
					categorySlug,
					content: finalContent,
					isFeatured,
					status,
					updatedAt: new Date().toISOString(),
					...(status === 'published' && {
						publishedAt: new Date().toISOString(),
					}),
				}

				const result = await db
					.collection('articles')
					.updateOne({ _id: objectId }, { $set: updateData })

				if (result.matchedCount === 0) {
					return NextResponse.json(
						{
							success: false,
							message: 'Статья не найдена',
						},
						{ status: 404 },
					)
				}
				return NextResponse.json(
					{
						success: true,
						message: 'Статья успешно обновлена',
					},
					{ status: 200 },
				)
			} catch (error) {
				console.error('Ошибка обновления статьи:', error)
				return NextResponse.json(
					{
						success: false,
						message: 'Ошибка обновления статьи',
					},
					{ status: 500 },
				)
			}
		}

		const result = await db
			.collection('articles')
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

		const newArticle = {
			_id: new ObjectId(),
			numericId: newNumericId,
			name,
			slug,
			description,
			keywords,
			image,
			imageAlt,
			author,
			categoryId,
			categoryName,
			categorySlug,
			content: finalContent,
			isFeatured,
			status,
			views: 0,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),

			...(status === 'published' && {
				publishedAt: new Date().toISOString(),
			}),
		}

		await db.collection('articles').insertOne(newArticle)

		const responseArticle = {
			...newArticle,
			_id: newArticle._id.toString(),
		}

		return NextResponse.json(
			{
				success: true,
				message: 'Статья успешно создана',
				data: responseArticle,
			},
			{ status: 201 },
		)
	} catch (error) {
		console.error('Ошибка создания статьи:', error)
		return NextResponse.json(
			{
				success: false,
				message: 'Ошибка создания статьи',
				error:
					error instanceof Error
						? error.message
						: 'Неизвестная ошибка',
			},
			{ status: 500 },
		)
	}
}
