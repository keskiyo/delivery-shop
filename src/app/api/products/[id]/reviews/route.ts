import { getDB } from '@/lib/api-routes'
import { ObjectId } from 'mongodb'
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params
		const db = await getDB()

		// Получаем параметры пагинации из query string
		const url = new URL(request.url)
		const limit = parseInt(url.searchParams.get('limit') || '5')
		const skip = parseInt(url.searchParams.get('skip') || '0')

		// Получаем общее количество отзывов
		const total = await db
			.collection('reviews')
			.countDocuments({ productId: id })

		// Aggregation pipeline для получения отзывов с данными о пользователе и аватаре
		const pipeline = [
			{ $match: { productId: id } },
			{ $sort: { createdAt: -1 } },

			// Lookup для получения gender из коллекции users
			{
				$lookup: {
					from: 'users',
					let: { userIdStr: '$userId' },
					pipeline: [
						{
							$match: {
								$expr: {
									$eq: [{ $toString: '$_id' }, '$$userIdStr'],
								},
							},
						},
					],
					as: 'userInfo',
				},
			},

			// Lookup для проверки наличия аватара
			{
				$lookup: {
					from: 'avatars.files',
					let: { userIdStr: '$userId' },
					pipeline: [
						{
							$match: {
								$expr: {
									$eq: [
										{ $toString: '$metadata.userId' },
										'$$userIdStr',
									],
								},
							},
						},
					],
					as: 'avatarInfo',
				},
			},

			// Добавляем поля userGender и hasAvatar
			{
				$addFields: {
					userGender: { $arrayElemAt: ['$userInfo.gender', 0] },
					hasAvatar: { $gt: [{ $size: '$avatarInfo' }, 0] },
				},
			},

			// Убираем временные поля
			{
				$project: {
					userInfo: 0,
					avatarInfo: 0,
				},
			},

			// Пагинация
			{ $skip: skip },
			{ $limit: limit },
		]

		const reviews = await db
			.collection('reviews')
			.aggregate(pipeline)
			.toArray()

		return NextResponse.json({
			reviews,
			total,
			hasMore: skip + reviews.length < total,
		})
	} catch (error) {
		console.error('Ошибка при получении отзывов:', error)
		return NextResponse.json(
			{ message: 'Ошибка при загрузке отзывов' },
			{ status: 500 },
		)
	}
}

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id: productId } = await params
		const { userId, userName, rating, comment } = await request.json()

		if (!userId || !userName || !rating || !comment) {
			return NextResponse.json(
				{ message: 'Все поля обязательны' },
				{ status: 400 },
			)
		}

		const db = await getDB()

		// Проверяем существующий отзыв
		const existingReview = await db.collection('reviews').findOne({
			productId,
			userId,
		})

		if (existingReview) {
			return NextResponse.json(
				{ message: 'Вы уже оставляли отзыв' },
				{ status: 400 },
			)
		}

		// Получаем текущий продукт чтобы обновить distribution
		const product = await db.collection('products').findOne({
			id: parseInt(productId),
		})
		const category = product?.categories[0]

		if (!product) {
			return NextResponse.json(
				{ message: 'Продукт не найден' },
				{ status: 400 },
			)
		}

		// Получаем gender пользователя из коллекции users
		const user = await db.collection('users').findOne({
			_id: new ObjectId(userId),
		})

		// ОБНОВЛЯЕМ DISTRIBUTION В КОЛЛЕКЦИИ PRODUCTS
		const newDistribution = { ...product.rating.distribution }
		const ratingKey = rating.toString() as keyof typeof newDistribution
		newDistribution[ratingKey] += 1

		const newCount = product.rating.count + 1

		// Пересчитываем средний рейтинг на основе distribution
		const totalRating =
			newDistribution['1'] * 1 +
			newDistribution['2'] * 2 +
			newDistribution['3'] * 3 +
			newDistribution['4'] * 4 +
			newDistribution['5'] * 5
		const newAverage = Math.round((totalRating / newCount) * 10) / 10

		// ОБНОВЛЯЕМ ПРОДУКТ В КОЛЛЕКЦИИ PRODUCTS
		await db.collection('products').updateOne(
			{ id: parseInt(productId) },
			{
				$set: {
					'rating.distribution': newDistribution,
					'rating.count': newCount,
					'rating.rate': newAverage,
					updatedAt: new Date(),
				},
			},
		)

		// СОЗДАЕМ ОТЗЫВ В КОЛЛЕКЦИИ REVIEWS
		const newReview = {
			productId,
			userId,
			userName,
			userGender: user?.gender || 'male',
			rating: Number(rating),
			comment: comment.trim(),
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		await db.collection('reviews').insertOne(newReview)

		revalidateTag(`product-${productId}`, 'default')

		return NextResponse.json({ success: true }, { status: 201 })
	} catch (error) {
		console.error('Ошибка при добавлении отзыва:', error)
		return NextResponse.json({ message: 'Ошибка сервера' }, { status: 500 })
	}
}
