import { getDB } from '@/lib/api-routes'
import { ProductCardProps } from '@/types/product'
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
export const getPurchasesRaw = async (): Promise<ProductCardProps[]> => {
	const db = await getDB()

	const user = await db.collection('users').findOne({})

	if (!user?.purchases?.length) return []

	const productIds = user.purchases.map((p: { id: number }) => p.id)

	const products = await db
		.collection('products')
		.find({ id: { $in: productIds } })
		.toArray()

	return products.map(doc => {
		const product = mapToProduct(doc)
		const { discountPercent, ...rest } = product
		return rest
	})
}

// 🔹 Кешированная версия
export const getPurchases = unstable_cache(
	async () => getPurchasesRaw(),
	['purchases'],
	{ revalidate: 3600, tags: ['purchases'] },
)
