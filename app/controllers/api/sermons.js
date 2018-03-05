var path = require('path');
var shared = require(path.join(__basedir, 'app/controllers/shared_functions'));

var Sermon = require(path.join(__basedir, 'app/models/sermon'));

var awsConfig = require(path.join(__basedir, 'config/aws.js'));

/////////////////////////////////////////////////////////////////////////////
// routing - admin api

module.exports = function(app, passport) {

	app.namespace('/api/sermons', shared.isLoggedIn, shared.checkPermission(["sermons"]), function() {

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

		app.post('/getSermons', function(req, res) {
			var congregation = req.body.congregation;
			Sermon.find({congregation: congregation}, {}, {sort: {sermon_date:-1}}, function(err, sermons) {
				if (err)
					res.send(err);

				res.json(sermons);
			});
		});

		app.post('/updateSermon', function(req, res) {
			var congregation = req.body.congregation;
			var sermon_date = req.body.sermon_date;

			Sermon.findOne({congregation: congregation, sermon_date: sermon_date}, function(err, sermon) {
				if (err)
					res.send(err);

				if(sermon) {
					for(var x in req.body) {
						sermon[x] = req.body[x];
					}

					if(sermon['bible_verses'] != undefined) {
						sermon['bible_verses'] = sermon['bible_verses'].replace('：', ':').replace('－', '-').replace('，', ',');
					}

					sermon.save();

					res.json(sermon);
				} else {
					var new_sermon = {};
					for(var x in req.body) {
						new_sermon[x] = req.body[x];
					}

					if(new_sermon['bible_verses'] != undefined) {
						new_sermon['bible_verses'] = new_sermon['bible_verses'].replace('：', ':').replace('－', '-').replace('，', ',');
					}
					
					Sermon.create(new_sermon, function(err, sermon) {
						if (err)
							res.send(err)

						res.json(sermon);
					});
				}
			});
		});

		// Sermons API - delete a sermon
		app.post('/deleteSermon', function(req, res) {

			var delete_sermon = req.body.sermon;
			var str = req.body.str;

			Sermon.findOne({congregation: delete_sermon.congregation, sermon_date: delete_sermon.sermon_date}, function(err, sermon) {
				if (err)
					res.send(err);

				if (str == "all") {
					sermon.remove(function(err, msg) {
						if (err)
							res.send(err);

						res.json(msg);
					});
				} else {
					sermon[str] = undefined;
					sermon.save();

					res.json(sermon);
				}
			});

		});
	});

}
