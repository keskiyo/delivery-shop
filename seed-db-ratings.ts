import 'dotenv/config'
import { MongoClient } from 'mongodb'

async function updateProductsDistribution() {
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
			
			const distribution = {
				'1': 0,
				'2': 0,
				'3': 0,
				'4': 0,
				'5': 0,
			}

			return {
				updateOne: {
					filter: { _id: product._id },
					update: {
						$set: {
							'rating.rate': 5.0, 
							'rating.count': 0, 
							'rating.distribution': distribution, 
						},
					},
				},
			}
		})

		
		if (bulkUpdateOps.length > 0) {
			const result = await productsCollection.bulkWrite(bulkUpdateOps)
			console.log(`Обновлено ${result.modifiedCount} продуктов`)
			console.log('Обновлены значения rating:')
			console.log('rate: 5.0, count: 0')
			console.log('distribution: 1:0, 2:0, 3:0, 4:0, 5:0')
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

updateProductsDistribution()


