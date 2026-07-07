


import { getDB } from '@/lib/api-routes'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   post:
 *     tags: [Admin]
 *     summary: Изменить роль пользователя
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role: { type: string, enum: [user, admin, manager] }
 *     responses:
 *       200:
 *         description: Роль обновлена
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { role } = await request.json()
		const { id } = await params

		const db = await getDB()

		const result = await db
			.collection('user')
			.updateOne(
				{ _id: ObjectId.createFromHexString(id) },
				{ $set: { role, updatedAt: new Date() } },
			)

		if (result.modifiedCount === 0) {
			return NextResponse.json(
				{ error: 'Пользователь не найден или роль не изменена' },
				{ status: 404 },
			)
		}

		return NextResponse.json({
			success: true,
			id,
			role,
		})
	} catch (error) {
		console.error('Ошибка при обновлении роли пользователя:', error)
		return NextResponse.json(
			{ error: 'Ошибка при обновлении роли пользователя' },
			{ status: 500 },
		)
	}
}
