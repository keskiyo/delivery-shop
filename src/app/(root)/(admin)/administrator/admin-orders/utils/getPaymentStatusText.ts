// Назначение: утилита getPaymentStatusText.
// Как работает: Содержит переиспользуемую бизнес-логику, форматирование, расчеты или подготовку данных.

import { Order } from '@/types/order'

export const getPaymentStatusText = (
	paymentStatus: Order['paymentStatus'],
): string => {
	switch (paymentStatus) {
		case 'pending':
			return 'Ожидает оплаты'
		case 'waiting':
			return 'Ожидание подтверждения'
		case 'paid':
			return 'Оплачен'
		case 'failed':
			return 'Ошибка оплаты'
		default:
			return paymentStatus
	}
}
