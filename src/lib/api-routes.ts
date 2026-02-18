import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.FOOD_DELIVERY_DB_URL!)

const clientPromise = client.connect()

export const getDB = async () => {
	return (await clientPromise).db(process.env.FOOD_DELIVERY_DB_NAME!)
}
