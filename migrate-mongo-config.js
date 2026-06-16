
require('dotenv').config()

const config = {
	mongodb: {
		
		url: process.env.FOOD_DELIVERY_DB_URL,

		
		databaseName: process.env.FOOD_DELIVERY_DB_NAME,

		options: {
			
			
			
			
		},
	},

	
	migrationsDir: 'migrations',

	
	changelogCollectionName: 'changelog',

	
	lockCollectionName: 'changelog_lock',

	
	lockTtl: 0,

	
	migrationFileExtension: '.js',

	
	
	useFileHash: false,

	
	moduleSystem: 'commonjs',
}

module.exports = config
