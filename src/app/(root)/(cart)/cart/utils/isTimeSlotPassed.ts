/**
 * Проверяет, прошел ли временной слот доставки
 * Используется для блокировки выбора слотов, которые уже недоступны сегодня
 *
 * Логика:
 * - Если выбран не сегодняшний день - слот всегда доступен (return false)
 * - Если выбран сегодняшний день - проверяем, не прошло ли время окончания слота
 *
 * @param timeSlot - Временной слот в формате "08:00-14:00"
 * @param date - Дата в формате "YYYY-MM-DD" (например, "2026-04-16")
 * @returns true если слот уже прошел (недоступен), false если еще доступен
 *
 * @example
 *  Сейчас 15:00, проверяем слот 08:00-14:00 на сегодня
 * isTimeSlotPassed("08:00-14:00", "2026-04-16") // true (слот прошел)
 *
 * Сейчас 15:00, проверяем слот 16:00-20:00 на сегодня
 * isTimeSlotPassed("16:00-20:00", "2026-04-16") // false (слот еще доступен)
 *
 * Проверяем любой слот на завтра
 * isTimeSlotPassed("08:00-14:00", "2026-04-17") // false (завтра всегда доступен)
 */
export const isTimeSlotPassed = (timeSlot: string, date: string): boolean => {
	const now = new Date()

	// Создаем объект даты из selectedDate (формат YYYY-MM-DD)
	const [year, month, day] = date.split('-').map(Number)
	const selectedDateObj = new Date(year, month - 1, day)

	// Получаем сегодняшнюю дату без времени (обнуляем часы, минуты, секунды)
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

	// Если выбран не сегодняшний день, слот не прошел (всегда доступен)
	if (selectedDateObj.getTime() !== today.getTime()) {
		return false
	}

	// Получаем время окончания слота (вторая часть после дефиса)
	const [, endTime] = timeSlot.split('-')
	const [endHours, endMinutes] = endTime.split(':').map(Number)

	// Создаем объект времени окончания слота на сегодня
	const slotEndTime = new Date()
	slotEndTime.setHours(endHours, endMinutes, 0, 0)

	// Сравниваем с текущим временем: если сейчас позже окончания слота - он прошел
	return now > slotEndTime
}
