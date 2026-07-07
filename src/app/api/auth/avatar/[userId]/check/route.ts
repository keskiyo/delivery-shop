


import { getDB } from '@/lib/api-routes'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

/**
 * @swagger
 * /api/auth/avatar/{userId}/check:
 *   get:
 *     tags: [Auth]
 *     summary: Есть ли у пользователя аватар
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: '{ exists: boolean }'
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ userId: string }> },
) {
	try {
		const { userId } = await params
		const db = await getDB()

		if (!userId) {
			return NextResponse.json({ exists: false }, { status: 400 })
		}

		let userIdObjectId
		try {
			userIdObjectId = new ObjectId(userId)
		} catch {
			return NextResponse.json({ exists: false }, { status: 400 })
		}

		const fileExists = await db.collection('avatars.files').findOne({
			'metadata.userId': userIdObjectId,
		})

		return NextResponse.json({ exists: !!fileExists })
	} catch {
		return NextResponse.json({ exists: false }, { status: 500 })
	}
}
