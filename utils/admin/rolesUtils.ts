// Назначение: утилита rolesUtils.
// Как работает: Содержит переиспользуемую бизнес-логику, форматирование, расчеты или подготовку данных.

import { UserRole } from '@/types/userData'

export const getRoleStyles = (role: UserRole) => {
	switch (role) {
		case 'admin':
			return 'bg-danger-soft text-danger'
		case 'manager':
			return 'bg-success-soft text-success'
		default:
			return 'bg-surface-hover text-foreground'
	}
}

export const getRoleLabel = (role: UserRole) => {
	switch (role) {
		case 'admin':
			return 'Администратор'
		case 'manager':
			return 'Менеджер'
		default:
			return 'Пользователь'
	}
}
