import { getDaysDates } from '@/app/(root)/(admin)/administrator/delivery-times/utils/getDaysDates'
import { getDB } from '@/lib/api-routes'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Cron endpoint для автоматического обновления графика доставки
 * GET /api/cron/update-delivery-dates?secret=<CRON_SECRET>
 *
 * Логика работы:
 * 1. Проверяет секретный ключ для защиты от несанкционированного доступа
 * 2. Получает текущий график доставки из БД
 * 3. Вычисляет актуальные даты (сегодня + 2 дня вперед)
 * 4. Удаляет устаревшие даты (вчерашние и более старые)
 * 5. Добавляет новые даты с копированием слотов из предыдущего дня
 * 6. Сохраняет обновленный график в БД
 *
 * Должен запускаться ежедневно (например, в 00:00) через cron или внешний сервис
 * Команда для ручного запуска: npm run update-delivery-dates
 *
 * @example
 *  Сегодня 16 апреля, в БД есть даты: 15, 16, 17 апреля
 *  После выполнения будут даты: 16, 17, 18 апреля
 *  Дата 15 апреля удалена (прошла), дата 18 апреля добавлена
 */
export async function GET(request: NextRequest) {
	try {
		// Проверяем секретный ключ из переменной окружения
		const secret = request.nextUrl.searchParams.get('secret')
		if (secret !== process.env.CRON_SECRET) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const db = await getDB()
		const deliverySettings = await db
			.collection('delivery-times')
			.findOne({})

		if (!deliverySettings) {
			return NextResponse.json({
				success: false,
				message: 'Настройки доставки не найдены',
			})
		}

		const currentSchedule = deliverySettings.schedule || {}

		// Получаем актуальные даты (сегодня + 2 дня)
		const newDates = getDaysDates()
		const currentDates = Object.keys(currentSchedule)

		// Находим даты для удаления (устаревшие, которых нет в newDates)
		const datesToRemove = currentDates.filter(
			date => !newDates.includes(date),
		)
		// Находим даты для добавления (новые, которых нет в currentDates)
		const datesToAdd = newDates.filter(date => !currentDates.includes(date))

		const updatedSchedule = { ...currentSchedule }

		// Удаляем устаревшие даты
		datesToRemove.forEach(date => {
			delete updatedSchedule[date]
		})

		// Добавляем новые даты
		datesToAdd.forEach(newDate => {
			// Пытаемся скопировать слоты из предыдущего дня
			const prevDate = new Date(newDate)
			prevDate.setDate(prevDate.getDate() - 1)
			const prevDateStr = prevDate.toISOString().split('T')[0]

			if (updatedSchedule[prevDateStr]) {
				// Копируем слоты из предыдущего дня (все слоты становятся свободными)
				updatedSchedule[newDate] = { ...updatedSchedule[prevDateStr] }
			} else {
				// Если предыдущего дня нет - создаем дефолтные слоты
				updatedSchedule[newDate] = {
					'08:00-14:00': true,
					'14:00-18:00': true,
					'18:00-20:00': true,
					'20:00-22:00': true,
				}
			}
		})

		// Сохраняем обновленный график в БД
		await db.collection('delivery-times').updateOne(
			{},
			{
				$set: {
					schedule: updatedSchedule,
					updatedAt: new Date(),
				},
			},
		)

		return NextResponse.json({
			success: true,
			message: `Расписание обновлено. Добавлены даты: ${datesToAdd.join(', ')}, удалены даты: ${datesToRemove.join(', ')}`,
			addedDates: datesToAdd,
			removedDates: datesToRemove,
			currentDates: Object.keys(updatedSchedule),
			updatedAt: new Date().toISOString(),
		})
	} catch (error) {
		console.error('Ошибка cron:', error)
		return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
	}
}
