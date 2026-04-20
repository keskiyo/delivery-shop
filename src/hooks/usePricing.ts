'use client'

import { useCartStore } from '@/store/cartStore'
import { CalculatedItem, UsePricingProps } from '@/types/pricingProps'
import { useEffect, useMemo } from 'react'
import { CONFIG } from '../../config/config'
import {
	calculateFinalPrice,
	calculatePriceByCard,
} from '../../utils/calcPrices'

/**
 * Хук для расчета цен в корзине с учетом скидок, карты лояльности и бонусов
 * 
 * @param availableCartItems - Товары в корзине (только доступные для заказа)
 * @param productsData - Данные о продуктах (цены, скидки)
 * @param hasLoyaltyCard - Есть ли у пользователя карта лояльности (дает 6% скидку)
 * @param bonusesCount - Количество доступных бонусов у пользователя
 * @param useBonuses - Хочет ли пользователь использовать бонусы для оплаты
 * 
 * @returns Объект с рассчитанными ценами и флагом достижения минимальной суммы заказа
 */
export const usePricing = ({
	availableCartItems,
	productsData,
	hasLoyaltyCard,
	bonusesCount,
	useBonuses,
}: UsePricingProps) => {
	const { updatePricing } = useCartStore()

	// Вычисляем все данные для каждого товара один раз
	// Для каждого товара рассчитываем: базовую цену, цену со скидкой, финальную цену с картой, бонусы
	const calculatedItems = useMemo(() => {
		return availableCartItems
			.map(item => {
				const product = productsData[item.productId]
				if (!product) return null

				// Применяем скидку товара (если есть)
				const priceWithDiscount = calculateFinalPrice(
					product.basePrice,
					product.discountPercent || 0,
				)

				// Если есть карта лояльности - применяем дополнительную скидку 6%
				const finalPrice = hasLoyaltyCard
					? calculatePriceByCard(
							priceWithDiscount,
							CONFIG.CARD_DISCOUNT_PERCENT,
						)
					: priceWithDiscount

				// Скидка от карты лояльности
				const discountAmount = priceWithDiscount - finalPrice
				
				// Начисляемые бонусы - 5% от цены со скидкой товара
				const bonuses =
					priceWithDiscount * (CONFIG.BONUSES_PERCENT / 100)

				return {
					basePrice: product.basePrice,
					priceWithDiscount,
					finalPrice,
					discountAmount,
					bonuses,
					quantity: item.quantity,
				}
			})
			.filter(Boolean) as (CalculatedItem & { quantity: number })[]
	}, [availableCartItems, productsData, hasLoyaltyCard])

	// Вычисляем итоговые суммы на основе подготовленных данных
	// totalPrice - итоговая цена с учетом всех скидок (но без бонусов)
	// totalMaxPrice - цена со скидками товаров, но без карты лояльности
	// totalDiscount - общая скидка от карты лояльности
	// totalBonusesValue - сколько бонусов будет начислено за заказ
	const { totalPrice, totalMaxPrice, totalDiscount, totalBonusesValue } =
		useMemo(() => {
			return calculatedItems.reduce(
				(acc, item) => {
					const quantity = item.quantity

					return {
						totalPrice: acc.totalPrice + item.finalPrice * quantity,
						totalMaxPrice:
							acc.totalMaxPrice +
							item.priceWithDiscount * quantity,
						totalDiscount:
							acc.totalDiscount + item.discountAmount * quantity,
						totalBonusesValue:
							acc.totalBonusesValue +
							Math.round(item.bonuses) * quantity,
					}
				},
				{
					totalPrice: 0,
					totalMaxPrice: 0,
					totalDiscount: 0,
					totalBonusesValue: 0,
				},
			)
		}, [calculatedItems])

	// Максимальное количество бонусов, которое можно использовать
	// Ограничено: минимум из доступных бонусов и 10% от суммы заказа
	const maxBonusUse = Math.min(
		bonusesCount,
		Math.floor((totalPrice * CONFIG.MAX_BONUSES_PERCENT) / 100),
	)

	// Финальная цена к оплате: если используем бонусы - вычитаем их
	const finalPrice = useBonuses
		? Math.max(0, totalPrice - maxBonusUse)
		: totalPrice

	// Проверяем, достигнута ли минимальная сумма заказа (1000 руб)
	const isMinimumReached = finalPrice >= CONFIG.MIN_ORDER_PRICE

	// Обновляем глобальное состояние корзины при изменении цен
	useEffect(() => {
		updatePricing({
			totalPrice,
			totalMaxPrice,
			totalDiscount,
			finalPrice,
			maxBonusUse,
			totalBonuses: totalBonusesValue,
			isMinimumReached,
		})
	}, [
		totalPrice,
		totalMaxPrice,
		totalDiscount,
		finalPrice,
		maxBonusUse,
		totalBonusesValue,
		isMinimumReached,
		updatePricing,
	])

	return {
		totalPrice,
		totalMaxPrice,
		totalDiscount,
		finalPrice,
		maxBonusUse,
		totalBonuses: totalBonusesValue,
		isMinimumReached,
	}
}
