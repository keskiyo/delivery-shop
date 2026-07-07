import fs from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'

/**
 * @swagger
 * /api/upload-image:
 *   post:
 *     tags: [Uploads, Admin]
 *     summary: Загрузить картинку товара (multipart)
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image, imageId]
 *             properties:
 *               image: { type: string, format: binary }
 *               imageId: { type: string, description: 'id товара; сохраняется как img-{imageId}.jpeg' }
 *     responses:
 *       200:
 *         description: success + product (id, img, filename)
 *       400:
 *         description: Нет файла / не изображение / >5MB
 *       500:
 *         description: Ошибка сервера
 */
export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData()
		const image = formData.get('image') as File
		const imageId = formData.get('imageId') as string

		if (!image) {
			return NextResponse.json(
				{ error: 'Файл не загружен' },
				{ status: 400 },
			)
		}

		if (!imageId) {
			return NextResponse.json(
				{ error: 'ID изображения не указан' },
				{ status: 400 },
			)
		}

		if (!image.type.includes('image')) {
			return NextResponse.json(
				{ error: 'Загруженный файл не является изображением' },
				{ status: 400 },
			)
		}

		if (image.size > 5 * 1024 * 1024) {
			return NextResponse.json(
				{ error: 'Файл слишком большой (макс. 5MB)' },
				{ status: 400 },
			)
		}

		const filename = `img-${imageId}.jpeg`
		const UploadDir = path.join(process.cwd(), 'uploads', 'products')
		const fullPath = path.join(UploadDir, filename)

		try {
			await fs.access(UploadDir)
		} catch {
			await fs.mkdir(UploadDir, { recursive: true })
		}

		const bytes = await image.arrayBuffer()
		const buffer = Buffer.from(bytes)
		await fs.writeFile(fullPath, buffer)

		const imagePath = `/api/uploads/products/${filename}`

		return NextResponse.json({
			success: true,
			product: {
				id: parseInt(imageId),
				img: imagePath,
				filename: filename,
			},
		})
	} catch (error) {
		console.error('Upload error:', error)
		return NextResponse.json(
			{ error: 'Ошибка сервера при загрузке изображения' },
			{ status: 500 },
		)
	}
}
