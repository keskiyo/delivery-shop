const products = require('./productsData.json')

module.exports = {
	async up(db) {
		await db.collection('products').insertMany(products)
	},

	async down(db) {
		await db.collection('products').deleteMany({})
	},
}
