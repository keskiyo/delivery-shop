


import { getDB } from '@/lib/api-routes'
import { NextResponse } from 'next/server'

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Выход (удаляет кастомную сессию и cookie)
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200:
 *         description: success
 *       500:
 *         description: Ошибка сервера
 */
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
