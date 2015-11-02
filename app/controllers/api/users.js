var path = require('path');
var shared = require(path.join(__basedir, 'app/controllers/shared_functions'));

var User = require(path.join(__basedir, 'app/models/user'));
var Role = require(path.join(__basedir, 'app/models/role'));

/////////////////////////////////////////////////////////////////////////////
// routing - admin api

module.exports = function(app, passport) {

	app.namespace('/api', shared.isLoggedIn, shared.checkPermission(["users"]), function() {
		
		// Admin API - to get all users in the database
		app.get('/getUsers', function(req, res) {
			
			User.find({}, {}, {sort: {'google.name':1}}, function(err, users) {
				if (err)
					res.send(err);
				
				res.json(users);
			});
		});

		// Admin API - to get all the available roles and permissions
		app.get('/getRoles', function(req, res) {

			Role.find({}, {}, {sort: {role:1, permissions:1}}, function(err, roles) {
				if (err)
					res.send(err);
				
				res.json(roles);
			});
		});

		// Admin API - to update the user roles and permissions
		app.post('/updateUser', function(req, res) {
			
			var update_user = req.body.user;
			
			User.findOne({'google.id': update_user.google.id}, function(err, user) {
				if (err)
					res.send(err);
				
				if (user) {
					user.role = update_user.role;
					user.permissions = update_user.permissions;
					
					user.save();
					
					res.json(user);
				} else {
					res.send("User Not Found");
				}
			});
		});

		// Admin API - to delete the user 
		app.post('/deleteUser', function(req, res) {
			
			var delete_user = req.body.user;
			
			User.findOne({'google.id': delete_user.google.id}, function(err, user) {
				if (err)
					res.send(err);
				
				user.remove(function(err, msg) {
					if (err)
						res.send(err);
					
					res.json(msg);
				});
				
			});
			
		});
		
	});

}

