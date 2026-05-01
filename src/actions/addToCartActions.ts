'use server'

import { getDB } from '@/lib/api-routes'
import { ObjectId } from 'mongodb'
import { getServerUserId } from '../../utils/getServerUserId'
import { CartItem } from '../types/cart'

/**
 * Server Action для добавления товара в корзину
 *
 * Логика работы:
 * 1. Проверяет авторизацию пользователя
 * 2. Проверяет существование товара в БД
 * 3. Проверяет, нет ли товара уже в корзине (если есть - не добавляет)
 * 4. Проверяет наличие товара на складе
 * 5. Добавляет товар с quantity=1 (если есть в наличии) или quantity=0 (если нет)
 *
 * @param productId - ID товара (строка)
 * @returns Объект с флагом успеха и сообщением
 */
export async function addToCartAction(
	productId: string,
): Promise<{ success: boolean; message: string; loyaltyPrice?: number }> {
	try {
		if (!productId) {
			return { success: false, message: 'ID продукта не указан' }
		}

		// Получаем ID пользователя из сессии (поддерживает оба типа сессий)
		const userId = await getServerUserId()

		if (!userId) {
			return { success: false, message: 'Не авторизован' }
		}

		const db = await getDB()

		// Получаем данные пользователя с его корзиной
		const user = await db.collection('user').findOne({
			_id: ObjectId.createFromHexString(userId),
		})

		if (!user) {
			return { success: false, message: 'Пользователь не найден' }
		}

		const productIdNumber = parseInt(productId)

		// Проверяем существование товара
		const product = await db.collection('products').findOne({
			id: productIdNumber,
		})

		if (!product) {
			return { success: false, message: 'Продукт не найден' }
		}

		const cartItems: CartItem[] = user.cart || []

		// Проверяем, нет ли товара уже в корзине
		const existingItem = cartItems.find(
			(item: CartItem) => item.productId === productId,
		)

		if (existingItem) {
			// Товар уже в корзине - не добавляем повторно
			return {
				success: false,
				message: 'Товар уже в корзине',
			}
		}

		// Проверяем наличие товара на складе
		const productQuantity = product.quantity || 0

		// Если товар есть в наличии - добавляем с quantity=1, иначе с quantity=0
		const initialQuantity = productQuantity > 0 ? 1 : 0

		const newCartItem: CartItem = {
			productId,
			quantity: initialQuantity,
			addedAt: new Date(),
		}

		const newCartItems = [...cartItems, newCartItem]

		// Обновляем корзину пользователя в БД
		await db
			.collection('user')
			.updateOne(
				{ _id: ObjectId.createFromHexString(userId) },
				{ $set: { cart: newCartItems } },
			)

		return {
			success: true,
			message: '',
		}
	} catch {
		return { success: false, message: 'Ошибка сервера' }
	}
}
