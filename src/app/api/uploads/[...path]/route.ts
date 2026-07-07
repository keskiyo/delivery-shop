import fs from 'fs'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'

/**
 * @swagger
 * /api/uploads/{path}:
 *   get:
 *     tags: [Uploads]
 *     summary: Отдать загруженный файл (картинки товаров/аватары)
 *     parameters:
 *       - in: path
 *         name: path
 *         required: true
 *         schema: { type: string }
 *         description: Путь к файлу внутри uploads (например products/img-133.png)
 *     responses:
 *       200:
 *         description: Бинарный файл
 *         content:
 *           image/png: {}
 *           image/jpeg: {}
 *           image/webp: {}
 *       404:
 *         description: Файл не найден
 *       500:
 *         description: Ошибка сервера
 */
export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	try {
		const resolvedParams = await params
		const filePath = resolvedParams.path.join('/')
		const fullPath = path.join(process.cwd(), 'uploads', filePath)

		if (!fs.existsSync(fullPath)) {
			return NextResponse.json(
				{ error: 'File not found' },
				{ status: 404 },
			)
		}

		const fileContent = fs.readFileSync(fullPath)
		const ext = path.extname(fullPath).toLowerCase()
		const contentType =
			ext === '.png'
				? 'image/png'
				: ext === '.jpg' || ext === '.jpeg'
					? 'image/jpeg'
					: ext === '.webp'
						? 'image/webp'
						: 'application/octet-stream'

		return new NextResponse(fileContent, {
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 'public, max-age=31536000, immutable',
			},
		})
	} catch (error) {
		console.error('API Error:', error)
		return NextResponse.json({ error: 'Internal error' }, { status: 500 })
	}
}
