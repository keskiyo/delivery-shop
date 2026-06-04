// Назначение: React-хук useDeliveryData.
// Как работает: Инкапсулирует состояние, эффекты и обработчики, чтобы компоненты не дублировали эту логику.

import { Schedule } from '@/types/deliverySchedule'
import { useEffect, useState } from 'react'

interface DeliveryTimes {
	schedule: Schedule
	updatedAt: string
}

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
