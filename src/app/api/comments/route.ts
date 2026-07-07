import { getDB } from '@/lib/api-routes'
import { NextRequest, NextResponse } from 'next/server'

/**
 * @swagger
 * /api/comments:
 *   get:
 *     tags: [Comments]
 *     summary: Комментарии статьи
 *     parameters:
 *       - in: query
 *         name: articleId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: '{ comments }'
 *       400:
 *         description: Не указан articleId
 *       500:
 *         description: Ошибка сервера
 *   post:
 *     tags: [Comments]
 *     summary: Создать комментарий к статье
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [articleId, content, authorId, authorName, authorRole]
 *             properties:
 *               articleId: { type: string }
 *               parentId: { type: string, nullable: true }
 *               content: { type: string }
 *               authorId: { type: string }
 *               authorName: { type: string }
 *               authorRole: { type: string }
 *     responses:
 *       200:
 *         description: Созданный комментарий
 *       400:
 *         description: Не хватает данных
 *       500:
 *         description: Ошибка сервера
 */
export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams
		const articleId = searchParams.get('articleId')

		if (!articleId) {
			return NextResponse.json(
				{ error: 'Не указан articleId' },
				{ status: 400 },
			)
		}

		const db = await getDB()

		const comments = await db
			.collection('comments')
			.find({
				articleId,
			})
			.sort({ createdAt: -1 })
			.toArray()

		const formattedComments = comments.map(comment => ({
			...comment,
			_id: comment._id.toString(),
			createdAt: comment.createdAt.toISOString(),
			updatedAt: comment.updatedAt.toISOString(),
		}))

		return NextResponse.json({ comments: formattedComments })
	} catch (error) {
		console.error('Ошибка загрузки комментариев:', error)
		return NextResponse.json(
			{ error: 'Внутренняя ошибка сервера' },
			{ status: 500 },
		)
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const {
			articleId,
			parentId,
			content,
			authorId,
			authorName,
			authorRole,
		} = body

		if (!articleId || !content || !authorId || !authorName || !authorRole) {
			return NextResponse.json(
				{ error: 'Не хватает данных для создания комментария' },
				{ status: 400 },
			)
		}

		const db = await getDB()

		const newComment = {
			articleId,
			parentId: parentId || null,
			content: content.trim(),
			authorId,
			authorName,
			authorRole,
			likes: [],
			isEdited: false,
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		const result = await db.collection('comments').insertOne(newComment)

		return NextResponse.json({
			_id: result.insertedId.toString(),
			...newComment,
			createdAt: newComment.createdAt.toISOString(),
			updatedAt: newComment.updatedAt.toISOString(),
			replies: [],
		})
	} catch (error) {
		console.error('Ошибка создания комментария:', error)
		return NextResponse.json(
			{ error: 'Внутренняя ошибка сервера' },
			{ status: 500 },
		)
	}
}
