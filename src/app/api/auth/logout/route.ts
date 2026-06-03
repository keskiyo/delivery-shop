// Назначение: API-маршрут для завершения текущей сессии.
// Как работает: Читает параметры запроса, обращается к базе данных или файлам проекта и возвращает JSON-ответ с результатом или ошибкой. Методы: POST.

import { getDB } from '@/lib/api-routes'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	try {

		const sessionCookie = request.headers
			.get('cookie')
			?.split(';')
			.find(c => c.trim().startsWith('session='))
			?.split('=')[1]

		if (sessionCookie) {
			const db = await getDB()
			await db.collection('session').deleteOne({ token: sessionCookie })
		}

		const response = NextResponse.json({ success: true })
		response.cookies.set('session', '', {
			expires: new Date(0),
			path: '/',
		})

		return response
	} catch (error) {
		console.error('Logout error:', error)
		return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
	}
}
