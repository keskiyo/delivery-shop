/**
 * Проверяет наличие загруженного аватара у пользователя
 * 
 * Отправляет запрос на API для проверки существования аватара в GridFS
 * Используется для определения, показывать ли дефолтный аватар или загруженный
 * 
 * @param userId - ID пользователя
 * @returns true если аватар существует, false если нет или произошла ошибка
 * 
 * @example
 * const hasAvatar = await checkAvatarExist(user.id)
 * if (hasAvatar) {
 *   // Загружаем аватар с сервера
 * } else {
 *   // Показываем дефолтный аватар
 * }
 */
export const checkAvatarExist = async (userId: string): Promise<boolean> => {
	try {
		const response = await fetch(`/api/auth/avatar/${userId}/check`)
		const data = await response.json()

		return data.exists
	} catch {
		return false
	}
}
