// Назначение: утилита getAvatar.
// Как работает: Содержит переиспользуемую бизнес-логику, форматирование, расчеты или подготовку данных.

export const getAvatarByGender = (gender?: string) => {
	if (gender === 'male') return '/images/graphics/defaultAvatars/male.png'
	if (gender === 'female') return '/images/graphics/defaultAvatars/female.png'

	return '/images/graphics/defaultAvatars/male.png'
}
