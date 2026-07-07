


import { getOrderCartAction } from '@/actions/orderActions'
import { NextResponse } from 'next/server'

/**
 * @swagger
 * /api/cart:
 *   get:
 *     tags: [Cart]
 *     summary: Товары корзины текущего пользователя
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200:
 *         description: Массив позиций корзины
 *       500:
 *         description: Ошибка сервера (возвращает [])
 */
export async function GET() {
  try {
    const cartItems = await getOrderCartAction()
    return NextResponse.json(cartItems)
  } catch (error) {
    console.error('Error in cart API:', error)
    return NextResponse.json([], { status: 500 })
  }
}
