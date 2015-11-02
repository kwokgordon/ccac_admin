var path = require('path');
var shared = require(path.join(__basedir, 'app/controllers/shared_functions'));

var Sermon = require(path.join(__basedir, 'app/models/sermons'));

/////////////////////////////////////////////////////////////////////////////
// routing - admin api

module.exports = function(app, passport) {

	app.namespace('/api', shared.isLoggedIn, shared.checkPermission(["sermons"]), function() {
		
/*
		app.get('/aws_key', function(req, res) {
			res.json({
				accessKeyId: process.env.AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_SECRET_KEY			
			});
		});
*/	

		app.post('/getSermons', function(req, res) {
			var congregation = req.body.congregation;
			var last = { sermon_date: '9999' };
			var limit = 10;
			
			if(req.body.last) 
				last = req.body.last;
			
			if(req.body.limit) 
				limit = req.body.limit;
				
			Sermon.find({congregation: congregation, sermon_date: { $lt: last.sermon_date }}, {}, {sort: {sermon_date:-1}, limit: limit}, function(err, sermons) {
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
						if(x == "insert") {
							if(sermon.insert == undefined)
							sermon.insert.push(req.body.insert);
						}
						else {
							sermon[x] = req.body[x];
						}
					}
					
					sermon.save();

					res.json(sermon);
				} else {
					create_sermon(req, res);
				}
			});
		});

		app.get('/getBulletin/:congregation', function(req, res) {
			var congregation = req.params.congregation;
			
			Sermon.findOne({congregation: congregation, bulletin: {$exists:true} }, {}, {sort: {sermon_date:-1}}, function(err, sermon) {
				if (err)
					res.send(err);
				
				if(sermon)
					res.redirect(sermon.bulletin);
				else
					res.send("No file found");
			});
		});
		
	});

}

function create_sermon(req, res) {
	Sermon.create({
		congregation: req.body.congregation,
		sermon_date: req.body.sermon_date,
		title: req.body.title,
		sermon: req.body.sermon,
		bulletin: req.body.bulletin,
		life_group: req.body.life_group,
		ppt: req.body.ppt
	}, function(err, sermon) {
		if (err)
			res.send(err)
			
		if(req.body.insert != undefined) {
			sermon.insert.push(req.body.insert);
			sermon.save();
		}

		res.json(sermon);
	});
}