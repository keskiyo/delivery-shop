import { MongoClient } from 'mongodb'

/**
 * Глобальный клиент MongoDB
 * Создается один раз при старте приложения
 */
const client = new MongoClient(process.env.FOOD_DELIVERY_DB_URL!)

/**
 * Promise подключения к MongoDB
 * Переиспользуется во всех API routes для избежания множественных подключений
 */
const clientPromise = client.connect()

/**
 * Получает экземпляр базы данных MongoDB
 * 
 * Использует переменные окружения:
 * - FOOD_DELIVERY_DB_URL: URL подключения к MongoDB
 * - FOOD_DELIVERY_DB_NAME: Имя базы данных (обычно 'deliveryshop')
 * 
 * @returns Promise с экземпляром базы данных
 * 
 * @example
 * const db = await getDB()
 * const products = await db.collection('products').find({}).toArray()
 */
export const getDB = async () => {
	return (await clientPromise).db(process.env.FOOD_DELIVERY_DB_NAME!)
}
