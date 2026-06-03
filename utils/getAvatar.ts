// Назначение: выбор дефолтного аватара по полу.
// Как работает: Возвращает путь к стандартной картинке, если пользователь не загрузил свой аватар.

export const getAvatarByGender = (gender?: string) => {
	if (gender === 'male') return '/images/graphics/defaultAvatars/male.png'
	if (gender === 'female') return '/images/graphics/defaultAvatars/female.png'

	return '/images/graphics/defaultAvatars/male.png'
}
