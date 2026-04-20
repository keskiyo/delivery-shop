import { getDB } from '@/lib/api-routes'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'
import { getServerUserId } from '../../../../utils/getServerUserId'

/**
 * API Route для создания заказа (POST /api/orders)
 * 
 * Процесс создания заказа:
 * 1. Проверяет авторизацию пользователя
 * 2. Получает данные пользователя из БД
 * 3. Округляет все денежные значения (бонусы, цены)
 * 4. Создает объект заказа с уникальным номером
 * 5. Сохраняет заказ в коллекцию orders
 * 
 * Статусы заказа:
 * - status: 'pending' (ожидает обработки)
 * - paymentStatus: 'pending' (для наличных) или 'waiting' (для онлайн-оплаты)
 */
export async function POST(request: Request) {
	try {
		const db = await getDB()
		const orderData = await request.json()

		// Получаем ID текущего пользователя из сессии (поддерживает оба типа сессий)
		const userId = await getServerUserId()

		if (!userId) {
			return NextResponse.json(
				{ message: 'Пользователь не авторизован' },
				{ status: 401 },
			)
		}

		// Находим пользователя по его ID для получения персональных данных
		const user = await db.collection('user').findOne({
			_id: ObjectId.createFromHexString(userId),
		})

		if (!user) {
			return NextResponse.json(
				{ message: 'Пользователь не найден' },
				{ status: 404 },
			)
		}

		// Округляем бонусы до целых чисел (нельзя использовать дробные бонусы)
		const roundedUsedBonuses = Math.floor(orderData.usedBonuses || 0)
		const roundedEarnedBonuses = Math.floor(orderData.totalBonuses || 0)
		
		// Округляем денежные суммы до копеек (2 знака после запятой)
		const roundedTotalAmount =
			Math.round((orderData.finalPrice || 0) * 100) / 100
		const roundedDiscountAmount =
			Math.round((orderData.totalDiscount || 0) * 100) / 100

		// Формируем объект заказа
		const order = {
			userId: user._id,
			// Уникальный номер заказа: timestamp + случайное 3-значное число
			orderNumber: `${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`,
			status: 'pending', // Статус заказа (pending, processing, completed, cancelled)
			paymentMethod: orderData.paymentMethod, // cash_on_delivery или online
			// Статус оплаты зависит от способа оплаты
			paymentStatus:
				orderData.paymentMethod === 'cash_on_delivery'
					? 'pending'  // Наличные - оплата при получении
					: 'waiting', // Онлайн - ожидает оплаты
			totalAmount: roundedTotalAmount,           // Итоговая сумма к оплате
			discountAmount: roundedDiscountAmount,     // Скидка от карты лояльности
			usedBonuses: roundedUsedBonuses,           // Использовано бонусов
			earnedBonuses: roundedEarnedBonuses,       // Будет начислено бонусов
			deliveryAddress: orderData.deliveryAddress, // Адрес доставки
			deliveryDate: orderData.deliveryTime.date,  // Дата доставки (YYYY-MM-DD)
			deliveryTimeSlot: orderData.deliveryTime.timeSlot, // Временной слот (08:00-14:00)
			// Персональные данные пользователя (копируются из профиля)
			surname: user.surname,
			name: user.name,
			phone: user.phoneNumber,
			gender: user.gender,
			birthday: user.birthdayDate,
			// Товары в заказе с ценами и скидками
			items: orderData.cartItems.map(
				(item: {
					productId: string
					quantity: number
					price: number
					discountPercent?: number
					hasLoyaltyDiscount?: boolean
				}) => ({
					productId: item.productId,
					quantity: item.quantity,
					price: Math.round((item.price || 0) * 100) / 100,
					discountPercent: item.discountPercent,      // Скидка товара
					hasLoyaltyDiscount: item.hasLoyaltyDiscount, // Применена ли карта лояльности
				}),
			),
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		// Сохраняем заказ в БД
		const result = await db.collection('orders').insertOne(order)

		return NextResponse.json({
			success: true,
			order: {
				...order,
				_id: result.insertedId,
			},
			orderNumber: order.orderNumber,
		})
	} catch (error) {
		console.error('Ошибка создания заказа:', error)
		return NextResponse.json(
			{ message: 'Внутренняя ошибка сервера' },
			{ status: 500 },
		)
	}
}
