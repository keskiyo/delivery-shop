import { getDB } from '@/lib/api-routes'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	try {
		const { login, loginType } = await request.json()

		const db = await getDB()

		const query =
			loginType === 'email'
				? { email: login }
				: { phoneNumber: login.replace(/\D/g, '') }

		const user = await db.collection('users').findOne(query)

		if (!user) {
			return NextResponse.json({ exists: false, verified: false })
		}

		const verified =
			loginType === 'email'
				? !!user.emailVerified
				: !!user.phoneNumberVerified

		return NextResponse.json({ exists: true, verified })
	} catch (error) {
		console.error('Ошибка при проверке логина:', error)
		return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
	}
}
