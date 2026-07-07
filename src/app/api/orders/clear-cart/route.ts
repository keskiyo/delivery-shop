


import { getDB } from '@/lib/api-routes'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'
import { getServerUserId } from '../../../../../utils/getServerUserId'

/**
 * @swagger
 * /api/orders/clear-cart:
 *   post:
 *     tags: [Orders, Cart]
 *     summary: Очистить корзину пользователя
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200:
 *         description: Корзина очищена
 *       401:
 *         description: Не авторизован
 *       500:
 *         description: Ошибка сервера
 */
export async function POST() {
	try {
		const db = await getDB()
		const userId = await getServerUserId()

		if (!userId) {
			return NextResponse.json(
				{ message: 'Пользователь не авторизован' },
				{ status: 401 },
			)
		}

		await db.collection('user').updateOne(
			{ _id: ObjectId.createFromHexString(userId) },
			{
				$set: {
					cart: [],
					updatedAt: new Date(),
				},
			},
		)

		return NextResponse.json({
			success: true,
			message: 'Корзина очищена',
		})
	} catch (error) {
		console.error('Ошибка очистки корзины:', error)
		return NextResponse.json(
			{ message: 'Внутренняя ошибка сервера' },
			{ status: 500 },
		)
	}
}
