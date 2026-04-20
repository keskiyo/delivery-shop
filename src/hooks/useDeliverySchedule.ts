import { convertTimeToMinutes } from '@/app/(root)/(admin)/administrator/delivery-times/utils/convertTimeToMinuts'
import { getDaysDates } from '@/app/(root)/(admin)/administrator/delivery-times/utils/getDaysDates'
import { Schedule } from '@/types/deliverySchedule'
import { useCallback, useState } from 'react'

/**
 * Хук для управления графиком доставки в админ-панели
 * Позволяет создавать временные слоты, управлять их доступностью по дням
 * 
 * График работает на 3 дня вперед (сегодня + 2 дня)
 * Каждый временной слот имеет формат "08:00-14:00" и может быть свободен (true) или занят (false)
 */
export function useDeliverySchedule() {
	// Расписание: { "2026-04-16": { "08:00-14:00": true, "14:00-20:00": false } }
	const [schedule, setSchedule] = useState<Schedule>({})
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [message, setMessage] = useState('')
	const [error, setError] = useState('')
	const [startTime, setStartTime] = useState('08:00')
	const [endTime, setEndTime] = useState('14:00')
	// Список всех временных слотов (применяются ко всем дням)
	const [timeSlots, setTimeSlots] = useState<string[]>([])

	// Получаем массив дат на 3 дня вперед
	const dates = getDaysDates()

	const showMessage = useCallback((text: string) => {
		setMessage(text)
	}, [])

	// Создает пустое расписание для всех дат (если в БД ничего нет)
	const initializeEmptySchedule = useCallback(() => {
		const emptySchedule: Schedule = {}

		dates.forEach(date => {
			emptySchedule[date] = {}
		})

		setSchedule(emptySchedule)
	}, [dates])

	// Загружает график доставки из БД
	// Если график есть - загружает его, если нет - создает пустой
	const fetchDeliveryTimes = useCallback(async () => {
		try {
			const response = await fetch('/api/delivery-times')
			const data = await response.json()

			if (data.schedule && Object.keys(data.schedule).length > 0) {
				const loadedSchedule = data.schedule as Schedule
				const updatedSchedule: Schedule = {}

				// Обновляем расписание только для актуальных дат (3 дня)
				dates.forEach(date => {
					updatedSchedule[date] = loadedSchedule[date]
						? { ...loadedSchedule[date] }
						: {}
				})

				setSchedule(updatedSchedule)

				// Собираем все уникальные временные слоты из всех дней
				const slots = new Set(
					dates.flatMap(date =>
						Object.keys(updatedSchedule[date] || {}),
					),
				)

				setTimeSlots(Array.from(slots))
			} else {
				initializeEmptySchedule()
			}
		} catch {
			setError('Ошибка загрузки графика доставки')
			initializeEmptySchedule()
		} finally {
			setLoading(false)
		}
	}, [dates, initializeEmptySchedule])

	// Добавляет новый временной слот для всех дней
	// Проверяет корректность времени и отсутствие пересечений с существующими слотами
	const addTimeSlot = useCallback(() => {
		setError('')

		if (!startTime.trim() || !endTime.trim()) {
			setError('Заполните оба поля времени')
			return
		}

		// Конвертируем время в минуты для сравнения (08:00 -> 480)
		const startMinutes = convertTimeToMinutes(startTime)
		const endMinutes = convertTimeToMinutes(endTime)

		if (startMinutes >= endMinutes) {
			setError('Время начала должно быть раньше времени окончания')
			return
		}

		const timeSlotValue = `${startTime}-${endTime}`

		// Проверяем, не пересекается ли новый слот с существующими
		// Пересечение есть если:
		// 1. Начало нового слота попадает в существующий
		// 2. Конец нового слота попадает в существующий
		// 3. Новый слот полностью покрывает существующий
		const hasOverlap = timeSlots.some(existingSlot => {
			const [existingStart, existingEnd] = existingSlot.split('-')
			const existingStartMinutes = convertTimeToMinutes(existingStart)
			const existingEndMinutes = convertTimeToMinutes(existingEnd)

			return (
				(startMinutes >= existingStartMinutes &&
					startMinutes < existingEndMinutes) ||
				(endMinutes > existingStartMinutes &&
					endMinutes <= existingEndMinutes) ||
				(startMinutes <= existingStartMinutes &&
					endMinutes >= existingEndMinutes)
			)
		})

		if (hasOverlap) {
			setError('Временной слот пересекается с существующими слотами')
			return
		}

		const updatedTimeSlots = [...timeSlots, timeSlotValue]
		setTimeSlots(updatedTimeSlots)

		const updatedSchedule: Schedule = { ...schedule }

		// Добавляем новый слот для всех дней как свободный (true)
		dates.forEach(date => {
			if (!updatedSchedule[date]) updatedSchedule[date] = {}
			updatedSchedule[date][timeSlotValue] = true
		})

		setSchedule(updatedSchedule)
		showMessage('Временной слот добавлен для всех дней')
	}, [startTime, endTime, timeSlots, schedule, dates, showMessage])

	// Обновляет статус временного слота для конкретного дня
	// free: true - слот свободен, false - занят
	const updateTimeSlotStatus = useCallback(
		(date: string, timeSlot: string, free: boolean) => {
			setSchedule(prev => ({
				...prev,
				[date]: {
					...prev[date],
					[timeSlot]: free,
				},
			}))
		},
		[],
	)

	// Удаляет временной слот из всех дней
	const removeTimeSlot = useCallback(
		(slotToRemove: string) => {
			setError('')

			const updatedTimeSlots = timeSlots.filter(
				slot => slot !== slotToRemove,
			)
			setTimeSlots(updatedTimeSlots)

			const updatedSchedule: Schedule = { ...schedule }

			// Удаляем слот из каждого дня
			dates.forEach(date => {
				if (updatedSchedule[date]) {
					delete updatedSchedule[date][slotToRemove]
				}
			})

			setSchedule(updatedSchedule)
			showMessage('Временной слот удален из всех дней')
		},
		[timeSlots, schedule, dates, showMessage],
	)

	// Сохраняет график доставки в БД
	// Отправляет только актуальные даты (3 дня) с их временными слотами
	const saveDeliveryTimes = useCallback(async () => {
		setError('')
		setSaving(true)
		setMessage('')

		try {
			const scheduleToSend: Schedule = {}

			// Формируем расписание для отправки
			// Если слот не отмечен как false - считаем его свободным (true)
			dates.forEach(date => {
				scheduleToSend[date] = {}
				timeSlots.forEach(slot => {
					scheduleToSend[date][slot] =
						schedule[date]?.[slot] !== false
				})
			})

			const response = await fetch('/api/delivery-times', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ schedule: scheduleToSend }),
			})

			const result = await response.json()

			if (result.success) {
				showMessage('График доставки успешно сохранен!')
			} else {
				setError(result.error || 'Ошибка при сохранении')
			}
		} catch (err) {
			console.error('Ошибка сохранения:', err)
			setError('Ошибка при сохранении графика доставки')
		} finally {
			setSaving(false)
		}
	}, [dates, timeSlots, schedule, showMessage])

	return {
		schedule,
		loading,
		saving,
		message,
		error,
		startTime,
		endTime,
		timeSlots,
		setStartTime,
		setEndTime,
		fetchDeliveryTimes,
		showMessage,
		addTimeSlot,
		updateTimeSlotStatus,
		removeTimeSlot,
		saveDeliveryTimes,
	}
}
