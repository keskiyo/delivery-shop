


import { getDB } from '@/lib/api-routes'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { deleteUserAvatar } from '../../../../../utils/deleteUserAvatar'

/**
 * @swagger
 * /api/auth/delete-account:
 *   post:
 *     tags: [Auth]
 *     summary: Удалить аккаунт пользователя (и аватар)
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               userId: { type: string }
 *     responses:
 *       200:
 *         description: Аккаунт удалён
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
export async function POST(request: NextRequest) {
	try {
		const db = await getDB()
		const { userId } = await request.json()

		const userObjectId = ObjectId.createFromHexString(userId)

		const deleteResult = await db.collection('user').deleteOne({
			_id: userObjectId,
		})

		if (deleteResult.deletedCount === 0) {
			return NextResponse.json(
				{ message: 'Пользователь не найден' },
				{ status: 404 },
			)
		}

		await deleteUserAvatar(userId)

		return NextResponse.json(
			{ message: 'Аккаунт успешно удален' },
			{ status: 200 },
		)
	} catch (error) {
		console.error('Ошибка при удалении аккаунта:', error)

		return NextResponse.json(
			{
				message: 'Не удалось удалить аккаунт. Попробуйте позже.',
			},
			{ status: 500 },
		)
	}
}
