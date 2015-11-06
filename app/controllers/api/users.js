var path = require('path');
var shared = require(path.join(__basedir, 'app/controllers/shared_functions'));

var User = require(path.join(__basedir, 'app/models/user'));
var Role = require(path.join(__basedir, 'app/models/role'));

var Invitation = require(path.join(__basedir, 'app/models/invitation'));

/////////////////////////////////////////////////////////////////////////////
// routing - users api

module.exports = function(app, passport) {

	app.namespace('/api', shared.isLoggedIn, shared.checkPermission(["users"]), function() {
		
		// User API - to get all users in the database
		app.get('/getUsers', function(req, res) {
			
			User.find({}, {}, {sort: {'google.name':1}}, function(err, users) {
				if (err)
					res.send(err);
				
				res.json(users);
			});
		});

		// User API - to get all the available roles and permissions
		app.get('/getRoles', function(req, res) {

			Role.find({}, {}, {sort: {role:1, permissions:1}}, function(err, roles) {
				if (err)
					res.send(err);
				
				res.json(roles);
			});
		});

		// User API - to update the user roles and permissions
		app.post('/updateUser', function(req, res) {
			
			var update_user = req.body.user;
			
			User.findOne({'google.id': update_user.google.id}, function(err, user) {
				if (err)
					res.send(err);
				
				if (user) {
					user.role = update_user.role;
					user.permissions = update_user.permissions;
					
					user.save();

					var result = {user: user, messages: {info: user.google.email + " updated."}};
					res.json(result);
				} else {
					var result = {messages: {info: "User Not Found"}};
					res.json(result);
				}
			});
		});

		// User API - to delete the user 
		app.post('/deleteUser', function(req, res) {
			
			var delete_user = req.body.user;
			
			User.findOne({'google.id': delete_user.google.id}, function(err, user) {
				if (err)
					res.send(err);
				
				user.remove(function(err, user) {
					if (err)
						res.send(err);

					var result = {user: user, messages: {info: user.google.email + " deleted."}};
					res.json(result);
				});
				
			});
			
		});

		// User API - to add an user invitation with role and permissions
		app.post('/addInvitation', function(req, res) {
			
			var invitation = req.body.user;
			
			User.findOne({'google.email': invitation.email}, function(err, user) {
				if (err)
					res.send(err);
				
				if (user) {
					var result = {user: user, messages: {info: user.google.email + " already exists."}};
					res.json(result);
				} else {
					
					Invitation.findOne({'email': invitation.email}, function(err, invite) {
						if (err)
							res.send(err);
						
						if (invite) {
							invite.role = invitation.role;
							invite.permissions = invitation.permissions;
							
							invite.save();
							
							var result = {invite: invite, messages: {info: invite.email + " role/permissions updated."}};
							res.json(result);
						} else {
							Invitation.create({
								email: invitation.email,
								role: invitation.role,
								permissions: invitation.permissions
							}, function(err, invite) {
								if (err)
									res.send(err)
									
								var result = {invite: invite, messages: {info: invite.email + " is invited."}, sendEmail: true};
								res.json(result);
							});
						}
					});

				}
			});
		});
		
	});

}

