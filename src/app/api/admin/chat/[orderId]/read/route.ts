import { getDB } from '@/lib/api-routes'
import { NextResponse } from 'next/server'
import { getServerUserId } from '../../../../../../../utils/getServerUserId'

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ orderId: string }> },
) {
	try {
		const { orderId } = await params
		const userId = await getServerUserId()
		const db = await getDB()

		await db.collection('chatMessages').updateMany(
			{
				orderId,
				readBy: { $ne: userId },
			},
			{
				$addToSet: { readBy: userId },
			},
		)

		return NextResponse.json({ success: true })
	} catch {
		return NextResponse.json(
			{ message: 'Внутренняя ошибка сервера' },
			{ status: 500 },
		)
	}
}
