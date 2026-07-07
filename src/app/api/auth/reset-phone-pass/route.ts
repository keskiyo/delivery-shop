


import { getDB } from '@/lib/api-routes'
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'

/**
 * @swagger
 * /api/auth/reset-phone-pass:
 *   post:
 *     tags: [Auth]
 *     summary: Сбросить пароль по номеру телефона
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phoneNumber, newPassword]
 *             properties:
 *               phoneNumber: { type: string }
 *               newPassword: { type: string, format: password }
 *     responses:
 *       200:
 *         description: Пароль обновлён
 *       400:
 *         description: Не хватает данных
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
export async function POST(request: NextRequest) {
	try {
		const { phoneNumber, newPassword } = await request.json()

		if (!phoneNumber || !newPassword) {
			return NextResponse.json(
				{ error: 'Требуется phoneNumber и newPassword' },
				{ status: 400 },
			)
		}

		const db = await getDB()

		const hashedPassword = await bcrypt.hash(newPassword, 10)

		const result = await db.collection('user').updateOne(
			{ phoneNumber },
			{
				$set: {
					password: hashedPassword,
					updatedAt: new Date(),
				},
			},
		)

		if (result.matchedCount === 0) {
			return NextResponse.json(
				{ error: 'Пользователь с таким номером не найден' },
				{ status: 404 },
			)
		}

		return NextResponse.json({ success: true }, { status: 200 })
	} catch (error) {
		console.error('Ошибка обновления пароля:', error)
		return NextResponse.json(
			{ error: 'Внутренняя ошибка сервера' },
			{ status: 500 },
		)
	}
}
