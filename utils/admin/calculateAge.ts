// Назначение: расчет возраста пользователя.
// Как работает: Сравнивает дату рождения с текущей датой и учитывает день рождения в этом году.

export const calculateAge = (birthday: string): number => {
	if (!birthday) return 0

	const birthDate = new Date(birthday)
	const today = new Date()
	let age = today.getFullYear() - birthDate.getFullYear()
	const monthDiff = today.getMonth() - birthDate.getMonth()

	if (
		monthDiff < 0 ||
		(monthDiff === 0 && today.getDate() < birthDate.getDate())
	) {
		age--
	}

	return age
}
