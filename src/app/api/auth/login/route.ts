import { getDB } from '@/lib/api-routes'
import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'
import { NextResponse } from 'next/server'

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Вход по телефону и паролю
 *     description: Проверяет пароль, создаёт кастомную сессию и ставит cookie `session`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phoneNumber, password]
 *             properties:
 *               phoneNumber: { type: string }
 *               password: { type: string, format: password }
 *     responses:
 *       200:
 *         description: Успешный вход, ставит cookie session
 *       400:
 *         description: Для номера не задан пароль
 *       401:
 *         description: Неверный пароль
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
export async function POST(request: Request) {
	try {
		const { phoneNumber, password } = await request.json()
		const db = await getDB()

		const user = await db.collection('user').findOne({ phoneNumber })

		if (!user) {
			return NextResponse.json(
				{ message: 'Пользователь не найден' },
				{ status: 404 },
			)
		}

		if (typeof user.password !== 'string' || !user.password) {
			return NextResponse.json(
				{ message: 'Для этого номера пароль не задан. Войдите по SMS-коду' },
				{ status: 400 },
			)
		}

		const isPasswordValid = await bcrypt.compare(password, user.password)

		if (!isPasswordValid) {
			return NextResponse.json(
				{ message: 'Неверный пароль' },
				{ status: 401 },
			)
		}

		const sessionId = randomBytes(16).toString('hex')

		const expiresIn = 30 * 24 * 60 * 60
		const expiresAt = new Date(Date.now() + expiresIn * 1000)

		await db.collection('session').insertOne({
			token: sessionId,
			userId: user._id,
			expiresAt,
			expiresIn,
			createdAt: new Date(),
			updatedAt: new Date(),
			ipAddress: request.headers.get('x-forwarded-for') || '',
			userAgent: request.headers.get('user-agent') || '',
		})

		const response = NextResponse.json({
			success: true,
			message: 'Авторизация успешна',
		})

		response.cookies.set('session', sessionId, {
			httpOnly: true,
			sameSite: 'lax',
			expires: expiresAt,
			path: '/',
		})

		return response
	} catch (error) {
		console.error('Ошибка авторизации:', error)
		return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
	}
}
