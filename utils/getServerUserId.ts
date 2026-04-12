import { headers } from 'next/headers'
import {
	getBetterAuthSession,
	getCustomSessionToken,
	getValidCustomSession,
} from './auth-helpers'

export async function getServerUserId() {
	try {
		const headersList = await headers()

		// 1. Сначала проверяем better-auth сессию
		const betterAuthSession = await getBetterAuthSession(headersList)
		if (betterAuthSession?.user?.id) {
			return betterAuthSession.user.id
		}

		// 2. Если нет better-auth сессии, проверяем кастомную
		const cookies = headersList.get('cookie')
		const sessionToken = getCustomSessionToken(cookies)
		if (!sessionToken) return null

		const session = await getValidCustomSession(sessionToken)
		return session?.userId || null
	} catch {
		return null
	}
}
