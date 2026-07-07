


import { getDB } from '@/lib/api-routes'
import { Order } from '@/types/order'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'
import { getServerUserId } from '../../../../utils/getServerUserId'

/**
 * @swagger
 * /api/orders:
 *   post:
 *     tags: [Orders]
 *     summary: Создать заказ
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentMethod: { type: string, example: cash_on_delivery }
 *               finalPrice: { type: number }
 *               totalDiscount: { type: number }
 *               usedBonuses: { type: number }
 *               totalBonuses: { type: number }
 *               deliveryAddress: { type: string }
 *               deliveryTime:
 *                 type: object
 *                 properties:
 *                   date: { type: string }
 *                   timeSlot: { type: string }
 *               cartItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId: { type: string }
 *                     quantity: { type: integer }
 *                     price: { type: number }
 *     responses:
 *       200:
 *         description: Заказ создан (success + order + orderNumber)
 *       401:
 *         description: Не авторизован
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 *   get:
 *     tags: [Orders]
 *     summary: Заказы текущего пользователя
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200:
 *         description: '{ success, orders }'
 *       401:
 *         description: Не авторизован
 *       500:
 *         description: Ошибка сервера
 */
export async function POST(request: Request) {
	try {
		const db = await getDB()
		const orderData = await request.json()

		const userId = await getServerUserId()

		if (!userId) {
			return NextResponse.json(
				{ message: 'Пользователь не авторизован' },
				{ status: 401 },
			)
		}

		const user = await db.collection('user').findOne({
			_id: ObjectId.createFromHexString(userId),
		})

		if (!user) {
			return NextResponse.json(
				{ message: 'Пользователь не найден' },
				{ status: 404 },
			)
		}

		const roundedUsedBonuses = Math.floor(orderData.usedBonuses || 0)
		const roundedEarnedBonuses = Math.floor(orderData.totalBonuses || 0)

		const roundedTotalAmount =
			Math.round((orderData.finalPrice || 0) * 100) / 100
		const roundedDiscountAmount =
			Math.round((orderData.totalDiscount || 0) * 100) / 100

		const order = {
			userId: user._id,

			orderNumber: `${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`,
			status: 'pending',
			paymentMethod: orderData.paymentMethod,

			paymentStatus:
				orderData.paymentMethod === 'cash_on_delivery'
					? 'pending'
					: 'waiting',
			totalAmount: roundedTotalAmount,
			discountAmount: roundedDiscountAmount,
			usedBonuses: roundedUsedBonuses,
			earnedBonuses: roundedEarnedBonuses,
			deliveryAddress: orderData.deliveryAddress,
			deliveryDate: orderData.deliveryTime.date,
			deliveryTimeSlot: orderData.deliveryTime.timeSlot,

			surname: user.surname,
			name: user.name,
			phone: user.phoneNumber,
			gender: user.gender,
			birthday: user.birthdayDate,

			
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
					discountPercent: item.discountPercent,
					hasLoyaltyDiscount: item.hasLoyaltyDiscount,
				}),
			),
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		
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

export async function GET() {
	try {
		const db = await getDB()
		const userId = await getServerUserId()

		if (!userId) {
			return NextResponse.json(
				{ message: 'Пользователь не авторизован' },
				{ status: 401 },
			)
		}

		const orders = (await db
			.collection('orders')
			.find({ userId: ObjectId.createFromHexString(userId) })
			.sort({ createdAt: -1 })
			.toArray()) as unknown as Order[]

		if (!orders || orders.length === 0) {
			return NextResponse.json({
				success: true,
				orders: [],
			})
		}

		return NextResponse.json({
			success: true,
			orders: orders,
		})
	} catch (error) {
		console.error('Ошибка получения заказов:', error)
		return NextResponse.json(
			{ message: 'Внутренняя ошибка сервера' },
			{ status: 500 },
		)
	}
}
