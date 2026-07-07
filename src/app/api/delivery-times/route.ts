


import { getDB } from '@/lib/api-routes'
import { Schedule } from '@/types/deliverySchedule'
import { NextResponse } from 'next/server'

/**
 * @swagger
 * /api/delivery-times:
 *   get:
 *     tags: [Delivery]
 *     summary: График доставки (слоты по датам)
 *     responses:
 *       200:
 *         description: '{ schedule }'
 *       500:
 *         description: Ошибка сервера
 *   post:
 *     tags: [Delivery, Admin]
 *     summary: Сохранить график доставки
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               schedule: { type: object }
 *     responses:
 *       200:
 *         description: Сохранено
 *       500:
 *         description: Ошибка сервера
 */
export async function GET() {
	try {
		const db = await getDB()

		const deliveryTimes = await db.collection('delivery-times').findOne({})

		return NextResponse.json({
			schedule: deliveryTimes?.schedule || {},
		})
	} catch {
		return NextResponse.json(
			{ message: 'Ошибка при загрузке графика доставки' },
			{ status: 500 },
		)
	}
}

export async function POST(request: Request) {
	try {
		const { schedule } = (await request.json()) as { schedule: Schedule }
		const db = await getDB()

		await db.collection('delivery-times').updateOne(
			{},
			{
				$set: {
					schedule: schedule || {},
					updatedAt: new Date(),
				},
			},
			{ upsert: true },
		)

		return NextResponse.json({
			success: true,
			message: 'График доставки сохранен',
		})
	} catch {
		return NextResponse.json(
			{ message: 'Ошибка при сохранении графика доставки' },
			{ status: 500 },
		)
	}
}
