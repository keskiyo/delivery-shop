import { headers } from 'next/headers'
import {
	getBetterAuthSession,
	getCustomSessionToken,
	getValidCustomSession,
} from './auth-helpers'

/**
 * Получает ID текущего пользователя на сервере
 * 
 * Поддерживает два типа сессий:
 * 1. Better-auth сессия (для входа через email+password, phone+OTP)
 * 2. Кастомная сессия (для входа через phone+password)
 * 
 * Логика проверки:
 * - Сначала проверяет better-auth сессию
 * - Если не найдена, проверяет кастомную сессию из cookie
 * 
 * @returns ID пользователя (строка) или null если не авторизован
 * 
 * @example
 * const userId = await getServerUserId()
 * if (!userId) {
 *   return { error: 'Не авторизован' }
 * }
 */
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
