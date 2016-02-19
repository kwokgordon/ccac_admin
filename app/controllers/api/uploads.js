var path = require('path');
var shared = require(path.join(__basedir, 'app/controllers/shared_functions'));

var awsConfig = require(path.join(__basedir, 'config/aws.js'));

/////////////////////////////////////////////////////////////////////////////
// routing - admin api

module.exports = function(app, passport) {

	app.namespace('/api/uploads', shared.isLoggedIn, shared.checkPermission(["uploads"]), function() {
		
		app.get('/aws_key', function(req, res) {
			res.json({
				aws: {
					s3: {
						bucket: awsConfig.aws.s3.bucket,
						region: awsConfig.aws.s3.region,
						access_key: awsConfig.aws.s3.access_key
					},
					accessKeyId: process.env.AWS_ACCESS_KEY_ID,
					secretAccessKey: process.env.AWS_SECRET_KEY
				}
			});
		});

	});

}

