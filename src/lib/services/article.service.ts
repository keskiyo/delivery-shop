import { getDB } from '@/lib/api-routes'
import { ArticlesProps } from '@/types/articles'
import { ObjectId } from 'mongodb'
import { unstable_cache } from 'next/cache'

// 🔹 Преобразование документа MongoDB в тип ArticlesProps
const mapToArticle = (doc: any): ArticlesProps => ({
	_id: doc._id instanceof ObjectId ? doc._id.toString() : doc._id,
	id: doc.id,
	img: doc.img,
	title: doc.title,
	text: doc.text,
	createdAt:
		doc.createdAt instanceof Date
			? doc.createdAt.toISOString()
			: doc.createdAt,
})

// 🔹 Основная функция — прямой запрос к БД
export const getArticlesRaw = async (): Promise<ArticlesProps[]> => {
	const db = await getDB()
	const articles = await db.collection('articles').find({}).toArray()

	return articles.map(mapToArticle)
}

// 🔹 Кешированная версия
export const getArticles = unstable_cache(
	async () => getArticlesRaw(),
	['articles'],
	{ revalidate: 3600, tags: ['articles'] },
)
