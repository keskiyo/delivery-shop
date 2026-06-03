// Назначение: проверка наличия аватара.
// Как работает: Обращается к API аватара и возвращает простой boolean для UI.

export const checkAvatarExist = async (userId: string): Promise<boolean> => {
	try {
		const response = await fetch(`/api/auth/avatar/${userId}/check`)
		const data = await response.json()

		return data.exists
	} catch {
		return false
	}
}
