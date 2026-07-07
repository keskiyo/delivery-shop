


import { getDB } from '@/lib/api-routes'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'

interface UpdateData {
  updatedAt: Date
  status?: string
  paymentStatus?: string
}

/**
 * @swagger
 * /api/orders/update-status:
 *   post:
 *     tags: [Orders, Admin]
 *     summary: Обновить статус заказа / статус оплаты
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderId]
 *             properties:
 *               orderId: { type: string }
 *               status: { type: string }
 *               paymentStatus: { type: string }
 *     responses:
 *       200:
 *         description: Статус обновлён
 *       400:
 *         description: Не передан orderId или нет полей
 *       404:
 *         description: Заказ не найден
 *       500:
 *         description: Ошибка сервера
 */
export async function POST(request: Request) {
	try {
		const db = await getDB()
		const { orderId, status, paymentStatus } = await request.json()

		if (!orderId) {
			return NextResponse.json(
				{ message: 'ID заказа обязателен' },
				{ status: 400 },
			)
		}

		if (!status && !paymentStatus) {
			return NextResponse.json(
				{ message: 'Укажите status или paymentStatus для обновления' },
				{ status: 400 },
			)
		}

		const updateData: UpdateData = {
			updatedAt: new Date(),
		}

		if (status) {
			updateData.status = status
		}

		if (paymentStatus) {
			updateData.paymentStatus = paymentStatus
		}

		const result = await db.collection('orders').updateOne(
			{ _id: ObjectId.createFromHexString(orderId) },
			{
				$set: updateData,
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
			message: 'Статус заказа обновлен',
			updatedFields: Object.keys(updateData).filter(
				key => key !== 'updatedAt',
			),
		})
	} catch (error) {
		console.error('Ошибка обновления статуса заказа:', error)
		return NextResponse.json(
			{ message: 'Внутренняя ошибка сервера' },
			{ status: 500 },
		)
	}
}
