// Назначение: API-маршрут blog/categories.
// Как работает: Методы: GET. Валидирует входные данные, обращается к нужным сервисам и возвращает JSON-ответ.

import { BlogCategory } from '@/app/(root)/(blog)/blog/categories/types/categories.types'
import { getDB } from '@/lib/api-routes'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const db = await getDB()
		const categories = await db
			.collection<BlogCategory>('article-category')
			.find({})
			.sort({ createdAt: -1 })
			.toArray()

		return NextResponse.json({
			success: true,
			data: categories,
		})
	} catch (error) {
		console.error('Ошибка получения категорий:', error)
		return NextResponse.json(
			{ success: false, message: 'Ошибка получения категорий' },
			{ status: 500 },
		)
	}
}
