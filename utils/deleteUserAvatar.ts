import { getDB } from '@/lib/api-routes'
import { GridFSBucket, ObjectId } from 'mongodb'

/**
 * Удаляет аватар пользователя из GridFS хранилища
 * 
 * Используется при удалении аккаунта пользователя (вызывается из better-auth afterDelete hook)
 * Аватары хранятся в MongoDB GridFS в bucket 'avatars'
 * 
 * @param userId - ID пользователя, чей аватар нужно удалить
 * 
 * @example
 * // В better-auth конфигурации:
 * deleteUser: {
 *   enabled: true,
 *   afterDelete: async user => {
 *     await deleteUserAvatar(user.id)
 *   }
 * }
 */
export async function deleteUserAvatar(userId: string) {
	try {
		const db = await getDB()
		const bucket = new GridFSBucket(db, { bucketName: 'avatars' })
		const userIdObjectId = new ObjectId(userId)

		const avatarFile = await db.collection('avatars.files').findOne({
			'metadata.userId': userIdObjectId,
		})

		if (avatarFile) {
			await bucket.delete(avatarFile._id)
			console.log(
				`Аватар пользователя ${userId} удален после удаления аккаунта`,
			)
		}
	} catch (error) {
		console.error('Ошибка при удалении аватара:', error)
	}
}
