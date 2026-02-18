import { getDB } from '@/lib/api-routes'
import { NextResponse } from 'next/server'
export const revalidate = 3600

export async function GET() {
	try {
		const db = await getDB()

		const articles = await db.collection('articles').find({}).toArray()

		return NextResponse.json(articles)
	} catch (error) {
		console.error('Ошибка api articles', error)
		return NextResponse.error()
	}
}
