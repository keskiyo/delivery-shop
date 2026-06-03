// Назначение: API-маршрут для проверки доступности телефона.
// Как работает: Читает параметры запроса, обращается к базе данных или файлам проекта и возвращает JSON-ответ с результатом или ошибкой. Методы: POST.

import { getDB } from '@/lib/api-routes'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	try {
		const { phoneNumber } = await request.json()

		const db = await getDB()

		const user = await db.collection('user').findOne({ phoneNumber })

		if (!user) {
			return NextResponse.json({ exists: false })
		}

		return NextResponse.json({ exists: true, userName: user.name })
	} catch (error) {
		console.error('Ошибка при проверке номера:', error)
		return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
	}
}
