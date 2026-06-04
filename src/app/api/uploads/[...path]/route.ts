// Назначение: API-маршрут uploads/[...path].
// Как работает: Методы: GET. Валидирует входные данные, обращается к нужным сервисам и возвращает JSON-ответ.

import fs from 'fs'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	try {
		const resolvedParams = await params
		const filePath = resolvedParams.path.join('/')
		const publicFullPath = path.join(
			process.cwd(),
			'public',
			'uploads',
			filePath,
		)
		const legacyFullPath = path.join(process.cwd(), 'uploads', filePath)
		const fullPath = fs.existsSync(publicFullPath)
			? publicFullPath
			: legacyFullPath

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
