


import { getDB } from '@/lib/api-routes'
import { NextResponse } from 'next/server'
import { getServerUserId } from '../../../../../../../utils/getServerUserId'

/**
 * @swagger
 * /api/admin/chat/{orderId}/unread:
 *   get:
 *     tags: [Admin]
 *     summary: Есть ли непрочитанные сообщения по заказу
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: boolean
 */
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ orderId: string }> },
) {
	try {
		const { orderId } = await params
		const userId = await getServerUserId()
		const db = await getDB()

		if (!userId) {
			return NextResponse.json(false)
		}

		const unread = await db.collection('chatMessages').findOne({
			orderId,
			readBy: { $ne: userId },
		})

		return NextResponse.json(!!unread)
	} catch (error) {
		console.error('Ошибка проверки непрочитанных сообщений:', error)
		return NextResponse.json(false)
	}
}
