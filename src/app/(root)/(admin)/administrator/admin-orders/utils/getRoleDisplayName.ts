// Назначение: читаемое название роли.
// Как работает: Переводит admin, manager и user в русскую подпись для таблиц.

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
