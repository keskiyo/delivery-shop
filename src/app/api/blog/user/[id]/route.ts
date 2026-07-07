import { getDB } from '@/lib/api-routes'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

/**
 * @swagger
 * /api/blog/user/{id}:
 *   get:
 *     tags: [Blog, Users]
 *     summary: Публичные данные автора (имя, пол)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: '{ gender, fullName }'
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params
		const db = await getDB()

		const user = await db
			.collection('user')
			.findOne(
				{ _id: new ObjectId(id) },
				{ projection: { gender: 1, name: 1, surname: 1 } },
			)

		if (!user) {
			return NextResponse.json(
				{ error: 'Пользователь не найден' },
				{ status: 404 },
			)
		}

		return NextResponse.json({
			gender: user.gender,
			fullName: `${user.name} ${user.surname}`,
		})
	} catch (error) {
		console.error('Ошибка получения пользователя:', error)
		return NextResponse.json(
			{ error: 'Внутренняя ошибка сервера' },
			{ status: 500 },
		)
	}
}
