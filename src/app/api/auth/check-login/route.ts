


import { getDB } from '@/lib/api-routes'
import { NextResponse } from 'next/server'

/**
 * @swagger
 * /api/auth/check-login:
 *   post:
 *     tags: [Auth]
 *     summary: Проверить, существует ли логин и подтверждён ли он
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [login, loginType]
 *             properties:
 *               login: { type: string }
 *               loginType: { type: string, enum: [email, phone] }
 *     responses:
 *       200:
 *         description: '{ exists, verified }'
 *       500:
 *         description: Ошибка сервера
 */
export async function POST(request: Request) {
	try {
		const { login, loginType } = await request.json()

		const db = await getDB()

		const query =
			loginType === 'email'
				? { email: login }
				: { phoneNumber: login.replace(/\D/g, '') }

		const user = await db.collection('user').findOne(query)

		if (!user) {
			return NextResponse.json({ exists: false, verified: false })
		}

		const verified =
			loginType === 'email'
				? !!user.emailVerified
				: !!user.phoneNumberVerified

		return NextResponse.json({
			exists: true,
			verified,
			hasPassword: !!user.password,
		})
	} catch (error) {
		console.error('Ошибка при проверке логина:', error)
		return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
	}
}
