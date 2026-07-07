


import { getDB } from '@/lib/api-routes'
import { GridFSBucket, ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

/**
 * @swagger
 * /api/auth/upload-avatar:
 *   post:
 *     tags: [Auth]
 *     summary: Загрузить аватар пользователя (multipart, в GridFS)
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [avatar, userId]
 *             properties:
 *               avatar: { type: string, format: binary }
 *               userId: { type: string }
 *     responses:
 *       200:
 *         description: '{ success, avatarId }'
 *       400:
 *         description: Нет файла или userId
 *       500:
 *         description: Ошибка сервера
 */
export async function POST(request: NextRequest) {
	const db = await getDB()

	try {
		const formData = await request.formData()

		const file = formData.get('avatar') as File

		const userId = formData.get('userId') as string

		if (!file || !userId) {
			return NextResponse.json(
				{ error: 'Файл и userId обязательны' },
				{ status: 400 },
			)
		}

		const bucket = new GridFSBucket(db, { bucketName: 'avatars' })
		const userIdObj = new ObjectId(userId)

		const existingAvatar = await db.collection('avatars.files').findOne({
			'metadata.userId': userIdObj,
		})

		if (existingAvatar) {
			try {
				await bucket.delete(existingAvatar._id)
			} catch (deleteError) {
				console.warn('Не удалось удалить старый аватар:', deleteError)
			}
		}

		const bytes = await file.arrayBuffer()
		const buffer = Buffer.from(bytes)

		const uploadStream = bucket.openUploadStream(file.name, {
			metadata: {
				userId: userIdObj,
				originalName: file.name,
				uploadedAt: new Date(),
			},
		})

		uploadStream.end(buffer)

		const fileId = await new Promise<ObjectId>((resolve, reject) => {
			uploadStream.on('finish', () => resolve(uploadStream.id))
			uploadStream.on('error', reject)
		})

		return NextResponse.json({
			success: true,
			avatarId: fileId.toString(),
		})
	} catch (error) {
		console.error('Ошибка загрузки аватара:', error)
		return NextResponse.json(
			{ error: 'Ошибка загрузки аватара' },
			{ status: 500 },
		)
	}
}
