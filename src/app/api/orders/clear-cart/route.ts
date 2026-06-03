// Назначение: API-маршрут для очистки корзины после заказа.
// Как работает: Читает параметры запроса, обращается к базе данных или файлам проекта и возвращает JSON-ответ с результатом или ошибкой. Методы: POST.

import { getDB } from '@/lib/api-routes'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'
import { getServerUserId } from '../../../../../utils/getServerUserId'

export async function POST() {
	try {
		const db = await getDB()
		const userId = await getServerUserId()

		if (!userId) {
			return NextResponse.json(
				{ message: 'Пользователь не авторизован' },
				{ status: 401 },
			)
		}

		await db.collection('user').updateOne(
			{ _id: ObjectId.createFromHexString(userId) },
			{
				$set: {
					cart: [],
					updatedAt: new Date(),
				},
			},
		)

		return NextResponse.json({
			success: true,
			message: 'Корзина очищена',
		})
	} catch (error) {
		console.error('Ошибка очистки корзины:', error)
		return NextResponse.json(
			{ message: 'Внутренняя ошибка сервера' },
			{ status: 500 },
		)
	}
}
