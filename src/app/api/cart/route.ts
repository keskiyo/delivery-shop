// Назначение: API-маршрут для получения корзины текущего пользователя.
// Как работает: Читает параметры запроса, обращается к базе данных или файлам проекта и возвращает JSON-ответ с результатом или ошибкой. Методы: GET.

import { getOrderCartAction } from '@/actions/orderActions'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cartItems = await getOrderCartAction()
    return NextResponse.json(cartItems)
  } catch (error) {
    console.error('Error in cart API:', error)
    return NextResponse.json([], { status: 500 })
  }
}
