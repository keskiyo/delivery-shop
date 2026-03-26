import { getDB } from '@/lib/api-routes'
import { GridFSBucket, ObjectId } from 'mongodb'

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
