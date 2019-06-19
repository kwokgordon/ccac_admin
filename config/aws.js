const config = {
	'development': {
		'aws': {
			's3': {
				'bucket': 'calgarychinesealliancechurchdev',
				'region': 'us-west-2',
				'access_key': 'AKIAIL2HUSLUJZ56FNOA'
			}
		}
	},
	'testing': {
		'aws': {
			's3': {
				'bucket': 'calgarychinesealliancechurchtest',
				'region': 'us-west-2',
				'access_key': 'AKIAIL2HUSLUJZ56FNOA'
			}
		}
	},
	'production': {
		'aws': {
			's3': {
				'bucket': 'calgarychinesealliancechurch',
				'region': 'us-west-2',
				'access_key': 'AKIAIL2HUSLUJZ56FNOA'
			}
		}
	}
}

const environment = process.env.NODE_ENV || 'development'
module.exports = config[environment];

// module.exports = process.env.NODE_ENV === 'production' ? production : development;
