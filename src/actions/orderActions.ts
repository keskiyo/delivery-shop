'use server'

import { getDB } from '@/lib/api-routes'
import { OrderCartItem } from '@/types/cart'
import { ObjectId } from 'mongodb'
import { revalidatePath } from 'next/cache'
import { getServerUserId } from '../../utils/getServerUserId'

/**
 * Получает корзину пользователя для страницы оформления заказа
 * 
 * @returns Массив товаров в корзине или пустой массив
 */
export async function getOrderCartAction(): Promise<OrderCartItem[]> {
	try {
		const userId = await getServerUserId()

		if (!userId) {
			return []
		}

		const db = await getDB()
		const user = await db.collection('user').findOne({
			_id: ObjectId.createFromHexString(userId),
		})

		return user?.cart || []
	} catch (error) {
		console.error('Error getting cart:', error)
		return []
	}
}

/**
 * Получает количество бонусов пользователя и наличие карты лояльности
 * Используется для расчета цен в корзине
 * 
 * @returns Объект с количеством бонусов и флагом наличия карты
 */
export async function getUserBonusesAction(): Promise<{
	bonusesCount: number
	hasLoyaltyCard: boolean
}> {
	try {
		const userId = await getServerUserId()

		if (!userId) {
			return { bonusesCount: 0, hasLoyaltyCard: false }
		}

		const db = await getDB()
		const user = await db.collection('user').findOne({
			_id: ObjectId.createFromHexString(userId),
		})

		const bonusesCount = user?.bonusesCount || 0
		// Карта лояльности есть, если поле card заполнено (не пустая строка)
		const hasLoyaltyCard = !!(user?.card && user.card !== '')

		return { bonusesCount, hasLoyaltyCard }
	} catch (error) {
		console.error('Error getting bonuses:', error)
		return { bonusesCount: 0, hasLoyaltyCard: false }
	}
}

/**
 * Обновляет количество конкретного товара в корзине
 * Используется при изменении количества через инпут или кнопки +/-
 * 
 * @param productId - ID товара (строка)
 * @param quantity - Новое количество товара
 * @returns Объект с флагом успеха и сообщением
 */
export async function updateOrderItemQuantityAction(
	productId: string,
	quantity: number,
): Promise<{ success: boolean; message: string }> {
	try {
		const userId = await getServerUserId()

		if (!userId) {
			return { success: false, message: 'Не авторизован' }
		}

		const db = await getDB()

		// Используем позиционный оператор $ для обновления конкретного элемента массива
		const result = await db.collection('user').updateOne(
			{
				_id: ObjectId.createFromHexString(userId),
				'cart.productId': productId,
			},
			{
				$set: { 'cart.$.quantity': quantity },
			},
		)

		if (result.modifiedCount === 0) {
			return { success: false, message: 'Товар не найден в корзине' }
		}

		revalidatePath('/cart')
		return { success: true, message: 'Количество обновлено' }
	} catch (error) {
		console.error('Error updating cart item:', error)
		return { success: false, message: 'Ошибка сервера' }
	}
}

/**
 * Удаляет несколько товаров из корзины одновременно
 * Используется для удаления недоступных товаров (нет в наличии)
 * 
 * @param productIds - Массив ID товаров для удаления
 * @returns Объект с флагом успеха и сообщением
 */
export async function removeMultipleOrderItemsAction(
	productIds: string[],
): Promise<{ success: boolean; message: string }> {
	try {
		const userId = await getServerUserId()

		if (!userId) {
			return { success: false, message: 'Не авторизован' }
		}

		const db = await getDB()

		const user = await db.collection('user').findOne({
			_id: ObjectId.createFromHexString(userId),
		})

		if (!user) {
			return { success: false, message: 'Пользователь не найден' }
		}

		// Фильтруем корзину, оставляя только товары, которых нет в списке на удаление
		const updatedCart = user.cart.filter(
			(item: OrderCartItem) => !productIds.includes(item.productId),
		)

		await db.collection('user').updateOne(
			{ _id: ObjectId.createFromHexString(userId) },
			{
				$set: { cart: updatedCart },
			},
		)

		revalidatePath('/cart')
		return {
			success: true,
			message: `Товары удалены`,
		}
	} catch (error) {
		console.error('Ошибка удаления продуктов:', error)
		return { success: false, message: 'Ошибка сервера' }
	}
}
