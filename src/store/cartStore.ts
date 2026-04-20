import { CartState, PricingState } from '@/types/storeStates'
import { create } from 'zustand'
import { CartItem } from '../types/cart'

/**
 * Глобальное хранилище состояния корзины (Zustand)
 * Управляет товарами в корзине, ценами, бонусами и картой лояльности
 */
export const useCartStore = create<CartState>(set => ({
	// Товары в корзине
	cartItems: [],
	totalItems: 0,
	isLoading: false,
	pricing: {
		totalPrice: 0,
		totalMaxPrice: 0,
		totalDiscount: 0,
		finalPrice: 0,
		maxBonusUse: 0,
		totalBonuses: 0,
		isMinimumReached: false,
	},
	hasLoyaltyCard: false,
	useBonuses: false,
	isCheckout: false,
	isOrdered: false,

	/**
	 * Загружает корзину пользователя с сервера
	 * Вызывается при монтировании компонента корзины
	 */
	fetchCart: async () => {
		try {
			set({ isLoading: true })
			const response = await fetch('/api/cart')

			if (!response.ok) {
				throw new Error('Failed to fetch cart')
			}

			const cartItems = await response.json()

			// Подсчитываем общее количество товаров
			const totalItems = cartItems.reduce(
				(sum: number, item: CartItem) => sum + item.quantity,
				0,
			)

			set({
				cartItems,
				totalItems,
				isLoading: false,
			})
		} catch (error) {
			console.error('Error fetching cart:', error)
			set({ isLoading: false })
		}
	},

	/**
	 * Обновляет корзину новым списком товаров
	 * Используется после изменения количества или удаления товаров
	 */
	updateCart: (items: CartItem[]) => {
		set({
			cartItems: items,
			totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
		})
	},

	/**
	 * Очищает корзину (после успешного оформления заказа)
	 */
	clearCart: () => {
		set({
			cartItems: [],
			totalItems: 0,
		})
	},

	/**
	 * Обновляет рассчитанные цены
	 * Вызывается из хука usePricing при изменении корзины или настроек
	 */
	updatePricing: (pricing: PricingState) => {
		set({ pricing })
	},

	/**
	 * Устанавливает наличие карты лояльности у пользователя
	 */
	setHasLoyaltyCard: (hasLoyaltyCard: boolean) => {
		set({ hasLoyaltyCard })
	},

	/**
	 * Переключает использование бонусов для оплаты
	 */
	setUseBonuses: (useBonuses: boolean) => {
		set({ useBonuses })
	},

	/**
	 * Устанавливает флаг нахождения на странице оформления заказа
	 */
	setIsCheckout: (isCheckout: boolean) => {
		set({ isCheckout })
	},

	/**
	 * Устанавливает флаг успешного оформления заказа
	 */
	setIsOrdered: (isOrdered: boolean) => {
		set({ isOrdered })
	},

	/**
	 * Устанавливает флаг успешного обнуления корзины
	 */
	resetAfterOrder: () => {
		set({
			cartItems: [],
			totalItems: 0,
			isCheckout: false,
			isOrdered: false,
			useBonuses: false,
			pricing: {
				totalPrice: 0,
				totalMaxPrice: 0,
				totalDiscount: 0,
				finalPrice: 0,
				maxBonusUse: 0,
				totalBonuses: 0,
				isMinimumReached: false,
			},
		})
	},
}))
