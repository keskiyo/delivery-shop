import { getDB } from '@/lib/api-routes'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'

/**
 * API route для обновления статуса заказа
 * POST /api/orders/update-status
 * 
 * Используется для:
 * - Обновления статуса заказа (новый, в обработке, доставлен и т.д.)
 * - Обновления статуса оплаты (оплачен, не оплачен, возврат и т.д.)
 * 
 * Требует в теле запроса:
 * - orderId: ID заказа для обновления
 * - status: Новый статус заказа (опционально)
 * - paymentStatus: Новый статус оплаты (опционально)
 * 
 * Примечание: Должен быть указан хотя бы один из параметров status или paymentStatus
 */
interface UpdateData {
  updatedAt: Date
  status?: string
  paymentStatus?: string
}

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
