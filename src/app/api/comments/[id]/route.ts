import { getDB } from '@/lib/api-routes'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     tags: [Comments]
 *     summary: Удалить комментарий (мягко)
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Комментарий помечен удалённым
 *       404:
 *         description: Комментарий не найден
 *       500:
 *         description: Ошибка сервера
 *   patch:
 *     tags: [Comments]
 *     summary: Редактировать комментарий (только автор)
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
 *             required: [content, userId]
 *             properties:
 *               content: { type: string }
 *               userId: { type: string }
 *     responses:
 *       200:
 *         description: Комментарий обновлён
 *       400:
 *         description: Пустой / удалённый комментарий
 *       403:
 *         description: Нет прав на редактирование
 *       404:
 *         description: Комментарий не найден
 *       500:
 *         description: Ошибка сервера
 */
export async function DELETE(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params
		const db = await getDB()

		const result = await db.collection('comments').updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: {
					content: '[Комментарий удален]',
					isDeleted: true,
					deletedAt: new Date(),
					updatedAt: new Date(),
				},
			},
		)

		if (result.matchedCount === 0) {
			return NextResponse.json(
				{ error: 'Комментарий не найден' },
				{ status: 404 },
			)
		}

		const updatedComment = await db.collection('comments').findOne({
			_id: new ObjectId(id),
		})

		if (!updatedComment) {
			return NextResponse.json(
				{ error: 'Комментарий не найден после обновления' },
				{ status: 404 },
			)
		}

		return NextResponse.json({
			success: true,
			comment: {
				_id: updatedComment._id.toString(),
				content: updatedComment.content,
				isDeleted: updatedComment.isDeleted,
				deletedAt: updatedComment.deletedAt.toISOString(),
			},
		})
	} catch (error) {
		console.error('Ошибка удаления комментария:', error)
		return NextResponse.json(
			{ error: 'Внутренняя ошибка сервера' },
			{ status: 500 },
		)
	}
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params
		const { content, userId } = await request.json()

		if (!content?.trim()) {
			return NextResponse.json(
				{ error: 'Комментарий не может быть пустым' },
				{ status: 400 },
			)
		}

		const db = await getDB()
		const commentId = new ObjectId(id)

		const comment = await db.collection('comments').findOne({
			_id: commentId,
		})

		if (!comment) {
			return NextResponse.json(
				{ error: 'Комментарий не найден' },
				{ status: 404 },
			)
		}

		if (comment.authorId !== userId) {
			return NextResponse.json(
				{ error: 'Нет прав на редактирование' },
				{ status: 403 },
			)
		}

		if (comment.isDeleted) {
			return NextResponse.json(
				{ error: 'Нельзя редактировать удаленный комментарий' },
				{ status: 400 },
			)
		}

		const now = new Date()
		await db.collection('comments').updateOne(
			{ _id: commentId },
			{
				$set: {
					content: content.trim(),
					isEdited: true,
					editedAt: now,
					updatedAt: now,
				},
			},
		)

		return NextResponse.json({
			success: true,
			content: content.trim(),
			isEdited: true,
			editedAt: now.toISOString(),
		})
	} catch (error) {
		console.error('Ошибка редактирования комментария:', error)
		return NextResponse.json(
			{ error: 'Внутренняя ошибка сервера' },
			{ status: 500 },
		)
	}
}
