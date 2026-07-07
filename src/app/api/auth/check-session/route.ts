


import { NextResponse } from 'next/server'
import {
	getBetterAuthSession,
	getCustomSessionToken,
	validateCustomSession,
} from '../../../../../utils/auth-helpers'

/**
 * @swagger
 * /api/auth/check-session:
 *   get:
 *     tags: [Auth]
 *     summary: Проверить, авторизован ли пользователь
 *     description: Проверяет better-auth сессию, затем кастомную cookie `session`.
 *     responses:
 *       200:
 *         description: '{ isAuth: boolean }'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAuth: { type: boolean }
 */
export async function GET(request: Request) {
	try {
		const betterAuthSession = await getBetterAuthSession(request.headers)
		if (betterAuthSession) return NextResponse.json({ isAuth: true })

		const sessionToken = getCustomSessionToken(
			request.headers.get('cookie'),
		)
		if (!sessionToken) return NextResponse.json({ isAuth: false })

		const isAuth = await validateCustomSession(sessionToken)
		return NextResponse.json({ isAuth })
	} catch (error) {
		console.error('Error in check-session:', error)
		return NextResponse.json({ isAuth: false })
	}
}
