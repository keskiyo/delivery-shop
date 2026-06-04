// Назначение: утилита getStatusColor.
// Как работает: Содержит переиспользуемую бизнес-логику, форматирование, расчеты или подготовку данных.

import { Order } from '@/types/order'

export const getStatusColor = (order: Order) => {
	if (order.paymentMethod === 'online') {
		if (order.paymentStatus === 'paid' && order.status === 'confirmed') {
			return 'bg-surface text-foreground'
		} else if (order.paymentStatus === 'failed') {
			return 'bg-danger text-white'
		} else if (
			order.paymentStatus === 'waiting' &&
			order.status === 'pending'
		) {
			return 'bg-surface text-foreground'
		}
	}

	if (order.paymentMethod === 'cash_on_delivery') {
		if (order.status === 'pending' && order.paymentStatus === 'pending') {
			return 'bg-success-soft text-success'
		} else if (order.status === 'confirmed') {
			return 'bg-surface text-foreground'
		}
	}

	switch (order.status) {
		case 'pending':
		case 'confirmed':
			return 'bg-surface text-foreground'
		case 'delivered':
			return 'bg-success text-white'
		case 'cancelled':
		case 'failed':
			return 'bg-danger text-white'
		case 'refund':
		case 'returned':
			return 'bg-warning-soft text-warning'
		case 'collected':
			return 'bg-success-soft text-success'
		case 'delivering':
			return 'bg-success-soft text-success'
		default:
			return 'bg-surface text-foreground'
	}
}
