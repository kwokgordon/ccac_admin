var development = {
	'googleAuth' : {
		'clientID'      : '309887982453-rsvvdnv8i8s5kdqlg6secruves71pl8r.apps.googleusercontent.com',
		'clientSecret'  : 'g_Rev9TPYXmFZp5EqfE8chop',
		'callbackURL'   : 'http://localhost:3100/auth/google/callback'
	}
};

var production = {
	'googleAuth' : {
		'clientID'      : '309887982453-rsvvdnv8i8s5kdqlg6secruves71pl8r.apps.googleusercontent.com',
		'clientSecret'  : 'g_Rev9TPYXmFZp5EqfE8chop',
		'callbackURL'   : 'http://localhost:3100/auth/google/callback'
	}
};

module.exports = process.env.NODE_ENV === 'development' ? development : production;

