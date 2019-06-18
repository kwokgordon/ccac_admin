var development = {
	'nodemailer' : {
		'user' : 'website@calgarychinesealliance.org',
		'clientId' : '309887982453-jq3dgsto1n2jl0sgpsppqdl3bufu2p7n.apps.googleusercontent.com',
		'clientSecret' : '_6jrY9F89ikXqhg4kJBcx3AU',
		'refreshToken' : '1/gTS--mBHH_zTmIUBnxUP82x14WnU-WF_1I4HAZ5S0apIgOrJDtdun6zK6XiATCKT'
	}
};

var production = {
	'nodemailer' : {
		'user' : 'website@calgarychinesealliance.org',
		'clientId' : '309887982453-jq3dgsto1n2jl0sgpsppqdl3bufu2p7n.apps.googleusercontent.com',
		'clientSecret' : '_6jrY9F89ikXqhg4kJBcx3AU',
		'refreshToken' : '1/gTS--mBHH_zTmIUBnxUP82x14WnU-WF_1I4HAZ5S0apIgOrJDtdun6zK6XiATCKT'
	}
};

module.exports = process.env.NODE_ENV === 'production' ? production : development;
