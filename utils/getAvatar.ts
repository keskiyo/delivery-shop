/**
 * Возвращает путь к дефолтному аватару в зависимости от пола пользователя
 * 
 * Используется когда у пользователя нет загруженного аватара
 * 
 * @param gender - Пол пользователя ('male' | 'female')
 * @returns Путь к изображению дефолтного аватара
 * 
 * @example
 * getAvatarByGender('male')   // '/images/graphics/defaultAvatars/male.png'
 * getAvatarByGender('female') // '/images/graphics/defaultAvatars/female.png'
 * getAvatarByGender()         // '/images/graphics/defaultAvatars/male.png' (по умолчанию)
 */
export const getAvatarByGender = (gender?: string) => {
	if (gender === 'male') return '/images/graphics/defaultAvatars/male.png'
	if (gender === 'female') return '/images/graphics/defaultAvatars/female.png'

	return '/images/graphics/defaultAvatars/male.png'
}
