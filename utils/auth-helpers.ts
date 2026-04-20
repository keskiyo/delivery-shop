import { getDB } from '@/lib/api-routes'
import { auth } from '@/lib/auth'
import { ObjectId } from 'mongodb'

/**
 * Получает сессию через better-auth
 * Используется для стандартной аутентификации (email+password, phone+OTP)
 * 
 * @param headers - HTTP заголовки запроса (содержат cookie с токеном сессии)
 * @returns Объект сессии или null если сессия невалидна
 */
export async function getBetterAuthSession(headers: Headers) {
	try {
		return await auth.api.getSession({ headers })
	} catch (error) {
		console.log('Better-Auth session check failed:', error)
		return null
	}
}

/**
 * Извлекает токен кастомной сессии из cookie
 * Кастомная сессия используется для входа через phone+password
 * 
 * @param cookieHeader - Строка с cookie из заголовка запроса
 * @returns Токен сессии или null если не найден
 */
export function getCustomSessionToken(
	cookieHeader: string | null,
): string | null {
	const cookies = (cookieHeader || '').split(';').map(c => c.trim())

	return cookies.find(c => c.startsWith('session='))?.split('=')[1] || null
}

/**
 * Проверяет валидность кастомной сессии
 * Проверяет существование токена в БД и срок его действия
 * 
 * @param sessionToken - Токен сессии для проверки
 * @returns true если сессия валидна, false если истекла или не найдена
 */
export async function validateCustomSession(sessionToken: string) {
	const db = await getDB()
	const session = await db
		.collection('session')
		.findOne({ token: sessionToken })

	return !!session && new Date(session.expiresAt) > new Date()
}

/**
 * Получает данные пользователя по ID из БД
 * 
 * @param userId - ID пользователя (строка)
 * @returns Объект с данными пользователя или null если не найден
 */
export async function getUserById(userId: string) {
	const db = await getDB()
	const user = await db
		.collection('user')
		.findOne({ _id: new ObjectId(userId) })

	if (!user) return null

	return {
		id: user._id.toString(),
		name: user.name,
		surname: user.surname,
		email: user.email,
		phoneNumber: user.phoneNumber,
		emailVerified: user.emailVerified,
		phoneNumberVerified: user.phoneNumberVerified,
		gender: user.gender,
		birthdayDate: user.birthdayDate,
		location: user.location,
		region: user.region,
		card: user.card,
		role: user.role,
	}
}

/**
 * Получает валидную кастомную сессию из БД
 * Проверяет срок действия и возвращает объект сессии
 * 
 * @param sessionToken - Токен сессии
 * @returns Объект сессии или null если невалидна/истекла
 */
export async function getValidCustomSession(sessionToken: string) {
	const db = await getDB()
	const session = await db
		.collection('session')
		.findOne({ token: sessionToken })
	if (!session || new Date(session.expiresAt) < new Date()) return null
	return session
}
