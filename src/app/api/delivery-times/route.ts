import { getDB } from '@/lib/api-routes'
import { Schedule } from '@/types/deliverySchedule'
import { NextResponse } from 'next/server'

/**
 * API Route для работы с графиком доставки
 * Используется в админ-панели для управления временными слотами доставки
 */

/**
 * GET /api/delivery-times
 * Получает текущий график доставки из БД
 * 
 * @returns Объект с расписанием в формате:
 * {
 *   schedule: {
 *     "2026-04-16": { "08:00-14:00": true, "14:00-20:00": false },
 *     "2026-04-17": { "08:00-14:00": true, "14:00-20:00": true }
 *   }
 * }
 * где true - слот свободен, false - занят
 */
export async function GET() {
	try {
		const db = await getDB()
		// В коллекции delivery-times хранится один документ с графиком
		const deliveryTimes = await db.collection('delivery-times').findOne({})

		return NextResponse.json({
			schedule: deliveryTimes?.schedule || {},
		})
	} catch {
		return NextResponse.json(
			{ message: 'Ошибка при загрузке графика доставки' },
			{ status: 500 },
		)
	}
}

/**
 * POST /api/delivery-times
 * Сохраняет график доставки в БД
 * Используется в админ-панели при нажатии кнопки "Сохранить"
 * 
 * @param request - Тело запроса с объектом schedule
 * @returns Объект с флагом успеха
 */
export async function POST(request: Request) {
	try {
		const { schedule } = (await request.json()) as { schedule: Schedule }
		const db = await getDB()

		// Используем upsert: true для создания документа, если его нет
		// Обновляем единственный документ в коллекции (фильтр {})
		await db.collection('delivery-times').updateOne(
			{},
			{
				$set: {
					schedule: schedule || {},
					updatedAt: new Date(),
				},
			},
			{ upsert: true },
		)

		return NextResponse.json({
			success: true,
			message: 'График доставки сохранен',
		})
	} catch {
		return NextResponse.json(
			{ message: 'Ошибка при сохранении графика доставки' },
			{ status: 500 },
		)
	}
}
