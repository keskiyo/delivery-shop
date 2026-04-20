import { UserRole } from '@/types/userData'

/**
 * Возвращает CSS классы для стилизации бейджа роли пользователя
 * 
 * @param role - Роль пользователя ('admin' | 'manager' | 'user')
 * @returns Строка с Tailwind CSS классами для фона и цвета текста
 * 
 * @example
 * getRoleStyles('admin')   // "bg-[#ffc7c7] text-[#d80000]" (красный)
 * getRoleStyles('manager') // "bg-[#e5ffde] text-[#008c48]" (зеленый)
 * getRoleStyles('user')    // "bg-[#f3f2f1] text-[#414141]" (серый)
 */
export const getRoleStyles = (role: UserRole) => {
	switch (role) {
		case 'admin':
			return 'bg-[#ffc7c7] text-[#d80000]'
		case 'manager':
			return 'bg-[#e5ffde] text-[#008c48]'
		default:
			return 'bg-[#f3f2f1] text-[#414141]'
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
