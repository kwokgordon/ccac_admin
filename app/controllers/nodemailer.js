var path = require('path');
var shared = require(path.join(__basedir, 'app/controllers/shared_functions'));

var nodemailer = require('nodemailer');
var config = require(path.join(__basedir, 'config/nodemailer.js'));

/////////////////////////////////////////////////////////////////////////////
// Nodemailer Routes

module.exports = function(app, passport) {

	app.namespace('/email', shared.isLoggedIn, nodemailerInit, function() {

		// first page after login successful
		app.post('/sendEmail', function(req, res) {

			var mailOption = {
				from: config.nodemailer.user,
				to: req.body.to,
				subject: req.body.subject,
				generateTextFromHTML: true,
				html: req.body.html
			};

			req.transport.sendMail(mailOption, function(err, mail) {
				if (err)
					res.send(err);
				
				var result = {mail: mail, messages:{info:"Invitation to " + req.body.to + " is sent." }};
				res.json(result);
			});
		});

	});
}


nodemailerInit = function(req, res, next) {

	// setup nodemailer
	req.transport = nodemailer.createTransport("SMTP", {
		service: "Gmail",
		auth: {
			XOAuth2: {
				user: config.nodemailer.user,
				clientId: config.nodemailer.clientId,
				clientSecret: config.nodemailer.clientSecret,
				refreshToken: config.nodemailer.refreshToken
			}
		}
	});

	return next();
}
