// Назначение: API-маршрут orders/update-status.
// Как работает: Методы: POST. Валидирует входные данные, обращается к нужным сервисам и возвращает JSON-ответ.

import { getDB } from '@/lib/api-routes'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'

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
