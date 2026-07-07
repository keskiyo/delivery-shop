


import { NextResponse } from 'next/server'
import {
	getBetterAuthSession,
	getCustomSessionToken,
	getUserById,
	getValidCustomSession,
} from '../../../../../utils/auth-helpers'

/**
 * @swagger
 * /api/auth/user:
 *   get:
 *     tags: [Auth]
 *     summary: Текущий пользователь (better-auth или кастомная сессия)
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200:
 *         description: Профиль пользователя
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
export async function GET(request: Request) {
	try {
		const betterAuthSession = await getBetterAuthSession(request.headers)
		if (betterAuthSession) {
			const userData = await getUserById(betterAuthSession.user.id)
			if (userData) return NextResponse.json(userData)
		}

		const sessionToken = getCustomSessionToken(
			request.headers.get('cookie'),
		)
		if (!sessionToken) {
			return NextResponse.json(
				{ error: 'Не авторизован' },
				{ status: 401 },
			)
		}

		const session = await getValidCustomSession(sessionToken)
		if (!session) {
			return NextResponse.json(
				{ error: 'Не авторизован' },
				{ status: 401 },
			)
		}

		const userData = await getUserById(session.userId)
		if (!userData) {
			return NextResponse.json(
				{ error: 'Пользователь не найден' },
				{ status: 404 },
			)
		}

		return NextResponse.json(userData)
	} catch (error) {
		console.error('Error in user API:', error)
		return NextResponse.json({ error: 'Server error' }, { status: 500 })
	}
}
