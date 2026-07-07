


import { getDB } from '@/lib/api-routes'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

/**
 * @swagger
 * /api/users/update-card:
 *   post:
 *     tags: [Users]
 *     summary: Привязать/обновить карту лояльности
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, cardNumber]
 *             properties:
 *               userId: { type: string }
 *               cardNumber: { type: string }
 *     responses:
 *       200:
 *         description: Карта обновлена
 *       400:
 *         description: Не хватает данных / неверный userId
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
export async function POST(request: NextRequest) {
	const db = await getDB()

	try {
		const { userId, cardNumber } = await request.json()

		if (!userId || !cardNumber) {
			return NextResponse.json(
				{ error: 'userId и cardNumber обязательны' },
				{ status: 400 },
			)
		}

		let objectId
		try {
			objectId = ObjectId.createFromHexString(userId)
		} catch {
			return NextResponse.json(
				{ error: 'Неверный формат userId' },
				{ status: 400 },
			)
		}

		const user = await db.collection('user').findOne({ _id: objectId })
		if (!user) {
			return NextResponse.json(
				{ error: 'Пользователь не найден' },
				{ status: 404 },
			)
		}

		const result = await db.collection('user').updateOne(
			{ _id: objectId },
			{
				$set: {
					card: cardNumber,
					hasCard: true,
					updatedAt: new Date(),
				},
			},
		)

		if (result.modifiedCount === 0) {
			return NextResponse.json(
				{ error: 'Не удалось обновить данные карты' },
				{ status: 500 },
			)
		}

		return NextResponse.json({
			success: true,
			message: 'Данные карты обновлены',
			card: cardNumber,
		})
	} catch (error) {
		console.error('Ошибка при обновлении карты:', error)

		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: 'Внутренняя ошибка сервера',
			},
			{ status: 500 },
		)
	}
}
