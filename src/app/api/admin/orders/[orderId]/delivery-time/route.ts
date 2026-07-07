


import { getDB } from '@/lib/api-routes'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

/**
 * @swagger
 * /api/admin/orders/{orderId}/delivery-time:
 *   post:
 *     tags: [Admin, Orders]
 *     summary: Изменить дату/слот доставки заказа
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [deliveryDate, deliveryTimeSlot]
 *             properties:
 *               deliveryDate: { type: string }
 *               deliveryTimeSlot: { type: string }
 *     responses:
 *       200:
 *         description: Время доставки обновлено
 *       400:
 *         description: Не хватает полей
 *       404:
 *         description: Заказ не найден
 *       500:
 *         description: Ошибка сервера
 */
export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ orderId: string }> },
) {
	try {
		const { orderId } = await params

		if (!orderId) {
			return NextResponse.json(
				{ message: 'Требуется ID заказа' },
				{ status: 400 },
			)
		}

		const { deliveryDate, deliveryTimeSlot } = await request.json()

		if (!deliveryDate || !deliveryTimeSlot) {
			return NextResponse.json(
				{
					message:
						'Отсутствуют обязательные поля: deliveryDate и deliveryTimeSlot',
				},
				{ status: 400 },
			)
		}

		const db = await getDB()

		const result = await db.collection('orders').updateOne(
			{ _id: new ObjectId(orderId) },
			{
				$set: {
					deliveryDate,
					deliveryTimeSlot,
					updatedAt: new Date(),
				},
			},
		)

		if (result.matchedCount === 0) {
			return NextResponse.json(
				{ message: 'Заказ не найден' },
				{ status: 404 },
			)
		}

		return NextResponse.json({
			success: true,
			message: 'Время доставки успешно обновлено',
			data: {
				deliveryDate,
				deliveryTimeSlot,
			},
		})
	} catch (error) {
		console.error('Ошибка обновления времени доставки:', error)
		return NextResponse.json(
			{ message: 'Внутренняя ошибка сервера' },
			{ status: 500 },
		)
	}
}
