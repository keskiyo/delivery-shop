import { UserRole } from '@/types/userData'

/**
 * Возвращает CSS классы для стилизации бейджа роли пользователя
 * 
 * @param role - Роль пользователя ('admin' | 'manager' | 'user')
 * @returns Строка с Tailwind CSS классами для фона и цвета текста
 * 
 * @example
 * getRoleStyles('admin')   // danger-токены
 * getRoleStyles('manager') // success-токены
 * getRoleStyles('user')    // neutral-токены
 */
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

/**
 * Возвращает русское название роли пользователя
 * 
 * @param role - Роль пользователя ('admin' | 'manager' | 'user')
 * @returns Русское название роли
 * 
 * @example
 * getRoleLabel('admin')   // "Администратор"
 * getRoleLabel('manager') // "Менеджер"
 * getRoleLabel('user')    // "Пользователь"
 */
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
