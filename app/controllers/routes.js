var path = require('path');
var configSecret = require(path.join(__basedir, 'config/secret.js'));
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

/////////////////////////////////////////////////////////////////////////////
// routing

module.exports = function(app) {

	// Welcome page
	app.get('/', function(req, res) {
		res.render('main/index');
	});
	
}

