import { getDB } from '@/lib/api-routes'
import { NextResponse } from 'next/server'
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
