import { faker } from '@faker-js/faker'
import 'dotenv/config'
import { MongoClient } from 'mongodb'

async function addArticleField() {
	try {
		const client = new MongoClient(process.env.FOOD_DELIVERY_DB_URL!)
		await client.connect()
		console.log('Соединение с MongoDB')

		const db = client.db(process.env.FOOD_DELIVERY_DB_NAME!)
		const productsCollection = db.collection('products')

		
		const existingProducts = await productsCollection.find({}).toArray()
		console.log(
			`Найдено ${existingProducts.length} продуктов для изменения`,
		)

		
		const bulkUpdateOps = existingProducts.map(product => {
			
			const articleNumber = faker.number.int({ min: 0, max: 999999 })
			const article = articleNumber.toString().padStart(6, '0')

			return {
				updateOne: {
					filter: { _id: product._id },
					update: {
						$set: {
							article: article,
						},
					},
				},
			}
		})

		
		if (bulkUpdateOps.length > 0) {
			const result = await productsCollection.bulkWrite(bulkUpdateOps)
			console.log(`Обновлено ${result.modifiedCount} продуктов`)
			console.log('Добавлено поле article с шестизначными номерами')
		} else {
			console.log('Нет продуктов для обновления')
		}

		await client.close()
		console.log('Разорвано соединение с MongoDB')
	} catch (error) {
		console.error('Ошибка:', error)
		process.exit(1)
	}
}

addArticleField()


