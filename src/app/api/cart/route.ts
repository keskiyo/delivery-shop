import { getOrderCartAction } from '@/actions/orderActions'
import { NextResponse } from 'next/server'

/**
 * API route для получения корзины пользователя
 * GET /api/cart
 * 
 * Используется для:
 * - Отображения содержимого корзины на странице /cart
 * - Получения текущего состояния корзины для расчета цен
 * - Проверки наличия товаров в корзине
 * 
 * Вызывает Server Action getOrderCartAction which:
 *   1. Получает ID текущего пользователя через getServerUserId()
 *   2. Находит пользователя в БД по ID
 *   3. Возвращает массив товаров из поля cart пользователя
 *   4. Если пользователь не авторизован - возвращает пустой массив
 * 
 * @returns JSON массив товаров в корзине или пустой массив при ошибке
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
