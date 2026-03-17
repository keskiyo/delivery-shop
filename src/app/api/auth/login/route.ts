import { getDB } from '@/lib/api-routes'
import { randomBytes } from 'crypto'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	try {
		const { phoneNumber, password } = await request.json()
		const db = await getDB()

		const user = await db.collection('user').findOne({ phoneNumber })

		if (!user) {
			return NextResponse.json(
				{ message: 'Пользователь не найден' },
				{ status: 404 },
			)
		}

		const bcrypt = await import('bcrypt')
		const isPasswordValid = await bcrypt.compare(password, user.password)

		if (!isPasswordValid) {
			return NextResponse.json(
				{ message: 'Неверный пароль' },
				{ status: 401 },
			)
		}

		// Создаем сессию как в Better-Auth
		const sessionId = randomBytes(16).toString('hex')

		// Устанавливаем время жизни сессии в секундах (30 дней)
		const expiresIn = 30 * 24 * 60 * 60
		const expiresAt = new Date(Date.now() + expiresIn * 1000)

		// Вставляем новую запись сессии в коллекцию "session" MongoDB
		await db.collection('session').insertOne({
			token: sessionId,
			userId: user._id.toString(),
			expiresAt: expiresAt,
			expiresIn: expiresIn,
			createdAt: new Date(),
			updatedAt: new Date(),
			ipAddress: request.headers.get('x-forwarded-for') || '',
			userAgent: request.headers.get('user-agent') || '',
		})

		const responseData = {
			success: true,
			message: 'Авторизация успешна',
		}

		// Создаем HTTP response с JSON данными
		const response = NextResponse.json(responseData)

		// Устанавливаем сессионную куку
		response.cookies.set('session', sessionId, {
			httpOnly: true, //Защита от XSS
			sameSite: 'lax', //Защита от CSRF
			expires: expiresAt,
			path: '/',
		})

		return response
	} catch (error) {
		console.error('Ошибка авторизации:', error)
		return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
	}
}
