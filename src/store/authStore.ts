import { authClient } from '@/lib/auth-client'
import { UserDataOrNull } from '@/types/userData'
import { create } from 'zustand'

/**
 * Тип состояния аутентификации
 */
type AuthState = {
	isAuth: boolean              // Авторизован ли пользователь
	user: UserDataOrNull         // Данные пользователя или null
	isLoading: boolean           // Идет ли загрузка данных
	login: () => void            // Устанавливает статус авторизации
	logout: () => Promise<void>  // Выход из системы
	checkAuth: () => Promise<boolean>  // Проверяет наличие активной сессии
	fetchUserData: () => Promise<void> // Загружает данные пользователя
}

/**
 * Глобальное хранилище состояния аутентификации (Zustand)
 * 
 * Управляет:
 * - Статусом авторизации пользователя
 * - Данными текущего пользователя
 * - Проверкой сессии
 * - Входом и выходом из системы
 * 
 * Используется в:
 * - StatesProvider для инициализации при загрузке приложения
 * - Компонентах для проверки авторизации
 * - Header для отображения профиля пользователя
 */
export const useAuthStore = create<AuthState>((set, get) => ({
	isAuth: false,
	user: null,
	isLoading: false,

	/**
	 * Устанавливает пользователя как авторизованного
	 * Вызывается после успешного входа в систему
	 * Автоматически загружает данные пользователя
	 */
	login: () => {
		set({ isAuth: true })
		get().fetchUserData()
	},

	/**
	 * Проверяет наличие активной сессии на сервере
	 * 
	 * Процесс:
	 * 1. Отправляет запрос на /api/auth/check-session
	 * 2. Если сессия валидна - загружает данные пользователя
	 * 3. Если сессия невалидна - сбрасывает состояние авторизации
	 * 
	 * @returns true если пользователь авторизован, false если нет
	 */
	checkAuth: async () => {
		try {
			set({ isLoading: true })
			const response = await fetch('/api/auth/check-session')

			if (!response.ok) {
				set({ isAuth: false, user: null, isLoading: false })
				return false
			}

			const data = await response.json()

			if (data.isAuth) {
				set({ isAuth: true })
				await get().fetchUserData()
			} else {
				set({ isAuth: false, user: null, isLoading: false })
			}

			return data.isAuth
		} catch {
			set({ isAuth: false, user: null, isLoading: false })
			return false
		}
	},

	/**
	 * Загружает данные текущего пользователя с сервера
	 * 
	 * Получает:
	 * - Личные данные (имя, фамилия, email, телефон)
	 * - Адрес и регион
	 * - Карту лояльности
	 * - Количество бонусов
	 * - Роль (user/admin)
	 * 
	 * При ошибке 401/403 сбрасывает статус авторизации
	 */
	fetchUserData: async () => {
		try {
			set({ isLoading: true })
			const response = await fetch('/api/auth/user')

			if (response.status === 401 || response.status === 403) {
				throw new Error('Unauthorized')
			}

			if (!response.ok) {
				throw new Error('Ошибка получения данных')
			}

			const userData = await response.json()

			set({ user: userData, isLoading: false })
		} catch (error) {
			console.error('Ошибка загрузки данных пользователя:', error)
			set({ user: null, isLoading: false })

			if (error === 'Unauthorized') {
				set({ isAuth: false })
			}
		}
	},

	/**
	 * Выход из системы
	 * 
	 * Процесс:
	 * 1. Вызывает signOut через better-auth клиент
	 * 2. Отправляет запрос на /api/auth/logout для удаления кастомной сессии
	 * 3. Очищает состояние авторизации в store
	 * 
	 * Используется в:
	 * - Header (кнопка выхода)
	 * - ProfileCard (удаление аккаунта)
	 */
	logout: async () => {
		try {
			// Выход через better-auth (удаляет better-auth.session_token)
			await authClient.signOut()

			// Удаление кастомной сессии (удаляет session cookie)
			await fetch('/api/auth/logout', {
				method: 'POST',
				credentials: 'include',
			})
		} finally {
			// Очищаем состояние независимо от результата
			set({ isAuth: false, user: null })
		}
	},
}))
