const articles = require('./articlesData.json')

module.exports = {
	async up(db) {
		await db.collection('articles').insertMany(articles)
	},

	async down(db) {
		await db.collection('articles').deleteMany({})
	},
}
