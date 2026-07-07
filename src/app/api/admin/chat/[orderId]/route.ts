


import { getDB } from '@/lib/api-routes'
import { NextResponse } from 'next/server'

/**
 * @swagger
 * /api/admin/chat/{orderId}:
 *   get:
 *     tags: [Admin]
 *     summary: Сообщения чата по заказу
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Массив сообщений
 *       500:
 *         description: Ошибка сервера
 */
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ orderId: string }> },
) {
	try {
		const { orderId } = await params
		const db = await getDB()

		const messages = await db
			.collection('chatMessages')
			.find({ orderId })
			.sort({ timestamp: 1 })
			.toArray()

		return NextResponse.json(messages)
	} catch (error) {
		console.error('Ошибка получения сообщений:', error)
		return NextResponse.json(
			{ message: 'Внутренняя ошибка сервера' },
			{ status: 500 },
		)
	}
}
