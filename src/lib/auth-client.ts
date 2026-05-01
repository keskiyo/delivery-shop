import { phoneNumberClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

/**
 * Клиент для работы с better-auth на frontend
 * Создает подключение к серверу аутентификации
 * 
 * Используется в:
 * - authStore.ts для проверки сессии и входа/выхода
 * - Компонентах, требующих данных пользователя
 * 
 * Настройка:
 * - baseURL: URL бэкенда (для разработки - localhost:3000)
 * - plugins: телефонная аутентификация через better-auth
 */
export const authClient = createAuthClient({
	/** The base URL of the server (optional if you're using the same domain) */
	baseURL: 'http://localhost:3000',
	plugins: [phoneNumberClient()],
})
