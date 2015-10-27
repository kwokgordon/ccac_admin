var development = {
	'aws' : {
		's3' : {
			'bucket': 'calgarychinesealliancechurch',
			'region': 'us-west-2',
			'access_key': 'AKIAJX2R7YNMTQQJTMHA'
		}
	},
	'http_auth' : {
		'username': 'ccac',
		'password': 'ccac_admin',
		'secret': 'Secret Text'
	}
};

var production = {
	'aws' : {
		's3' : {
			'bucket': 'calgarychinesealliancechurch',
			'region': 'us-west-2',
			'access_key': 'AKIAJX2R7YNMTQQJTMHA'
		}
	},
	'http_auth' : {
		'username': 'ccac',
		'password': 'ccac_admin',
		'secret': 'Secret Text'
	}
};

module.exports = process.env.NODE_ENV === 'development' ? development : production;
