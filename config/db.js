const config = {
	'development': {
		'db': {
			'mongo': 'mongodb://ccac:ccac@52.42.78.163:27017/CCAC_DEV'
		}
	},
	'testing': {
		'db': {
			'mongo': 'mongodb://ccac:ccac@127.0.0.1:27017/CCAC_TEST'
		}
	},
	'production': {
		'db': {
			'mongo': 'mongodb://ccac:ccac@52.42.78.163:27017/CCAC'
		}
	}
}

const environment = process.env.NODE_ENV || 'development'
module.exports = config[environment];

// module.exports = process.env.NODE_ENV === 'production' ? production : development;
