


import { getDB } from '@/lib/api-routes'
import { NextResponse } from 'next/server'
import { getServerUserId } from '../../../../../utils/getServerUserId'

/**
 * @swagger
 * /api/admin/chat:
 *   post:
 *     tags: [Admin]
 *     summary: Отправить сообщение в чат заказа
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderId, message]
 *             properties:
 *               orderId: { type: string }
 *               message: { type: string }
 *               userName: { type: string }
 *               userRole: { type: string }
 *     responses:
 *       200:
 *         description: Созданное сообщение
 *       401:
 *         description: Не авторизован
 *       500:
 *         description: Ошибка сервера
 */
export async function POST(request: Request) {
	try {
		const db = await getDB()
		const userId = await getServerUserId()
		const { orderId, message, userName, userRole } = await request.json()

		if (!userId) {
			return NextResponse.json(
				{ message: 'Пользователь не авторизован' },
				{ status: 401 },
			)
		}

		const chatMessage = {
			orderId,
			userId,
			userName,
			message,
			timestamp: new Date(),
			readBy: [userId],
			userRole,
		}

		const result = await db
			.collection('chatMessages')
			.insertOne(chatMessage)

		return NextResponse.json({
			...chatMessage,
			_id: result.insertedId,
		})
	} catch (error) {
		console.error('Ошибка отправки сообщения:', error)
		return NextResponse.json(
			{ message: 'Внутренняя ошибка сервера' },
			{ status: 500 },
		)
	}
}
