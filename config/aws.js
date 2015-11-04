var development = {
	'aws' : {
		's3' : {
			'bucket': 'calgarychinesealliancechurch',
			'region': 'us-west-2',
			'access_key': 'AKIAJX2R7YNMTQQJTMHA'
		}
	}
};

var production = {
	'aws' : {
		's3' : {
			'bucket': 'calgarychinesealliancechurch',
			'region': 'us-west-2',
			'access_key': 'AKIAJX2R7YNMTQQJTMHA'
		}
	}
};

module.exports = process.env.NODE_ENV === 'development' ? development : production;

