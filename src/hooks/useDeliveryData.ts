import { Schedule } from '@/types/deliverySchedule'
import { useEffect, useState } from 'react'

/**
 * Интерфейс ответа API с расписанием доставки
 */
interface DeliveryTimes {
	schedule: Schedule
	updatedAt: string
}

/**
 * Хук для загрузки расписания доставки с сервера
 * 
 * Используется:
 * - При выборе даты доставки в корзине
 * - При оформлении заказа для отображения доступных слотов
 * - В компонентах выбора даты и времени
 * 
 * @returns Объект с расписанием доставки и состоянием загрузки
 */
export const useDeliveryData = () => {
	const [deliverySchedule, setDeliverySchedule] = useState<Schedule>({})
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchDeliverySchedule = async () => {
			try {
				const response = await fetch('/api/delivery-times')
				if (response.ok) {
					const data: DeliveryTimes = await response.json()
					setDeliverySchedule(data.schedule || {})
				}
			} catch (error) {
				console.error('Ошибка загрузки расписания доставки:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchDeliverySchedule()
	}, [])

	return { deliverySchedule, loading }
}
