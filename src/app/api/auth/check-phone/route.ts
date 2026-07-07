


import { getDB } from '@/lib/api-routes'
import { NextResponse } from 'next/server'

/**
 * @swagger
 * /api/auth/check-phone:
 *   post:
 *     tags: [Auth]
 *     summary: Проверить, зарегистрирован ли номер телефона
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phoneNumber]
 *             properties:
 *               phoneNumber: { type: string }
 *     responses:
 *       200:
 *         description: '{ exists, userName? }'
 *       500:
 *         description: Ошибка сервера
 */
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
