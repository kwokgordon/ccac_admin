var development = {
	'googleAuth' : {
		'clientID'      : '',
		'clientSecret'  : '',
		'callbackURL'   : 'http://localhost:8080/auth/google/callback'
	}
};

var production = {
	'googleAuth' : {
		'clientID'      : '',
		'clientSecret'  : '',
		'callbackURL'   : 'http://localhost:8080/auth/google/callback'
	}
};

module.exports = process.env.NODE_ENV === 'development' ? development : production;

