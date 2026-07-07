import { NextResponse } from 'next/server'
import { getApiDocs } from '@/lib/swagger'

export const dynamic = 'force-dynamic'

/**
 * @swagger
 * /api/docs:
 *   get:
 *     tags: [Docs]
 *     summary: OpenAPI-спека API (JSON)
 *     description: Сгенерированная из JSDoc-аннотаций спецификация OpenAPI 3.0.3.
 *     responses:
 *       200:
 *         description: OpenAPI-документ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
export async function GET() {
	const spec = getApiDocs()
	return NextResponse.json(spec)
}
