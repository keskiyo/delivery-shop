'use client'

import { useEffect } from 'react'
import { useAuthStore } from './authStore'
import { useCartStore } from './cartStore'

/**
 * Провайдер глобального состояния приложения
 * 
 * Функционал:
 * - Инициализирует состояние аутентификации при загрузке приложения
 * - Синхронизирует корзину с авторизацией пользователя
 * - Очищает корзину для админов/менеджеров (у них нет корзины)
 * 
 * Логика работы:
 * 1. При монтировании проверяет наличие активной сессии (checkAuth)
 * 2. Если пользователь авторизован и это обычный user - загружает корзину
 * 3. Если пользователь admin/manager - очищает корзину (у них нет корзины)
 * 4. Если пользователь не авторизован - очищает корзину
 * 
 * Используется в:
 * - Root layout для оборачивания всего приложения
 */
const StatesProvider = ({ children }: { children: React.ReactNode }) => {
	const { checkAuth, user } = useAuthStore()
	const { fetchCart, clearCart } = useCartStore()

	// Проверяем авторизацию при монтировании приложения
	useEffect(() => {
		checkAuth()
	}, [checkAuth])

	// Синхронизируем корзину с состоянием пользователя
	useEffect(() => {
		if (user) {
			// Проверяем роль пользователя
			const isManagerOrAdmin =
				user.role === 'manager' || user.role === 'admin'
			
			if (!isManagerOrAdmin) {
				// Обычный пользователь - загружаем корзину
				fetchCart()
			} else {
				// Админ/менеджер - очищаем корзину (у них нет корзины)
				clearCart()
			}
		} else {
			// Пользователь не авторизован - очищаем корзину
			clearCart()
		}
	}, [user, fetchCart, clearCart])

	return <>{children}</>
}

export default StatesProvider
