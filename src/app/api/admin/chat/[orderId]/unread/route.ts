// Назначение: API-маршрут admin/chat/[orderId]/unread.
// Как работает: Методы: GET. Валидирует входные данные, обращается к нужным сервисам и возвращает JSON-ответ.

import { getDB } from '@/lib/api-routes'
import { NextResponse } from 'next/server'
import { getServerUserId } from '../../../../../../../utils/getServerUserId'

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
