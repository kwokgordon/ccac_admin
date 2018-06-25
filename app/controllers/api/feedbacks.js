var path = require('path');
var shared = require(path.join(__basedir, 'app/controllers/shared_functions'));

var Feedback = require(path.join(__basedir, 'app/models/feedback'));

/////////////////////////////////////////////////////////////////////////////
// routing - admin api

module.exports = function(app, passport) {

	app.namespace('/api/feedbacks', shared.isLoggedIn, shared.checkPermission(["feedbacks"]), function() {

		app.get('/getFeedbacks', function(req, res) {
			var congregation = req.body.congregation;
			Feedback.find({}, {}, {sort: {created_tms:-1}}, function(err, feedbacks) {
				if (err)
					res.send(err);

				res.json(feedbacks);
			});
		});

		app.post('/deleteFeedback', function(req, res) {
			Feedback.findOne({_id: req.body.id}, function(err, feedback) {
				if (err)
					res.send(err);

				feedback.remove(function(err, feedback) {
					if (err)
						res.send(err);

					res.json(feedback);
				});
			});

		});

	});
}
