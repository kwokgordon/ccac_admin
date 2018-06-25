var path = require('path');
var shared = require(path.join(__basedir, 'app/controllers/shared_functions'));

var Feedback = require(path.join(__basedir, 'app/models/feedback'));

var nodemailer = require('nodemailer');
var config = require(path.join(__basedir, 'config/nodemailer.js'));

/////////////////////////////////////////////////////////////////////////////
// Nodemailer Routes

module.exports = function(app, passport) {

//	app.post('/sendFeedback', function(req, res) {
//		let transporter = nodemailer.createTransport({
//			host: 'smtp.gmail.com',
//			port: 587,
//			secure: false,
//			auth: {
//				user: process.env.EMAIL_USER,
//				pass: process.env.EMAIL_PASSWORD
//			}
//		});
//
//		let mailOptions = {
//			from: req.body.from,
//			to: req.body.to,
//			subject: req.body.subject,
//			text: req.body.text,
//		};
//		
//		transporter.sendMail(mailOptions, function(err, mail) {
//			if (err) {
//				console.log("In Error");
//				console.log(err);
//				res.send(err);
//			}
//				
//			var result = {mail: mail, messages:{info:"Feedback to " + req.body.to + " is sent." }};
//			res.json(result);
//		});
//		
//	});

	app.post('/sendAppFeedback', function(req, res) {
		Feedback.create({
			name: req.body.name,
			title: req.body.title,
			message: req.body.message,
		}, function(err, feedback) {
			if (err)
				res.send(err);

			res.json(feedback);
		});
	});

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

