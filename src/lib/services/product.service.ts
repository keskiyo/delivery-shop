import { getDB } from '@/lib/api-routes'
import { ProductCardProps } from '@/types/product'
import { shuffleArray } from '@/utils/shuffleArray'
import { ObjectId } from 'mongodb'
import { unstable_cache } from 'next/cache'

// 🔹 Преобразование документа MongoDB в тип ProductCardProps
const mapToProduct = (doc: any): ProductCardProps => ({
	_id: doc._id instanceof ObjectId ? doc._id.toString() : doc._id,
	id: doc.id,
	title: doc.title,
	img: doc.img,
	basePrice: doc.basePrice,
	description: doc.description,
	discountPercent: doc.discountPercent,
	rating: {
		rate: doc.rating?.rate ?? 0,
		count: doc.rating?.count ?? 0,
	},
	weight: doc.weight,
	volume: doc.volume,
	categories: doc.categories || [],
	quantity: doc.quantity,
})

// 🔹 Основная функция — прямой запрос к БД
export const getProductsByCategoryRaw = async (
	category: string,
): Promise<ProductCardProps[]> => {
	const db = await getDB()
	const products = await db
		.collection('products')
		.find({ categories: category })
		.toArray()

	return products.map(mapToProduct)
}

// 🔹 Кешированная версия с фильтрацией и перемешиванием
export const getProductsByCategory = (category: string) =>
	unstable_cache(
		async () => {
			const products = await getProductsByCategoryRaw(category)
			const available = products.filter(p => p.quantity > 0)
			return shuffleArray(available)
		},
		[`products-${category}`],
		{ revalidate: 3600, tags: [`products-${category}`] },
	)()
