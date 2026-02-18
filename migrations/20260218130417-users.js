const users = require('./usersData.json')

module.exports = {
	async up(db) {
		await db.collection('users').insertMany(users)
	},

	async down(db) {
		await db.collection('users').deleteMany({})
	},
}
