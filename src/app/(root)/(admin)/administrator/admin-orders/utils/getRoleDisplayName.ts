// Назначение: утилита getRoleDisplayName.
// Как работает: Содержит переиспользуемую бизнес-логику, форматирование, расчеты или подготовку данных.

export const getRoleDisplayName = (role: string) => {
	switch (role) {
		case 'admin':
			return '(администратор)'
		case 'manager':
			return '(менеджер)'
		case 'courier':
			return '(доставщик)'
		default:
			return '(пользователь)'
	}
}
