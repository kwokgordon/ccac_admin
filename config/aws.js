var development = {
	'aws' : {
		's3' : {
			'bucket': 'calgarychinesealliancechurch',
			'region': 'us-west-2',
			'access_key': 'AKIAIL2HUSLUJZ56FNOA'
		}
	}
};

var production = {
	'aws' : {
		's3' : {
			'bucket': 'calgarychinesealliancechurch',
			'region': 'us-west-2',
			'access_key': 'AKIAIL2HUSLUJZ56FNOA'
		}
	}
};

module.exports = process.env.NODE_ENV === 'development' ? development : production;
