// Назначение: утилита getUniqueCities.
// Как работает: Содержит переиспользуемую бизнес-логику, форматирование, расчеты или подготовку данных.

import { Order } from '@/types/order'

export const getUniqueCities = (orders: Order[]) => {
	const cities = new Set(
		orders
			.map(order => order.deliveryAddress?.city)
			.filter(city => city && city !== ''),
	)

	return ['Все города', ...cities]
}
