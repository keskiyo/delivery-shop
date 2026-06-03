// Назначение: API-маршрут для получения одного товара.
// Как работает: Читает параметры запроса, обращается к базе данных или файлам проекта и возвращает JSON-ответ с результатом или ошибкой. Методы: GET.

import { getDB } from '@/lib/api-routes'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params
		const db = await getDB()

		const product = await db
			.collection('products')
			.findOne({ id: parseInt(id) })

		if (!product) {
			return NextResponse.json(
				{ message: 'Продукт не найден' },
				{ status: 404 },
			)
		}

		return NextResponse.json(product)
	} catch (error) {
		console.error('Ошибка при получении продукта:', error)
		return NextResponse.json(
			{ message: 'Ошибка сервера при получении продукта' },
			{ status: 500 },
		)
	}
}
