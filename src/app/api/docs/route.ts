import { NextResponse } from 'next/server'
import { getApiDocs } from '@/lib/swagger'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

export const dynamic = 'force-dynamic'
const GENERATED_SPEC_PATH = join(process.cwd(), 'public', 'api-docs', 'openapi.json')

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
	if (process.env.NODE_ENV === 'production' && existsSync(GENERATED_SPEC_PATH)) {
		const spec = JSON.parse(readFileSync(GENERATED_SPEC_PATH, 'utf8'))
		return NextResponse.json(spec)
	}

	const spec = getApiDocs()
	return NextResponse.json(spec)
}
